"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CREDIT_PACKAGES } from "@/constants";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Coins,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  order_no: string;
  package_id: string;
  credits: number;
  amount: number;
  status: string;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "paid">("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/orders?status=${filter}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const getPkgLabel = (packageId: string) => {
    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
    return pkg ? pkg.label : packageId;
  };

  const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
    pending: { icon: Clock, color: "text-amber-500", label: "待处理" },
    paid: { icon: CheckCircle, color: "text-emerald-500", label: "已确认" },
    failed: { icon: XCircle, color: "text-destructive", label: "失败" },
    expired: { icon: XCircle, color: "text-muted-foreground", label: "已过期" },
  };

  const paymentLabel: Record<string, string> = {
    wechat: "微信支付",
    alipay: "支付宝",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-7 w-7 text-primary" />
            订单管理
          </h1>
          <p className="text-muted-foreground mt-1">查看充值订单记录</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4 mr-1" /> 刷新
          </Button>
          <Link href="/recharge">
            <Button size="sm">
              <Coins className="h-4 w-4 mr-1" /> 充值
            </Button>
          </Link>
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          全部
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
        >
          <Clock className="h-4 w-4 mr-1" /> 待处理
        </Button>
        <Button
          variant={filter === "paid" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("paid")}
        >
          <CheckCircle className="h-4 w-4 mr-1" /> 已完成
        </Button>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground mb-4">暂无订单记录</p>
            <Link href="/recharge">
              <Button variant="outline" size="sm">
                <Coins className="h-4 w-4 mr-1" /> 去充值
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const s = statusConfig[order.status] || statusConfig.pending;
            const SIcon = s.icon;

            return (
              <Card
                key={order.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <SIcon className={`h-5 w-5 ${s.color} shrink-0`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm truncate">
                            {order.order_no}
                          </span>
                          <Badge
                            variant={
                              order.status === "paid" ? "default" : "secondary"
                            }
                            className="text-xs shrink-0"
                          >
                            {s.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                          <span>{getPkgLabel(order.package_id)}</span>
                          <span className="flex items-center gap-1">
                            <Coins className="h-3 w-3" />
                            {order.credits} 点
                          </span>
                          <span className="font-medium text-foreground">
                            &yen;{order.amount}
                          </span>
                          {order.payment_method && (
                            <span>
                              {paymentLabel[order.payment_method] ||
                                order.payment_method}
                            </span>
                          )}
                          <span>{formatDate(order.created_at)}</span>
                          {order.paid_at && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              确认于 {formatDate(order.paid_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}