import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "朋友圈文案自动生成器 — 圈粉好文AI创作",
  description: "免费AI朋友圈文案生成工具，覆盖日常、旅行、美食、心情、工作等多种场景。支持幽默搞笑、文艺清新、简约日常等风格，让你的动态更有趣，每天5次免费使用。",
  keywords: ["朋友圈文案生成器", "微信朋友圈文案", "朋友圈配文神器", "心情文案自动生成", "朋友圈文字灵感", "微信状态文案"],
  openGraph: {
    title: "朋友圈文案自动生成器 | WriteNow",
    description: "免费AI朋友圈文案生成工具，多场景多风格，让你的动态更有趣",
  },
};

export default function Page() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{TOOL_CONFIGS.moments.title}</h1>
        <p className="text-muted-foreground">{TOOL_CONFIGS.moments.description}</p>
      </div>
      <ToolForm tool={TOOL_CONFIGS.moments} />
    </div>
  );
}
