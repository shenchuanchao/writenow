"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, X } from "lucide-react";

const TYPES = [
  { value: "bug", label: "Bug反馈" },
  { value: "feature", label: "功能建议" },
  { value: "other", label: "其他" },
];

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("bug");
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (content.length < 5) {
      setError("请至少输入5个字符");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content, contact }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setContent("");
        setContact("");
      } else {
        setError(data.error || "提交失败");
      }
    } catch {
      setError("提交失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm font-medium">建议反馈</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => { setOpen(false); setSuccess(false); }}
          />
          <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">建议反馈</h3>
              <button
                onClick={() => { setOpen(false); setSuccess(false); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-8 space-y-2">
                <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ 提交成功！
                </div>
                <p className="text-sm text-muted-foreground">
                  感谢你的反馈，我们会认真处理。
                </p>
                <Button
                  size="sm"
                  onClick={() => { setOpen(false); setSuccess(false); }}
                >
                  关闭
                </Button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        type === t.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <Textarea
                  placeholder="请描述你的问题或建议..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px]"
                />

                <Input
                  placeholder="联系方式（选填，方便我们联系你）"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />

                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "提交中..." : "提交反馈"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}