import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "朋友圈文案生成 | WriteNow",
  description: "AI朋友圈文案生成工具，支持日常、旅行、美食、心情、工作等多种场景，提供幽默、文艺、简约等风格",
  keywords: ["朋友圈文案", "朋友圈文字", "微信状态", "心情文案", "朋友圈配文"],
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
