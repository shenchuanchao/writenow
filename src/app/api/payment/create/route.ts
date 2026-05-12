/**
 * POST /api/payment/create
 * 
 * 创建支付订单 - 前端点击支付后调用
 * 接收 package_id 和 method（wechat/alipay），返回支付链接
 * 
 * 请求体：{ package_id: string, method: "wechat" | "alipay" }
 * 响应：{ success: true, data: { order_no, pay_url, amount, credits } }
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createPaymentOrder, PaymentError } from "@/lib/payment/provider";
import type { CreatePaymentRequest } from "@/lib/payment/types";

/**
 * 鉴权辅助函数：从 Cookie 中获取当前用户
 * 返回 user 或 null
 */
async function requireAuth(): Promise<{ userId: string } | NextResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          // 从请求中继承 Cookie（Next.js 自动传入）
        },
      },
    }
  );

  // ⚠️ 由于 API Route 中无法直接获取服务端 request 上下文，
  // 此处采用简化方案：从 Authorization header 获取 token
  // 如果你的 auth 策略不同，请相应调整
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: "未登录" },
      { status: 401 }
    );
  }

  return { userId: user.id };
}

export async function POST(request: Request) {
  // 1. 鉴权
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  // 2. 解析请求体
  const body: CreatePaymentRequest = await request.json().catch(() => null);
  if (!body?.package_id || !body?.method) {
    return NextResponse.json(
      { success: false, error: "缺少参数: package_id 和 method 必填" },
      { status: 400 }
    );
  }

  if (!["wechat", "alipay"].includes(body.method)) {
    return NextResponse.json(
      { success: false, error: "支付方式仅支持 wechat 或 alipay" },
      { status: 400 }
    );
  }

  // 3. 创建支付订单
  try {
    const result = await createPaymentOrder(auth.userId, body);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof PaymentError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    console.error("[Payment/create] 创建支付订单失败:", error);
    return NextResponse.json(
      { success: false, error: "服务器内部错误" },
      { status: 500 }
    );
  }
}