"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCredits } from "@/hooks/use-credits";
import { CREDIT_PACKAGES } from "@/constants";
import { Coins, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RechargePage() {
  const { credits, recharge, loading } = useCredits();
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");

  const handleRecharge = async () => {
    if (!selected) return;
    setMessage("");
    try {
      const result = await recharge(selected);
      setMessage(`充值成功！当前余额：${result?.credits ?? credits} 点`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "充值失败");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">点数充值</h1>
      <p className="text-muted-foreground mb-8">每次AI生成消耗1点，选择适合你的套餐</p>

      <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20">
        <Coins className="h-6 w-6 text-amber-500" />
        <div>
          <p className="text-sm text-muted-foreground">当前余额</p>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{credits} 点</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selected === pkg.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/30",
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

      <div className="flex flex-col items-center gap-3">
        <Button size="lg" disabled={!selected || loading} onClick={handleRecharge}>
          {loading ? "处理中..." : "确认充值"}
        </Button>
        {message && (
          <p className="text-sm text-center text-muted-foreground">{message}</p>
        )}
        <p className="text-xs text-muted-foreground">注：当前为演示版本，充值功能将在接入支付后正式上线</p>
      </div>
    </div>
  );
}
