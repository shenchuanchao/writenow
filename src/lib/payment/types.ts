/**
 * ============================================================
 * payment/types.ts
 * 支付系统类型定义
 * ============================================================
 */

/** 订单状态 */
export type OrderStatus = "pending" | "paid" | "failed" | "expired";

/** 支付方式 */
export type PaymentMethod = "wechat" | "alipay";

/** payment_orders 表行类型 */
export interface PaymentOrder {
  id: string;
  user_id: string;
  order_no: string;
  package_id: string;
  credits: number;
  amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod | null;
  pay_url: string | null;
  transaction_id: string | null;
  raw_callback: Record<string, unknown> | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

/** payment_orders 插入类型 */
export interface PaymentOrderInsert {
  id?: string;
  user_id: string;
  order_no: string;
  package_id: string;
  credits: number;
  amount: number;
  status?: OrderStatus;
  payment_method?: PaymentMethod | null;
  pay_url?: string | null;
  transaction_id?: string | null;
  raw_callback?: Record<string, unknown> | null;
  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** points_log 表行类型 */
export interface PointsLog {
  id: string;
  user_id: string;
  type: PointsLogType;
  amount: number;
  balance_after: number;
  order_no: string | null;
  note: string | null;
  created_at: string;
}

// ============================================================
// 创建支付订单 - 前端请求参数
// ============================================================
export interface CreatePaymentRequest {
  /** 套餐ID，对应 CREDIT_PACKAGES */
  package_id: string;
  /** 支付方式 */
  method: PaymentMethod;
}

// ============================================================
// 创建支付订单 - API 响应
// ============================================================
export interface CreatePaymentResponse {
  success: boolean;
  data?: {
    /** 订单号 */
    order_no: string;
    /** 支付链接（二维码链接） */
    pay_url: string;
    /** 金额 */
    amount: number;
    /** 购买的点数 */
    credits: number;
  };
  error?: string;
}

// ============================================================
// 支付平台回调参数（通用适配）
// 各平台的回调参数可能略有不同，此处定义常用的字段
// ============================================================
export interface PaymentCallbackParams {
  /** 商户订单号 */
  order_no: string;
  /** 支付平台的交易流水号 */
  trade_no: string;
  /** 支付金额（元） */
  amount: string;
  /** 支付状态: success / fail */
  status: string;
  /** 签名 */
  sign: string;
  /** 支付方式 (wechat/alipay) */
  type: string;
  /** 其他平台特有的字段 */
  [key: string]: string;
}

// ============================================================
// 查询订单状态 - API 响应
// ============================================================
export interface PaymentStatusResponse {
  success: boolean;
  data?: {
    order_no: string;
    status: OrderStatus;
    pay_url?: string;
    amount: number;
    credits: number;
  };
  error?: string;
}

// ============================================================
// 点数流水类型
// ============================================================
export type PointsLogType = "recharge" | "consume" | "refund" | "gift";