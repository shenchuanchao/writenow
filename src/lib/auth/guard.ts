import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ success: false, error: "\u672A\u767B\u5F55" }, { status: 401 }) };
  }

  return { user };
}
