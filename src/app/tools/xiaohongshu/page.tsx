import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "小红书文案AI生成器 — 爆款笔记一键创作",
  description: "免费AI小红书文案生成工具，支持种草文、好物分享、测评笔记等多种风格。自动配emoji表情和热门话题标签，提升笔记曝光率，每天5次免费使用。",
  keywords: ["小红书文案生成器", "小红书种草文案", "AI写红书笔记", "好物分享文案", "小红书爆款标题", "小红书排版工具"],
  openGraph: {
    title: "小红书文案AI生成器 | WriteNow",
    description: "免费AI小红书文案生成工具，自动配emoji和话题标签，提升曝光率",
  },
};

export default function Page() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{TOOL_CONFIGS.xiaohongshu.title}</h1>
        <p className="text-muted-foreground">{TOOL_CONFIGS.xiaohongshu.description}</p>
      </div>
      <ToolForm tool={TOOL_CONFIGS.xiaohongshu} />
    </div>
  );
}
