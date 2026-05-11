import { requireAuth } from "@/lib/auth/guard";
import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { CREDIT_PACKAGES } from "@/constants";

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { package_id } = await request.json();
  const pkg = CREDIT_PACKAGES.find((p) => p.id === package_id);

  if (!pkg) {
    return NextResponse.json({ success: false, error: "无效套餐" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const userId = auth.user!.id;

  // 获取当前点数
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (!profile) {
    return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 });
  }

  const balanceBefore = profile.credits;
  const balanceAfter = balanceBefore + pkg.credits;

  // 原子充值（乐观锁）
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits: balanceAfter })
    .eq("id", userId)
    .eq("credits", balanceBefore);

  if (updateError) {
    return NextResponse.json({ success: false, error: "充值失败，请重试" }, { status: 500 });
  }

  // 写入流水
  await supabase.from("credit_transactions").insert({
    user_id: userId,
    type: "admin_grant",
    amount: pkg.credits,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    description: `购买${pkg.label}（${pkg.credits}点）`,
    metadata: { package_id, price: pkg.price },
  });

  return NextResponse.json({
    success: true,
    data: { credits: balanceAfter, package: pkg },
  });
}
