import { createServerSupabase } from "@/lib/supabase/server";
import { generateAIResponse } from "@/lib/ai/providers";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { NextResponse } from "next/server";
import { getCost } from "@/constants";
import type { ToolType } from "@/types";

const GUEST_DAILY_LIMIT = 5;

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
  // 游客分支
  // ==============================
  if (!user) {
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json({ success: false, error: "缺少设备标识" }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    // 查询当日已用次数
    const { data: quota, error: quotaError } = await supabase
      .from("guest_daily_quota")
      .select("used_count")
      .eq("device_id", deviceId)
      .eq("quota_date", today)
      .maybeSingle();

    if (quotaError) {
      return NextResponse.json({ success: false, error: "配额查询失败" }, { status: 500 });
    }

    const used = quota?.used_count ?? 0;

    if (used >= GUEST_DAILY_LIMIT) {
      return NextResponse.json(
        { success: false, error: "今日免费次数已用完，登录后可获得更多点数" },
        { status: 403 }
      );
    }

    // 调用 AI
    let result: string;
    try {
      const systemPrompt = buildSystemPrompt(tool_type, params);
      result = await generateAIResponse(prompt, systemPrompt);
    } catch (aiError) {
      const errMsg = aiError instanceof Error ? aiError.message : "AI 生成失败";
      return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
    }

    // 写入配额
    await supabase.from("guest_daily_quota").upsert(
      {
        device_id: deviceId,
        quota_date: today,
        used_count: used + 1,
        last_ip: ip,
      },
      { onConflict: "device_id,quota_date" }
    );

    const remaining = GUEST_DAILY_LIMIT - (used + 1);

    return NextResponse.json({
      success: true,
      data: { result, guest_remaining: remaining },
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