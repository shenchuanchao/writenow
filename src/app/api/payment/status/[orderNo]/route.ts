/**
 * GET /api/payment/status/[orderNo]
 *
 * 查询支付订单状态 - 前端轮询用
 * 需要登录，只能查询自己的订单
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderNo: string }> }
) {
  const { orderNo } = await context.params;

  // 简单鉴权：从 Authorization header 获取 token
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "未登录" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 验证 token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "未登录" },
      { status: 401 }
    );
  }

  // 查询订单（只能查自己的）
  const { data, error } = await supabase
    .from("payment_orders")
    .select("status, pay_url, amount, credits")
    .eq("order_no", orderNo)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: "订单不存在" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      order_no: orderNo,
      status: data.status,
      pay_url: data.pay_url || undefined,
      amount: data.amount,
      credits: data.credits,
    },
  });
}