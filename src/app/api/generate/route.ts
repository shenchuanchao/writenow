import { requireAuth } from "@/lib/auth/guard";
import { createServerSupabase } from "@/lib/supabase/server";
import { generateAIResponse } from "@/lib/ai/providers";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { NextResponse } from "next/server";
import { COST_PER_GENERATION } from "@/constants";
import type { ToolType } from "@/types";

export async function POST(request: Request) {
  // 1. 鉴权
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // 2. 解析请求
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

  const supabase = await createServerSupabase();
  const userId = auth.user!.id;

  // 3. 获取并校验点数
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (!profile || profile.credits < COST_PER_GENERATION) {
    return NextResponse.json(
      { success: false, error: "点数不足，请前往充值" },
      { status: 402 }
    );
  }

  const balanceBefore = profile.credits;

  // 4. 原子扣点（乐观锁）
  const { error: deductError } = await supabase
    .from("profiles")
    .update({ credits: balanceBefore - COST_PER_GENERATION })
    .eq("id", userId)
    .eq("credits", balanceBefore);

  if (deductError) {
    return NextResponse.json({ success: false, error: "扣点失败，请重试" }, { status: 500 });
  }

  // 5. 调用 AI（含用户参数）
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
        amount: COST_PER_GENERATION,
        balance_before: balanceBefore - COST_PER_GENERATION,
        balance_after: balanceBefore,
        description: `AI 调用失败: ${errMsg}`,
      }),
    ]);

    return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
  }

  const balanceAfter = balanceBefore - COST_PER_GENERATION;

  // 6. 并行写入流水 + 历史记录
  await Promise.all([
    supabase.from("credit_transactions").insert({
      user_id: userId,
      type: "spend",
      amount: COST_PER_GENERATION,
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