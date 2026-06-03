import { Metadata } from "next";
import Link from "next/link";
import { TEMPLATES, TOOL_LABELS, getTemplatesByTool } from "@/data/templates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "热门文案模板 — 小红书·短视频·电商·朋友圈一键套用",
  description: "精选热门AI文案模板库，覆盖小红书种草、短视频脚本、电商标题、朋友圈文案等场景。点击模板即可自动填入，快速生成高质量文案，免费无限次使用。",
  keywords: ["文案模板", "小红书模板", "短视频脚本模板", "电商标题模板", "朋友圈文案模板", "AI写作模板", "种草文案模板"],
  openGraph: {
    title: "热门文案模板库 | WriteNow",
    description: "精选AI文案模板，点击即可一键套用生成",
  },
  alternates: { canonical: "https://write.coderlog.net/templates" },
};

const TOOL_COLORS: Record<string, string> = {
  xiaohongshu: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  video_script: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ecommerce: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  moments: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const TOOL_HREFS: Record<string, string> = {
  xiaohongshu: "/tools/xiaohongshu",
  video_script: "/tools/video-script",
  ecommerce: "/tools/ecommerce",
  moments: "/tools/moments",
};

export default function TemplatesPage() {
  const grouped = getTemplatesByTool();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">📋 热门文案模板</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          精选热门文案模板，覆盖小红书、短视频、电商、朋友圈四大场景。
          点击任意模板即可自动填入表单，一键生成你的专属文案。
        </p>
      </div>

      {/* Template groups */}
      {Object.entries(grouped).map(([toolType, templates]) => (
        <section key={toolType} className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TOOL_COLORS[toolType] || "bg-muted"}`}>
              {TOOL_LABELS[toolType] || toolType}
            </span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((tpl) => (
              <Link
                key={tpl.id}
                href={`${TOOL_HREFS[tpl.toolType]}?prompt=${encodeURIComponent(tpl.prompt)}${tpl.params ? Object.entries(tpl.params).map(([k, v]) => `&${k}=${encodeURIComponent(v)}`).join("") : ""}`}
              >
                <Card className="h-full group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {tpl.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {tpl.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tpl.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="h-3 w-3" />
                      使用此模板
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
