import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "AI短视频脚本生成器 — 在线创作分镜稿",
  description: "免费AI短视频脚本生成工具，支持Vlog日常、教程讲解、故事叙事、好物测评等多种风格。自动生成分镜脚本、口播稿和拍摄建议，每天5次免费使用。",
  keywords: ["短视频脚本生成器", "AI视频脚本", "抖音脚本在线生成", "分镜脚本模板", "口播稿生成", "视频创作工具", "短视频文案"],
  openGraph: {
    title: "AI短视频脚本生成器 | WriteNow",
    description: "免费AI短视频脚本生成工具，支持多种风格，自动生成分镜脚本和口播稿",
  },
};

export default function Page() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{TOOL_CONFIGS.video_script.title}</h1>
        <p className="text-muted-foreground">{TOOL_CONFIGS.video_script.description}</p>
      </div>
      <ToolForm tool={TOOL_CONFIGS.video_script} />
    </div>
  );
}
