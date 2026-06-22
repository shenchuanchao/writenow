import { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, LATEST_POSTS } from "@/data/blog-posts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "文案创作指南 — AI写小红书/朋友圈/电商/短视频文案技巧",
  description: "WriteNow 博客：小红书文案怎么写、朋友圈配文技巧、电商标题优化、短视频脚本生成、AI文案工具推荐与测评等写作干货。",
  keywords: ["AI文案教程", "文案写作", "小红书教程", "朋友圈文案技巧", "电商标题优化", "短视频脚本", "AI写作教程"],
  alternates: { canonical: "https://write.coderlog.net/blog" },
};

const CATEGORY_COLORS: Record<string, string> = {
  "小红书": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "朋友圈": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "电商": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "AI文案": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "短视频": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">📝 文案创作指南</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          小红书、朋友圈、电商标题写作技巧，帮你写出高转化文案
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LATEST_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`text-xs ${CATEGORY_COLORS[post.category] || "bg-muted"}`}>
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                </div>
                <h2 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {post.description}
                </p>
                <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  阅读全文 <ArrowRight className="h-3 w-3" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
