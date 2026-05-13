import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content, contact } = body;

    if (!type || !content) {
      return NextResponse.json({ error: "类型和内容不能为空" }, { status: 400 });
    }

    if (content.length < 5) {
      return NextResponse.json({ error: "内容至少5个字符" }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: "内容不能超过2000个字符" }, { status: 400 });
    }

    const validTypes = ["bug", "feature", "other"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "无效的反馈类型" }, { status: 400 });
    }

    // Try to get the current user for optional association
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let userId: string | null = null;

    // Try to extract user from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const accessToken = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("sb-ijmexvfsskfckmwlkynn-auth-token="))
      ?.split("=")[1];

    if (accessToken) {
      const { data } = await supabase.auth.getUser(accessToken);
      if (data.user) {
        userId = data.user.id;
      }
    }

    const { data, error } = await supabase
      .from("feedbacks")
      .insert({
        user_id: userId,
        type,
        content,
        contact: contact || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Feedback insert error:", error);
      return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}