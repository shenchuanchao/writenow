"use client";

import { useState, useCallback } from "react";
import { useAuth } from "./use-auth";

/**
 * 充值结果
 */
export interface RechargeResult {
  order_no: string;
  pay_url: string;
  amount: number;
  credits: number;
}

export function useCredits() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * 创建支付订单
   * 调用后端接口获取支付链接
   * @param packageId 套餐ID
   * @param method 支付方式: wechat | alipay
   * @returns 订单号、支付链接、金额、点数
   */
  const recharge = useCallback(
    async (packageId: string, method: "wechat" | "alipay" = "wechat"): Promise<RechargeResult> => {
      setLoading(true);
      try {
        const res = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ package_id: packageId, method }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "创建支付订单失败");
        }
        return data.data as RechargeResult;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 查询支付状态
   * @param orderNo 订单号
   * @returns 订单状态
   */
  const checkPaymentStatus = useCallback(
    async (orderNo: string): Promise<{ status: string } | null> => {
      try {
        const res = await fetch(`/api/payment/status/${orderNo}`, {
          headers: {
            Authorization: `Bearer ${profile?.id || ""}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.success) return null;
        return data.data;
      } catch {
        return null;
      }
    },
    [profile?.id]
  );

  return {
    credits: profile?.credits ?? 0,
    loading,
    recharge,
    checkPaymentStatus,
    refresh: refreshProfile,
  };
}