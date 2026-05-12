/**
 * POST /api/payment/offline/create
 *
 * 创建线下支付订单（不调用第三方网关）
 * 仅写入 payment_orders 为 pending，等待管理员手动确认
 */

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { randomBytes } from "crypto";

function generateOrderNo(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `WN${ts}${randomBytes(3).toString("hex")}`;
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();

  // Cookie-based 认证
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ success: false, error: "未登录" }, { status: 401 });
  }

  // 解析请求
  const body = await request.json().catch(() => null);
  if (!body?.package_id || !body?.credits || !body?.amount) {
    return NextResponse.json({ success: false, error: "缺少参数" }, { status: 400 });
  }

  const orderNo = generateOrderNo();

  const { error } = await supabase.from("payment_orders").insert({
    user_id: user.id,
    order_no: orderNo,
    package_id: body.package_id,
    credits: body.credits,
    amount: body.amount,
    status: "pending",
    payment_method: body.payment_method || "wechat",
  });

  if (error) {
    console.error("[Offline/create] 创建订单失败:", error);
    return NextResponse.json({ success: false, error: "创建订单失败", detail: String(error) }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: { order_no: orderNo },
  });
}