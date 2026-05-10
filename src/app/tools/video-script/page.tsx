import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "短视频脚本生成 | WriteNow",
  description: "AI短视频脚本生成工具，支持Vlog、教程讲解、故事叙事、好物测评等多种风格，自动生成分镜脚本、口播稿和拍摄建议",
  keywords: ["短视频脚本", "视频脚本生成", "抖音脚本", "B站脚本", "分镜脚本", "口播稿"],
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
