import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "小红书文案AI生成器 — 种草笔记·好物分享·爆款标题一键生成",
  description: "免费无限次AI小红书文案生成器，支持种草笔记、好物分享、测评文案、爆款标题、话题标签等9种语气风格。10秒出稿，无需注册，完全免费无广告。",
  keywords: ["小红书文案生成器", "小红书种草文案", "AI写红书笔记", "好物分享文案", "小红书爆款标题", "小红书排版工具", "小红书slogan生成", "红书笔记怎么写", "小红书标题技巧", "小红书文案模板"],
  openGraph: {
    title: "小红书文案AI生成器 — 种草笔记·好物分享·爆款标题一键生成 | WriteNow",
    description: "免费无限次AI小红书文案生成器，支持9种语气风格，10秒出稿无需注册",
  },
  alternates: { canonical: "https://write.coderlog.net/tools/xiaohongshu" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ prompt?: string; tone?: string; hashtags?: string }> }) {
  const sp = await searchParams;
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{TOOL_CONFIGS.xiaohongshu.title}</h1>
        <p className="text-muted-foreground">{TOOL_CONFIGS.xiaohongshu.description}</p>
      </div>
      <ToolForm tool={TOOL_CONFIGS.xiaohongshu} initialPrompt={sp.prompt} initialParams={{ tone: sp.tone, hashtags: sp.hashtags }} />
    </div>
  );
}
