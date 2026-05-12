/**
 * GET /api/admin/payments/list
 *
 * 管理员查看支付订单列表
 */

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "pending";

  const supabase = await createServerSupabase();

  // Cookie-based 认证
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ success: false, error: "未登录" }, { status: 401 });
  }

  // 管理员鉴权:检查 profiles.is_admin 字段
  const { data: adminProfile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (profileError || !adminProfile?.is_admin) {
    return NextResponse.json({ success: false, error: "无权操作" }, { status: 403 });
  }

  // 1. 查询订单(不含 FK join,避免 Supabase 隐式关联解析失败)
  const { data: orders, error } = await supabase
    .from("payment_orders")
    .select(`
      id,
      order_no,
      user_id,
      package_id,
      credits,
      amount,
      status,
      payment_method,
      paid_at,
      created_at
    `)
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[Admin/list] 查询失败:", error);
    return NextResponse.json({ success: false, error: "查询失败" }, { status: 500 });
  }

  // 2. 单独查询用户昵称（避免 FK join 问题）
  const result = orders || [];

  if (orders && orders.length > 0) {
    const userIds = [...new Set((orders as any[]).map((o: any) => o.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, nickname")
      .in("id", userIds);

    if (profiles) {
      const profileMap = new Map(profiles.map((p: any) => [p.id, p.nickname]));
      const enrichedOrders = orders.map((o: any) => ({
        ...o,
        profiles: { nickname: profileMap.get(o.user_id) || null },
      }));

      return NextResponse.json({
        success: true,
        data: enrichedOrders,
      });
    }
  }

  return NextResponse.json({
    success: true,
    data: result,
  });
}
