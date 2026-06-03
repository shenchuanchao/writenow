import { createServerSupabase } from "@/lib/supabase/server";
import { generateAIResponse } from "@/lib/ai/providers";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { NextResponse } from "next/server";
import { getCost } from "@/constants";
import type { ToolType } from "@/types";

const GUEST_RATE_LIMIT = 60; // 每小时
const GUEST_MAX_OUTPUT_CHARS = 300;

export async function POST(request: Request) {
  const supabase = await createServerSupabase();

  // 1. 解析请求
  let body: { tool_type: ToolType; prompt: string; params?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "请求格式错误" }, { status: 400 });
  }

  const { tool_type, prompt, params } = body;

  if (!tool_type || !prompt?.trim()) {
    return NextResponse.json({ success: false, error: "缺少工具类型或文案描述" }, { status: 400 });
  }

  const validTools: ToolType[] = ["video_script", "xiaohongshu", "ecommerce", "moments"];
  if (!validTools.includes(tool_type)) {
    return NextResponse.json({ success: false, error: `不支持的工具类型: ${tool_type}` }, { status: 400 });
  }

  // 2. 判断是否登录
  const { data: { user } } = await supabase.auth.getUser();

  // ==============================
  // 游客分支（无限免费版 + 速率限制）
  // ==============================
  if (!user) {
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json({ success: false, error: "缺少设备标识" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    // === 速率限制：每小时 60 次 ===
    const hourBucket = new Date().toISOString().slice(0, 13); // "2026-06-03T15"

    try {
      const { data: rateRow, error: rateError } = await supabase
        .from("rate_limits")
        .select("count")
        .eq("device_id", deviceId)
        .eq("hour_bucket", hourBucket)
        .maybeSingle();

      if (rateError) {
        // 表不存在等非关键错误 → 记录日志但跳过快照限制
        console.error("[rate_limits] query error:", rateError.message);
      } else {
        const currentCount = rateRow?.count ?? 0;

        if (currentCount >= GUEST_RATE_LIMIT) {
          return NextResponse.json(
            { success: false, error: "使用过于频繁，请稍后再试（每小时 60 次）" },
            { status: 429 }
          );
        }

        // 递增速率计数器
        await supabase.from("rate_limits").upsert(
          {
            device_id: deviceId,
            hour_bucket: hourBucket,
            count: currentCount + 1,
            last_ip: ip,
          },
          { onConflict: "device_id,hour_bucket" }
        );
      }
    } catch (err) {
      // 极端情况下 skip 降级
      console.error("[rate_limits] unexpected error:", err);
    }

    // === 调用 AI（游客基础版：字数限制） ===
    let result: string;
    try {
      const systemPrompt = buildSystemPrompt(tool_type, params);
      result = await generateAIResponse(prompt, systemPrompt);
    } catch (aiError) {
      const errMsg = aiError instanceof Error ? aiError.message : "AI 生成失败";
      return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
    }

    // 截断至 300 字
    if (result.length > GUEST_MAX_OUTPUT_CHARS) {
      result = result.slice(0, GUEST_MAX_OUTPUT_CHARS).replace(/\s+\S*$/, "") + "...";
    }

    return NextResponse.json({
      success: true,
      data: { result, guest_unlimited: true },
    });
  }

  // ==============================
  // 已登录用户分支（原逻辑不变）
  // ==============================
  const userId = user.id;

  // 3. 计算所需点数
  const cost = getCost(tool_type, params);

  // 4. 获取并校验点数
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (!profile || profile.credits < cost) {
    return NextResponse.json(
      { success: false, error: "点数不足，请前往充值" },
      { status: 402 }
    );
  }

  const balanceBefore = profile.credits;

  // 5. 原子扣点（乐观锁）
  const { error: deductError } = await supabase
    .from("profiles")
    .update({ credits: balanceBefore - cost })
    .eq("id", userId)
    .eq("credits", balanceBefore);

  if (deductError) {
    return NextResponse.json({ success: false, error: "扣点失败，请重试" }, { status: 500 });
  }

  // 6. 调用 AI（含用户参数）
  let result: string;
  try {
    const systemPrompt = buildSystemPrompt(tool_type, params);
    result = await generateAIResponse(prompt, systemPrompt);
  } catch (aiError) {
    const errMsg = aiError instanceof Error ? aiError.message : "AI 生成失败";

    // AI 失败 → 退款
    await Promise.all([
      supabase.from("profiles").update({ credits: balanceBefore }).eq("id", userId),
      supabase.from("credit_transactions").insert({
        user_id: userId,
        type: "refund",
        amount: cost,
        balance_before: balanceBefore - cost,
        balance_after: balanceBefore,
        description: `AI 调用失败: ${errMsg}`,
      }),
    ]);

    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }

  const balanceAfter = balanceBefore - cost;

  // 7. 并行写入流水 + 历史记录
  await Promise.all([
    supabase.from("credit_transactions").insert({
      user_id: userId,
      type: "spend",
      amount: cost,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: `使用${tool_type}生成文案`,
    }),
    supabase.from("generation_history").insert({
      user_id: userId,
      tool_type,
      prompt,
      result,
      params: params || {},
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: { result, credits_remaining: balanceAfter },
  });
}