/**
 * POST /api/admin/payments/confirm
 *
 * 管理员手动确认线下支付订单
 * 更新订单状态 + 调用 add_credits 给用户加点数
 * 
 * 请求 body: { order_no: string }
 */

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();

  // Cookie-based 认证
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ success: false, error: "未登录" }, { status: 401 });
  }

  // 管理员鉴权：检查 profiles.is_admin 字段
  const { data: adminProfile, error: adminError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (adminError || !adminProfile?.is_admin) {
    return NextResponse.json({ success: false, error: "无权操作" }, { status: 403 });
  }

  // 解析请求
  const body = await request.json().catch(() => null);
  const { order_no } = body || {};
  if (!order_no) {
    return NextResponse.json({ success: false, error: "缺少 order_no" }, { status: 400 });
  }

  // 1. 查订单是否存在且为 pending
  const { data: order, error: findError } = await supabase
    .from("payment_orders")
    .select("id, user_id, order_no, credits, status, payment_method")
    .eq("order_no", order_no)
    .single();

  if (findError || !order) {
    return NextResponse.json({ success: false, error: "订单不存在" }, { status: 404 });
  }

  if (order.status !== "pending") {
    return NextResponse.json({ success: false, error: `订单状态为 ${order.status}，无需重复确认` }, { status: 400 });
  }

  // 2. 更新订单为已支付
  const { error: updateError } = await supabase
    .from("payment_orders")
    .update({
      status: "paid",
      transaction_id: `manual_${Date.now()}`,
      payment_method: order.payment_method || "wechat",
      paid_at: new Date().toISOString(),
    })
    .eq("order_no", order_no);

  if (updateError) {
    console.error("[Admin/confirm] 更新订单失败:", updateError);
    return NextResponse.json({ success: false, error: "更新订单状态失败" }, { status: 500 });
  }

  // 3. 给用户加点数（原子操作）
  const { error: creditError } = await supabase.rpc("add_credits", {
    p_user_id: order.user_id,
    p_amount: order.credits,
    p_type: "recharge",
    p_order_no: order.order_no,
  });

  if (creditError) {
    // 回滚订单状态
    await supabase
      .from("payment_orders")
      .update({ status: "pending", paid_at: null, transaction_id: null })
      .eq("order_no", order_no);
    console.error("[Admin/confirm] 加点数失败:", creditError);
    return NextResponse.json({ success: false, error: "点数增加失败，已回滚" }, { status: 500 });
  }

  console.log(`[Admin/confirm] 订单 ${order_no} 确认成功，用户 ${order.user_id} 增加 ${order.credits} 点`);

  return NextResponse.json({ success: true, data: { credits: order.credits } });
}