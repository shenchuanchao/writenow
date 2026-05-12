/**
 * ============================================================
 * payment/provider.ts
 * 免签支付核心逻辑
 * 负责：
 * 1. 创建支付订单（调用第三方网关获取支付链接）
 * 2. 处理支付回调（验签、更新订单、加点数）
 * 3. 查询订单状态
 * ============================================================
 */

import { PAYMENT_CONFIG, ORDER_STATUS } from "./config";
import { generateSign, verifySign, generateOrderNo } from "./crypto";
import { CREDIT_PACKAGES } from "@/constants";
import {
  type PaymentOrder,
  type PaymentMethod,
  type CreatePaymentRequest,
  type PaymentCallbackParams,
} from "./types";

/** 错误类 */
export class PaymentError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "PaymentError";
  }
}

/**
 * 获取 Supabase 管理客户端（懒加载，运行时才创建）
 * 使用 service_role key 执行管理操作
 * 如果未配置 service_role key，降级使用 anon key
 */
function getAdminClient() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new PaymentError("Supabase 配置缺失", "CONFIG_ERROR");
  }
  return createClient(url, key);
}

/**
 * 创建支付订单
 * 1. 验证套餐ID并获取价格
 * 2. 在本地数据库创建 pending 订单
 * 3. 调用第三方支付网关获取支付链接
 * 4. 更新订单的 pay_url
 * 5. 返回支付链接给前端
 *
 * @param userId - 用户ID
 * @param req - 创建请求参数：package_id, method
 * @returns 订单号和支付链接
 */
export async function createPaymentOrder(
  userId: string,
  req: CreatePaymentRequest
): Promise<{ order_no: string; pay_url: string; amount: number; credits: number }> {
  const { package_id, method } = req;
  const client = getAdminClient();

  // 1. 验证套餐
  const pkg = CREDIT_PACKAGES.find((p) => p.id === package_id);
  if (!pkg) {
    throw new PaymentError(`无效的套餐: ${package_id}`, "INVALID_PACKAGE");
  }
  const amount = pkg.price;
  const credits = pkg.credits;
  const orderNo = generateOrderNo();

  // 2. 在数据库创建 pending 订单
  const { error: dbError } = await client
    .from("payment_orders")
    .insert({
      user_id: userId,
      order_no: orderNo,
      package_id,
      credits,
      amount,
      status: ORDER_STATUS.PENDING,
      payment_method: method,
    });

  if (dbError) {
    console.error("[Payment] 创建订单失败:", dbError);
    throw new PaymentError("创建订单失败", "DB_ERROR");
  }

  // 3. 调用第三方支付网关获取支付链接
  const payUrlResult = await callPaymentGateway({
    order_no: orderNo,
    amount: amount.toFixed(2),
    method,
    notify_url: PAYMENT_CONFIG.notifyUrl,
    return_url: PAYMENT_CONFIG.returnUrl,
  });

  if (!payUrlResult) {
    // 更新订单状态为失败
    await client
      .from("payment_orders")
      .update({ status: ORDER_STATUS.FAILED })
      .eq("order_no", orderNo);

    throw new PaymentError("获取支付链接失败", "GATEWAY_ERROR");
  }

  // 4. 更新订单的 pay_url
  await client
    .from("payment_orders")
    .update({ pay_url: payUrlResult })
    .eq("order_no", orderNo);

  // 5. 返回
  return {
    order_no: orderNo,
    pay_url: payUrlResult,
    amount,
    credits,
  };
}

/**
 * 处理支付回调
 * 1. 提取并验证签名
 * 2. 查找本地订单
 * 3. 更新订单状态为 paid
 * 4. 调用 add_credits 给用户增加点数
 * 5. 返回成功响应给支付平台
 *
 * @param callbackParams - 回调参数
 * @returns 是否处理成功
 */
