import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const GUEST_DAILY_LIMIT = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("device_id");

  if (!deviceId) {
    return NextResponse.json({ success: false, error: "缺少 device_id" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const today = new Date().toISOString().slice(0, 10);

  const { data: quota } = await supabase
    .from("guest_daily_quota")
    .select("used_count")
    .eq("device_id", deviceId)
    .eq("quota_date", today)
    .maybeSingle();

  const used = quota?.used_count ?? 0;

  return NextResponse.json({
    success: true,
    data: { used, remaining: Math.max(0, GUEST_DAILY_LIMIT - used) },
  });
}