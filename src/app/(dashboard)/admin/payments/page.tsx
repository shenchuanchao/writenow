"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, Loader2, RefreshCw, Shield, User } from "lucide-react";

interface Order {
  id: string;
  order_no: string;
  user_id: string;
  package_id: string;
  credits: number;
  amount: number;
  status: string;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
  profiles: { nickname: string | null } | null;
}

export default function AdminPaymentsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "paid">("pending");

  // 管理员守卫：非管理员跳转首页
  useEffect(() => {
    if (!authLoading && (!user || !profile?.is_admin)) {
      router.replace("/");
    }
  }, [authLoading, user, profile, router]);

  // 未认证/非管理员时显示 loading，避免闪现
  if (authLoading || !user || !profile?.is_admin) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/list?status=${filter}`, {
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

  const handleConfirm = async (orderNo: string) => {
    setConfirming(orderNo);
    try {
      const res = await fetch("/api/admin/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ order_no: orderNo }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.order_no !== orderNo));
      } else {
        alert(data.error || "确认失败");
      }
    } catch (e) {
      alert("确认失败");
    } finally {
      setConfirming(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">订单管理</h1>
          <p className="text-muted-foreground mt-1">管理线下支付订单，手动确认收款</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          <RefreshCw className="h-4 w-4 mr-1" /> 刷新
        </Button>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2 mb-6">
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
          <CheckCircle className="h-4 w-4 mr-1" /> 已确认
        </Button>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            {filter === "pending" ? "暂无待处理订单" : "暂无已确认订单"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* 状态图标 */}
                    {order.status === "pending" ? (
                      <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                    ) : order.status === "paid" ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{order.order_no}</span>
                        <Badge
                          variant={order.status === "pending" ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {order.status === "pending" ? "待处理" : "已确认"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {order.profiles?.nickname || "未知用户"}
                        </span>
                        <span>套餐: {order.package_id}</span>
                        <span>{order.credits} 点</span>
                        <span className="font-medium text-foreground">
                          &yen;{order.amount}
                        </span>
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 操作 */}
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      className="shrink-0"
                      disabled={confirming === order.order_no}
                      onClick={() => handleConfirm(order.order_no)}
                    >
                      {confirming === order.order_no ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" /> 确认中...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" /> 确认收款
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}