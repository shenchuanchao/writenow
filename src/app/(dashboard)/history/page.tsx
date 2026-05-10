"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/tools/empty-state";
import { LoadingSpinner } from "@/components/tools/loading-spinner";
import { formatDate } from "@/lib/utils";
import { History, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { GenerationRecord, ToolType, ApiResponse, PaginatedResponse } from "@/types";

const TYPE_LABELS: Record<ToolType, string> = {
  video_script: "短视频脚本",
  xiaohongshu: "小红书文案",
  ecommerce: "电商标题",
  moments: "朋友圈文案",
};

export default function HistoryPage() {
  const [items, setItems] = useState<GenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const pageSize = 20;

  const fetchHistory = async (p: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/history?page=${p}&page_size=${pageSize}`);
      const data: ApiResponse<PaginatedResponse<GenerationRecord>> = await res.json();
      if (data.success && data.data) {
        setItems(data.data.items);
        setTotal(data.data.total);
      } else {
        setError(data.error || "加载失败");
      }
    } catch {
      setError("加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(page); }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">生成历史</h1>
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8" /></div>
      ) : error ? (
        <div className="text-center py-16 text-destructive">{error}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={History} title="暂无记录" description="使用AI工具后，生成记录会出现在这里" />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{TYPE_LABELS[item.tool_type]}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-primary hover:underline mb-2">查看详情</summary>
                  <div className="mt-3 space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">原始输入</h4>
                      <p className="text-sm bg-muted rounded-lg p-3">{item.prompt}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">生成结果</h4>
                      <div className="prose prose-sm dark:prose-invert max-w-none bg-muted rounded-lg p-3">
                        <ReactMarkdown>{item.result}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </details>
              </CardContent>
            </Card>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> 上一页
              </Button>
              <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                下一页 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