export async function handlePaymentCallback(
  callbackParams: PaymentCallbackParams
): Promise<{ success: boolean; message: string }> {
  const client = getAdminClient();
  const { order_no, trade_no, amount, status, type, sign } = callbackParams;

  // 1. 验证签名
  const signValid = verifySign(
    callbackParams,
    PAYMENT_CONFIG.apiKey,
    PAYMENT_CONFIG.signType
  );
  if (!signValid) {
    console.error("[Payment] 签名验证失败:", { order_no, sign });
    return { success: false, message: "签名验证失败" };
  }

  // 2. 检查支付状态
  if (status !== "success") {
    console.log("[Payment] 支付未成功:", { order_no, status });
    return { success: false, message: "支付状态异常" };
  }

  // 3. 查找订单
  const { data: order, error: dbError } = await client
    .from("payment_orders")
    .select("*")
    .eq("order_no", order_no)
    .single();

  if (dbError || !order) {
    console.error("[Payment] 订单不存在:", order_no, dbError);
    return { success: false, message: "订单不存在" };
  }

  // 4. 检查订单状态，防止重复回调
  if (order.status === ORDER_STATUS.PAID) {
    console.log("[Payment] 订单已支付:", order_no);
    return { success: true, message: "订单已处理" };
  }

  // 5. 开启事务（原子化：更新订单 + 增加点数 + 写流水）

  // 5.1 更新订单为已支付
  const { error: updateError } = await client
    .from("payment_orders")
    .update({
      status: ORDER_STATUS.PAID,
      transaction_id: trade_no,
      payment_method: type === "alipay" ? "alipay" : "wechat",
      raw_callback: callbackParams,
      paid_at: new Date().toISOString(),
    })
    .eq("order_no", order_no);

  if (updateError) {
    console.error("[Payment] 更新订单失败:", updateError);
    return { success: false, message: "更新订单失败" };
  }

  // 5.2 调用数据库函数增加点数（原子操作）
  const { data: newBalance, error: creditError } = await client
    .rpc("add_credits", {
      p_user_id: order.user_id,
      p_amount: order.credits,
      p_type: "recharge",
      p_order_no: order_no,
      p_note: `充值 ${order.credits} 点 (${order.package_id})`,
    });

  if (creditError) {
    console.error("[Payment] 增加点数失败:", creditError);
    return { success: false, message: "增加点数失败" };
  }

  console.log("[Payment] 支付完成:", {
    order_no,
    credits: order.credits,
    balance: newBalance,
  });

  return { success: true, message: "success" };
}

/**
 * 查询订单状态
 */
export async function queryPaymentOrder(
  orderNo: string,
  userId: string
): Promise<{
  status: string;
  pay_url?: string;
  amount: number;
  credits: number;
} | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("payment_orders")
    .select("status, pay_url, amount, credits")
    .eq("order_no", orderNo)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return {
    status: data.status,
    pay_url: data.pay_url || undefined,
    amount: data.amount,
    credits: data.credits,
  };
}

// ============================================================
// 内部函数：调用第三方支付网关
// ============================================================

interface GatewayParams {
  order_no: string;
  amount: string;
  method: string;
  notify_url: string;
  return_url: string;
}

/**
 * 调用第三方支付网关获取支付链接/二维码
 *
 * 重要：此处代码需要根据你使用的具体免签支付平台修改
 *
 * 大多数免签平台的调用方式类似：
 * - GET 或 POST 请求到支付网关
 * - 传递 merchant_id, order_no, amount, type, notify_url, return_url, sign
 * - 返回 pay_url 或二维码图片 URL
 *
 * 以下为示例模板，请根据你的平台文档调整：
 */
async function callPaymentGateway(
  params: GatewayParams
): Promise<string | null> {
  const { order_no, amount, method, notify_url, return_url } = params;

  // 如果未配置支付网关（开发者模式），返回模拟支付链接
  if (!PAYMENT_CONFIG.merchantId || !PAYMENT_CONFIG.apiKey) {
    console.warn(
      "[Payment] 未配置支付网关，返回模拟链接（开发者模式）",
      order_no
    );
    return `data:text/html,<h1>模拟支付</h1><p>订单: ${order_no}</p><p>金额: ¥${amount}</p><p>请在回调接口中测试</p>`;
  }

  try {
    // 1. 准备签名参数
    const signParams: Record<string, string> = {
      merchant_id: PAYMENT_CONFIG.merchantId,
      order_no: order_no,
      amount: amount,
      type: method,
      notify_url: notify_url,
      return_url: return_url,
    };

    // 2. 计算签名
    const sign = generateSign(
      signParams,
      PAYMENT_CONFIG.apiKey,
      PAYMENT_CONFIG.signType
    );

    // 3. 构建请求 URL（GET 方式）
    const query = new URLSearchParams({
      ...signParams,
      sign,
      sign_type: PAYMENT_CONFIG.signType,
    }).toString();

    // 4. 发送请求
    const response = await fetch(
      `${PAYMENT_CONFIG.gatewayUrl}/api/create?${query}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error(
        "[Payment] 支付网关请求失败:",
        response.status,
        await response.text()
      );
      return null;
    }

    // 5. 解析响应
    const result = await response.json();

    if (result.code === 1 || result.status === "success") {
      return result.data?.pay_url || result.data?.qrcode || result.qrcode;
    }

    console.error("[Payment] 支付网关返回错误:", result.msg || result.message);
    return null;
  } catch (error) {
    console.error("[Payment] 调用支付网关异常:", error);
    return null;
  }
}