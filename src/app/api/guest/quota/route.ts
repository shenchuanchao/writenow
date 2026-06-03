import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("device_id");

  if (!deviceId) {
    return NextResponse.json({ success: false, error: "缺少 device_id" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const hourBucket = new Date().toISOString().slice(0, 13);

  const { data: rateRow } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("device_id", deviceId)
    .eq("hour_bucket", hourBucket)
    .maybeSingle();

  const usedThisHour = rateRow?.count ?? 0;

  return NextResponse.json({
    success: true,
    data: { unlimited: true, used_this_hour: usedThisHour },
  });
}