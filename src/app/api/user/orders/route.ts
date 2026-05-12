/**
 * GET /api/user/orders
 *
 * 当前用户查看自己的充值订单
 * 支持 ?status=pending|paid|all 筛选
 */

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "all";

  const supabase = await createServerSupabase();

  // Cookie-based 认证
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ success: false, error: "未登录" }, { status: 401 });
  }

  let query = supabase
    .from("payment_orders")
    .select(`
      id,
      order_no,
      package_id,
      credits,
      amount,
      status,
      payment_method,
      paid_at,
      created_at,
      updated_at
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error("[User/orders] 查询失败:", error);
    return NextResponse.json({ success: false, error: "查询失败" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: orders || [],
  });
}