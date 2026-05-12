import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "小红书文案生成",
  description: "AI小红书风格笔记生成工具，支持种草文、好物分享、测评文案等多种风格，自动带emoji和话题标签",
  keywords: ["小红书文案", "种草文案", "红书笔记", "好物分享", "小红书种草"],
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
