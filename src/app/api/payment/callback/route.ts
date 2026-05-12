/**
 * POST /api/payment/callback
 *
 * 支付回调接收接口 - 由第三方支付平台主动调用
 * 流程：
 * 1. 接收回调参数（支持 JSON 和 form-urlencoded）
 * 2. 验证签名 → 确保请求来自支付平台
 * 3. 校验订单 → 确保订单存在且未被处理
 * 4. 更新订单状态 → 标记为已支付
 * 5. 增加用户点数 → 调用 add_credits RPC（原子操作）
 * 6. 写入 points_log → 由 add_credits 函数自动完成
 * 7. 返回 "success" 给支付平台（避免平台重复回调）
 *
 * ⚠️ 此接口不需要登录鉴权，由签名验证代替
 * ⚠️ 需要部署后外网可访问
 */

import { NextResponse } from "next/server";
import { handlePaymentCallback } from "@/lib/payment/provider";

/**
 * 统一响应格式（大多数支付平台期望的）
 */
function paymentResponse(success: boolean, message = ""): NextResponse {
  if (success) {
    return new NextResponse(message || "success", { status: 200 });
  }
  return new NextResponse(message || "fail", { status: 200 });
  // 注意：即使失败也返回 200，避免平台重复回调
}

export async function POST(request: Request) {
  // ============================================================
  // 1. 解析回调参数
  //    支付平台通常使用 form-urlencoded 或 JSON
  // ============================================================
  const contentType = request.headers.get("content-type") || "";

  let params: Record<string, string> = {};

  if (contentType.includes("application/json")) {
    // JSON 格式
    params = await request.json().catch(() => ({}));
  } else {
    // form-urlencoded 格式（更常见）
    const text = await request.text();
    const urlParams = new URLSearchParams(text);
    urlParams.forEach((value, key) => {
      params[key] = value;
    });
  }

  console.log("[Payment/callback] 收到回调:", {
    order_no: params.order_no || params.out_trade_no,
    status: params.status,
    amount: params.amount || params.total_fee,
  });

  // ============================================================
  // 2. 验证必填参数
  // ============================================================
  // ⚠️ 参数名需要根据你的支付平台回调格式调整
  // 以下为通用参数名映射
  const orderNo =
    params.order_no ||
    params.out_trade_no ||
    params.merchant_order_no ||
    "";

  const tradeNo =
    params.trade_no ||
    params.transaction_id ||
    params.payment_id ||
    "";

  const amount = params.amount || params.total_fee || "0";

  const status = params.status || params.trade_status || "";

  const sign = params.sign || "";

  if (!orderNo) {
    console.error("[Payment/callback] 缺少订单号");
    return paymentResponse(false, "缺少订单号");
  }

  // ============================================================
  // 3. 处理回调（验签 + 更新订单 + 加点数）
  // ============================================================
  try {
    const result = await handlePaymentCallback({
      order_no: orderNo,
      trade_no: tradeNo,
      amount,
      status,
      sign,
      type: params.type || params.pay_type,
      // 传递所有原始参数，方便后续调试
      ...params,
    });

    if (result.success) {
      console.log("[Payment/callback] 处理成功:", orderNo);
      return paymentResponse(true, result.message);
    }

    console.warn("[Payment/callback] 处理失败:", orderNo, result.message);
    return paymentResponse(false, result.message);
  } catch (error) {
    console.error("[Payment/callback] 处理异常:", orderNo, error);
    return paymentResponse(false, "系统异常");
  }
}

/**
 * GET /api/payment/callback
 * 部分支付平台通过同步跳转（return_url）返回参数
 * 此接口也可以接收 GET 请求（不常用，但保留兼容）
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  console.log("[Payment/callback] GET 回调:", params);

  return NextResponse.json(
    { success: false, error: "请使用 POST 方式" },
    { status: 200 }
  );
}