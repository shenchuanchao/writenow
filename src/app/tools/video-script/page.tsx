import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "AI短视频脚本生成器 — 抖音·B站·视频号分镜稿在线创作",
  description: "免费无限次AI短视频脚本生成器，支持Vlog日常、教程讲解、故事叙事、好物测评等风格。自动生成分镜表格、口播稿和拍摄建议，10秒出稿无需注册。",
  keywords: ["短视频脚本生成器", "AI视频脚本", "抖音脚本在线生成", "分镜脚本模板", "口播稿生成", "视频创作工具", "短视频文案", "B站脚本助手", "视频号文案AI", "抖音拍什么内容好"],
  openGraph: {
    title: "AI短视频脚本生成器 — 分镜稿在线创作 | WriteNow",
    description: "免费无限次AI短视频脚本生成器，自动生成分镜表格和口播稿",
  },
  alternates: { canonical: "https://write.coderlog.net/tools/video-script" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ prompt?: string; style?: string; duration?: string }> }) {
  const sp = await searchParams;
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{TOOL_CONFIGS.video_script.title}</h1>
        <p className="text-muted-foreground">{TOOL_CONFIGS.video_script.description}</p>
      </div>
      <ToolForm tool={TOOL_CONFIGS.video_script} initialPrompt={sp.prompt} initialParams={{ style: sp.style, duration: sp.duration }} />
    </div>
  );
}
