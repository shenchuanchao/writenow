"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ToolConfig, ToolType } from "@/types";
import { useGenerate } from "@/hooks/use-generate";
import { useCredits } from "@/hooks/use-credits";
import { getCost } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "./loading-spinner";
import { AlertCircle, Sparkles, Copy, Check, Coins, RefreshCw, Dices, ArrowRight, LogIn, Gift } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const GUEST_DAILY_LIMIT = 5;
const DEVICE_ID_KEY = "writenow_device_id";

function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function ToolForm({ tool }: { tool: ToolConfig }) {
  const { result, loading, error, creditsRemaining, guestRemaining, generate, reset } = useGenerate();
  const { credits } = useCredits();
  const { user, refreshProfile } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [params, setParams] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [deviceId] = useState(() => getOrCreateDeviceId());

  // 游客剩余次数：优先用 API 返回的最新值，否则用初始值 5
  const [initialGuestRemaining, setInitialGuestRemaining] = useState<number>(GUEST_DAILY_LIMIT);
  const displayGuestRemaining = guestRemaining ?? initialGuestRemaining;

  // 生成成功后同步更新全局点数 / 游客次数
  useEffect(() => {
    if (creditsRemaining !== null && !loading) {
      refreshProfile();
    }
  }, [creditsRemaining, loading, refreshProfile]);

  // 计算当前使用的 AI 提示词预览
  const enrichedPrompt = useMemo(() => {
    if (!prompt.trim()) return "";
    const paramHints = tool.formFields
      .filter((f) => params[f.name])
      .map((f) => `${f.label}: ${params[f.name]}`)
      .join("，");
    return paramHints ? `[${paramHints}] ${prompt}` : prompt;
  }, [prompt, params, tool.formFields]);

  // 计算本次生成消耗点数（仅已登录用户）
  const cost = useMemo(() => getCost(tool.type as ToolType, params), [tool.type, params]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await generate(tool.type as ToolType, prompt, params, user ? undefined : deviceId);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(result);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = result;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  // 游客是否已用完
  const guestExhausted = !user && displayGuestRemaining <= 0;

  // 生成按钮是否禁用
  const generateDisabled = loading
    || (user && (!prompt.trim() || credits < cost))
    || (!user && (!prompt.trim() || guestExhausted));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* ====== Input Panel ====== */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            参数设置
            <Badge variant="secondary" className="ml-auto">
              {user ? (
                <>
                  <Coins className="h-3 w-3 mr-1" />
                  {credits}
                </>
              ) : (
                <>
                  <Gift className="h-3 w-3 mr-1" />
                  今日 {displayGuestRemaining}/5 次
                </>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prompt textarea */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              文案描述 <span className="text-red-500">*</span>
              <span className="font-normal text-muted-foreground ml-2">
                {prompt.length}/500
              </span>
            </label>
            <Textarea
              placeholder={tool.placeholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
              rows={5}
              maxLength={500}
            />
          </div>

          {/* Dynamic form fields */}
          {tool.formFields.map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium mb-1.5 block">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={params[field.name] || field.options?.[0]?.value || ""}
                  onChange={(e) =>
                    setParams((p) => ({ ...p, [field.name]: e.target.value }))
                  }
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  placeholder={field.placeholder}
                  value={params[field.name] || ""}
                  onChange={(e) =>
                    setParams((p) => ({ ...p, [field.name]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}

          {/* AI prompt preview */}
          {prompt.trim() && (
            <div className="p-2.5 rounded-lg bg-muted/50 text-xs text-muted-foreground line-clamp-2">
              <Dices className="h-3 w-3 inline mr-1" />
              {enrichedPrompt}
            </div>
          )}

          {/* Generate button */}
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            onClick={handleGenerate}
            disabled={generateDisabled}
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2" /> 生成中...
              </>
            ) : !user ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                免费生成（剩余 {displayGuestRemaining} 次）
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" /> 生成文案（消耗 {cost} 点）
              </>
            )}
          </Button>

          {/* Guest exhausted warning */}
          {guestExhausted && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-sm text-amber-700 dark:text-amber-400 font-medium">
                <AlertCircle className="h-4 w-4" />
                今日免费次数已用完
              </div>
              <p className="text-xs text-muted-foreground">登录后获得更多点数，无限畅用</p>
              <Link href="/login?redirect=/tools/video-script">
                <Button variant="outline" size="sm" className="w-full">
                  <LogIn className="h-3.5 w-3.5 mr-1" /> 登录 / 注册
                </Button>
              </Link>
            </div>
          )}

          {/* No credits warning (logged in only) */}
          {user && credits < cost && (
            <div className="p-3 rounded-lg bg-destructive/10 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-sm text-destructive font-medium">
                <AlertCircle className="h-4 w-4" />
                点数不足，无法生成
              </div>
              <Link href="/recharge">
                <Button variant="outline" size="sm" className="w-full">
                  去充值 <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {/* Credits remaining after success (logged in) */}
          {user && creditsRemaining !== null && (
            <p className="text-xs text-center text-muted-foreground">
              剩余点数：<span className="font-medium text-foreground">{creditsRemaining}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* ====== Result Panel ====== */}
      <Card className="lg:col-span-2 overflow-hidden min-w-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">生成结果</CardTitle>
          {result && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? "已复制" : "复制"}
              </Button>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RefreshCw className="h-4 w-4 mr-1" /> 重新生成
              </Button>
            </div>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <LoadingSpinner className="h-8 w-8 mb-4" />
              <p className="text-sm font-medium">AI 正在为你创作...</p>
              <p className="text-xs mt-1">这可能需要 5-15 秒</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
              <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                生成失败
              </div>
              <p className="text-sm text-destructive/80">{error}</p>
              {user && error.includes("点数不足") && (
                <Link href="/recharge">
                  <Button variant="outline" size="sm" className="mt-1">
                    去充值 <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto break-words prose-headings:text-foreground prose-p:text-foreground/85 prose-li:text-foreground/85 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-border [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Sparkles className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">在左侧输入需求</p>
              <p className="text-xs mt-1">AI 将为你生成专属文案</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}