/**
 * ============================================================
 * payment/config.ts
 * 免签支付通用配置
 * 使用前填入你的免签平台密钥即可
 * ============================================================
 */

// ============================================================
// 支付网关配置 - 从环境变量读取
// 适用于大多数中国免签支付平台（码支付/V免签/易支付等）
// ============================================================
export const PAYMENT_CONFIG = {
  /** 商户ID - 你的免签平台分配的商户号 */
  merchantId: process.env.PAYMENT_MERCHANT_ID || "",

  /** API密钥 - 用于签名和验签 */
  apiKey: process.env.PAYMENT_API_KEY || "",

  /** 支付网关地址 - 第三方支付平台 API 根地址 */
  gatewayUrl: process.env.PAYMENT_GATEWAY_URL || "https://api.example-pay.com",

  /** 支付回调地址 - 支付成功后平台通知的地址（需外网可访问） */
  notifyUrl: process.env.PAYMENT_NOTIFY_URL || "https://your-domain.com/api/payment/callback",

  /** 支付完成返回地址 - 用户扫码支付后重定向的页面 */
  returnUrl: process.env.PAYMENT_RETURN_URL || "/profile",

  /** 签名方式: md5 | sha256 */
  signType: (process.env.PAYMENT_SIGN_TYPE as "md5" | "sha256") || "md5",
};

// ============================================================
// 支付方式
// ============================================================
export const PAYMENT_METHODS = {
  WECHAT: "wechat" as const,
  ALIPAY: "alipay" as const,
} as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

// ============================================================
// 订单状态
// ============================================================
export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  EXPIRED: "expired",
} as const;