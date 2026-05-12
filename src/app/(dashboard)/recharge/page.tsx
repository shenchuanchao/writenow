"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { CREDIT_PACKAGES } from "@/constants";
import { Coins, Check, Sparkles, Loader2, ArrowLeft, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethod = "wechat" | "alipay";
type Step = "select" | "order";

export default function RechargePage() {
  const { profile } = useAuth();

  const [selected, setSelected] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wechat");
  const [step, setStep] = useState<Step>("select");
  const [orderNo, setOrderNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateOrder = async () => {
    if (!selected) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/payment/offline/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          package_id: selected,
          credits: CREDIT_PACKAGES.find((p) => p.id === selected)?.credits,
          amount: CREDIT_PACKAGES.find((p) => p.id === selected)?.price,
          payment_method: paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "创建订单失败");
      }
      setOrderNo(data.data.order_no);
      setStep("order");
    } catch (e) {
      setError(e instanceof Error ? e.message : "创建订单失败");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("select");
    setOrderNo("");
    setError("");
  };

  // ============================================================
  // Step 1: 套餐选择 + 支付方式
  // ============================================================
  if (step === "select") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-2">点数充值</h1>
        <p className="text-muted-foreground mb-8">每次AI生成消耗1点，选择适合你的套餐</p>

        {/* 当前余额 */}
        <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20">
          <Coins className="h-6 w-6 text-amber-500" />
          <div>
            <p className="text-sm text-muted-foreground">当前余额</p>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {profile?.credits ?? 0} 点
            </span>
          </div>
        </div>

        {/* 套餐选择 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selected === pkg.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-primary/30",
                pkg.popular && "relative"
              )}
              onClick={() => setSelected(pkg.id)}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-indigo-600">
                  <Sparkles className="h-3 w-3 mr-1" /> 推荐
                </Badge>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle>{pkg.label}</CardTitle>
                <CardDescription>{pkg.credits} 点</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <span className="text-2xl font-bold">&yen;{pkg.price}</span>
                <p className="text-xs text-muted-foreground mt-1">
                  约 &yen;{(pkg.price / pkg.credits).toFixed(2)}/条
                </p>
                {selected === pkg.id && (
                  <div className="mt-3 flex items-center justify-center text-primary">
                    <Check className="h-4 w-4 mr-1" /> 已选
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 支付方式选择 */}
        {selected && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">选择支付方式</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentMethod("wechat")}
                className={cn(
                  "flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all",
                  paymentMethod === "wechat"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : "border-border hover:border-emerald-300"
                )}
              >
                {/* 微信图标 SVG */}
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-emerald-600" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.41 24 16.703 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89a5.718 5.718 0 0 0-.406-.032zm-1.834.17c.536 0 .97.44.97.983a.976.976 0 0 1-.97.983.976.976 0 0 1-.97-.983c0-.542.434-.983.97-.983zm4.857 0c.536 0 .97.44.97.983a.976.976 0 0 1-.97.983.976.976 0 0 1-.97-.983c0-.542.434-.983.97-.983z"/>
                </svg>
                <span className="text-sm font-medium">微信支付</span>
                <span className="text-xs text-muted-foreground">微信收款码</span>
              </button>

              <button
                onClick={() => setPaymentMethod("alipay")}
                className={cn(
                  "flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all",
                  paymentMethod === "alipay"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-border hover:border-blue-300"
                )}
              >
                {/* 支付宝图标 SVG */}
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-600" fill="currentColor">
                  <path d="M21.133 14.208c-.12-.093-2.206-1.806-3.042-2.507-.83-.7-1.63-.738-1.9-.738h-.003c-.27 0-1.07.038-1.9.74-.836.7-2.923 2.412-3.043 2.507-.12.096-.26.137-.417.137-.157 0-.297-.041-.417-.137-.12-.095-2.207-1.807-3.043-2.507-.83-.702-1.63-.74-1.9-.74h-.003c-.27 0-1.07.038-1.9.74-.836.7-2.923 2.412-3.043 2.507-.12.096-.26.137-.417.137a.63.63 0 0 1-.417-.137c-.12-.095-2.207-1.807-3.043-2.507C.58 11.386.48 11.13.48 11.017c0-.112.1-.368.23-.62.38-.743 1.23-2.36 1.37-2.614.05-.09.12-.13.2-.13.08 0 .15.04.2.13.14.254.99 1.871 1.37 2.614.13.252.23.508.23.62 0 .113-.1.369-.23.62-.38.743-1.23 2.36-1.37 2.614-.05.09-.12.13-.2.13a.307.307 0 0 1-.14-.034c-.027-.012-2.433-1.236-3.29-1.693a.237.237 0 0 1-.13-.205c0-.107.068-.22.183-.32C1.216 11.31 3.978 9.436 6.383 8.98c.17-.033.293.004.345.026.22.093.88.408 1.41.7-.39.46-.6 1-.6 1.57 0 1.72 1.62 3.11 3.62 3.11 1.22 0 2.29-.58 2.93-1.46.3-.42.49-.9.55-1.41.35.3.74.56 1.17.75.28.13.58.19.88.19 1.21 0 2.27-.58 2.9-1.46.64-.88 1-1.94 1-3.06 0-.47-.1-.91-.27-1.31.46-.25.97-.45 1.52-.57.17-.033.293.004.345.026.22.093.88.408 1.41.7-.39.46-.6 1-.6 1.57 0 .63.19 1.21.51 1.69-.53.42-.88 1.03-.88 1.72 0 1.24 1.01 2.24 2.25 2.24.34 0 .65-.08.93-.22.2.43.53.79.96 1.01-.08.05-.16.1-.25.14-.65.35-1.45.25-1.85-.2-.3-.33-.52-.74-.62-1.18-.01-.04-.02-.08-.03-.12-.07-.26-.11-.53-.11-.82 0-1.52 1.23-2.75 2.75-2.75 1.52 0 2.75 1.23 2.75 2.75 0 .35-.07.69-.19 1.01-.04.1-.08.2-.13.29-.03.06-.07.12-.1.19-.02.03-.03.07-.05.1-.09.17-.19.33-.31.49l-.04.06c-.05.07-.1.15-.16.22-.06.08-.13.16-.2.23-.07.07-.14.14-.22.2-.07.06-.14.12-.22.17-.08.05-.17.1-.26.15-.09.05-.19.09-.29.12-.1.03-.21.06-.32.08-.11.02-.22.04-.34.04-.12 0-.23-.02-.35-.04-.11-.02-.21-.05-.32-.08-.1-.03-.2-.07-.29-.12-.09-.05-.18-.1-.26-.15-.08-.05-.15-.11-.22-.17-.07-.06-.14-.13-.2-.2-.06-.07-.11-.15-.16-.22l-.04-.06c-.12-.16-.22-.32-.31-.49-.02-.03-.03-.07-.05-.1-.03-.06-.07-.12-.1-.19-.05-.09-.09-.19-.13-.29-.12-.32-.19-.66-.19-1.01 0-.57.2-1.11.54-1.54.5.36 1.09.6 1.73.67.06.01.12.01.18.01.35 0 .68-.08.99-.23.03-.02.06-.03.09-.05.11-.06.21-.13.31-.21.06-.04.11-.09.16-.14.08-.06.16-.13.23-.21.05-.05.1-.11.15-.17.07-.08.13-.17.19-.26.04-.06.08-.13.11-.2.05-.09.09-.18.13-.28.03-.07.05-.14.07-.22.03-.1.05-.21.07-.32.01-.08.02-.16.02-.24 0-.08-.01-.16-.02-.24-.02-.11-.04-.22-.07-.32-.02-.08-.04-.15-.07-.22-.04-.1-.08-.19-.13-.28-.03-.07-.07-.14-.11-.2-.06-.09-.12-.18-.19-.26-.05-.06-.1-.12-.15-.17-.07-.08-.15-.15-.23-.21-.05-.05-.1-.1-.16-.14-.1-.08-.2-.15-.31-.21-.03-.02-.06-.03-.09-.05-.31-.15-.64-.23-.99-.23-.06 0-.12 0-.18.01-.64.07-1.23.31-1.73.67-.34-.43-.77-.79-1.27-1.04.05-.02.1-.03.15-.05.12-.04.24-.08.35-.14.07-.03.14-.07.2-.11.1-.06.2-.13.29-.21.06-.05.12-.11.17-.17.08-.08.15-.17.22-.26.05-.06.09-.12.13-.19.06-.09.11-.18.16-.28.03-.07.06-.14.08-.22.04-.1.07-.21.09-.32.02-.08.03-.16.03-.24 0-.08-.01-.16-.03-.24-.02-.11-.05-.22-.09-.32-.02-.08-.05-.15-.08-.22-.05-.1-.1-.19-.16-.28-.04-.07-.08-.13-.13-.19-.07-.09-.14-.18-.22-.26-.05-.06-.11-.12-.17-.17-.09-.08-.19-.15-.29-.21-.06-.04-.13-.08-.2-.11-.11-.06-.23-.1-.35-.14-.05-.02-.1-.03-.15-.05-.28-.13-.58-.21-.9-.23-.05 0-.1-.01-.15-.01-.35 0-.68.08-.99.23-.03.02-.06.03-.09.05-.11.06-.21.13-.31.21-.06.04-.11.09-.16.14-.08.06-.16.13-.23.21-.05.05-.1.11-.15.17-.07.08-.13.17-.19.26-.04.06-.08.13-.11.2-.05.09-.09.18-.13.28-.03.07-.05.14-.07.22-.03.1-.05.21-.07.32-.01.08-.02.16-.02.24 0 .08.01.16.02.24.02.11.04.22.07.32.02.08.04.15.07.22.04.1.08.19.13.28.03.07.07.14.11.2.06.09.12.18.19.26.05.06.1.12.15.17.07.08.15.15.23.21.05.05.1.1.16.14.1.08.2.15.31.21.03.02.06.03.09.05.31.15.64.23.99.23.05 0 .1-.01.15-.01.32-.02.62-.1.9-.23.05.02.1.03.15.05.5.25.93.61 1.27 1.04-.34.43-.54.97-.54 1.54 0 .35.07.69.19 1.01.04.1.08.2.13.29.03.06.07.12.1.19.02.03.03.07.05.1.09.17.19.33.31.49l.04.06c.05.07.1.15.16.22.06.08.13.16.2.23.07.07.14.14.22.2.07.06.14.12.22.17.08.05.17.1.26.15.09.05.19.09.29.12.1.03.21.06.32.08.11.02.22.04.35.04.12 0 .23-.02.34-.04.11-.02.21-.05.32-.08.1-.03.2-.07.29-.12.09-.05.18-.1.26-.15.08-.05.15-.11.22-.17.07-.06.14-.13.2-.2.06-.07.11-.15.16-.22l.04-.06c.12-.16.22-.32.31-.49.02-.03.03-.07.05-.1.03-.06.07-.12.1-.19.05-.09.09-.19.13-.29.12-.32.19-.66.19-1.01 0-1.24-.83-2.28-1.97-2.62z"/>
                </svg>
                <span className="text-sm font-medium">支付宝</span>
                <span className="text-xs text-muted-foreground">支付宝收款码</span>
              </button>
            </div>
          </div>
        )}

        {/* 说明 */}
        <Card className="mb-8 bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MessageCircle className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground mb-1">线下支付方式</p>
                <p>选择套餐和支付方式后，扫描对应的收款二维码完成支付，支付后联系管理员确认即可到账。</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 确认按钮 */}
        <div className="flex flex-col items-center gap-3">
          <Button
            size="lg"
            disabled={!selected || loading}
            onClick={handleCreateOrder}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                创建订单中...
              </>
            ) : (
              <>确认充值 &yen;{CREDIT_PACKAGES.find((p) => p.id === selected)?.price || "0"}</>
            )}
          </Button>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // Step 2: 显示订单 + 收款二维码
  // ============================================================
  const selectedPkg = CREDIT_PACKAGES.find((p) => p.id === selected);

  return (
    <div className="max-w-md mx-auto text-center">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> 返回
      </Button>

      <h1 className="text-2xl font-bold mb-1">
        订单已创建
      </h1>
      <p className="text-muted-foreground mb-6">
        请使用{paymentMethod === "wechat" ? "微信" : "支付宝"}扫码完成支付
      </p>

      <Card className="mb-6">
        <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
          {/* 收款二维码 */}
          <div className="w-56 h-56 rounded-xl border flex items-center justify-center bg-muted/50 overflow-hidden">
            <img
              src={paymentMethod === "wechat" ? "/images/wx-qr.png" : "/images/alipay-qr.png"}
              alt={paymentMethod === "wechat" ? "微信收款码" : "支付宝收款码"}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="text-center p-4">
                      <div class="text-4xl mb-2">${paymentMethod === "wechat" ? "💚" : "🔵"}</div>
                      <p class="text-sm text-muted-foreground">请将${paymentMethod === "wechat" ? "微信" : "支付宝"}收款码</p>
                      <p class="text-sm text-muted-foreground">放到 <code class="text-xs">/public/images/${paymentMethod === "wechat" ? "wx-qr.png" : "alipay-qr.png"}</code></p>
                    </div>
                  `;
                }
              }}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            使用{paymentMethod === "wechat" ? "微信" : "支付宝"}扫一扫完成支付
          </div>
        </CardContent>
      </Card>

      {/* 订单信息 */}
      <Card className="mb-6 text-left">
        <CardContent className="pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">订单号</span>
            <span className="font-mono">{orderNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">支付方式</span>
            <span>{paymentMethod === "wechat" ? "微信支付" : "支付宝"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">套餐</span>
            <span>{selectedPkg?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">应付金额</span>
            <span className="font-bold">&yen;{selectedPkg?.price}</span>
          </div>
        </CardContent>
      </Card>

      {/* 说明 */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground mb-4">
        <p className="font-medium text-foreground mb-1">支付完成后</p>
        <p>请截图保存订单号，联系管理员确认收款，确认后点数将自动到账。</p>
      </div>

      <Button variant="outline" onClick={handleBack} className="w-full">
        返回重新选择
      </Button>
    </div>
  );
}