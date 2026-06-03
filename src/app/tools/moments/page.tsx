import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "朋友圈文案自动生成器 — 日常·旅行·美食·心情圈粉好文AI创作",
  description: "免费无限次AI朋友圈文案生成器，覆盖日常生活、旅行打卡、美食分享、心情感悟、工作加班等场景。支持幽默搞笑、文艺清新、简约日常等风格，10秒出稿无需注册。",
  keywords: ["朋友圈文案生成器", "微信朋友圈文案", "朋友圈配文神器", "心情文案自动生成", "朋友圈文字灵感", "微信状态文案", "朋友圈怎么发文案", "高质量朋友圈文字", "朋友圈emoji配文", "朋友圈搞笑文案"],
  openGraph: {
    title: "朋友圈文案自动生成器 — 多场景圈粉好文AI创作 | WriteNow",
    description: "免费无限次AI朋友圈文案生成器，多场景多风格，10秒出稿无需注册",
  },
  alternates: { canonical: "https://write.coderlog.net/tools/moments" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ prompt?: string; scene?: string; tone?: string }> }) {
  const sp = await searchParams;
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{TOOL_CONFIGS.moments.title}</h1>
        <p className="text-muted-foreground">{TOOL_CONFIGS.moments.description}</p>
      </div>
      <ToolForm tool={TOOL_CONFIGS.moments} initialPrompt={sp.prompt} initialParams={{ scene: sp.scene, tone: sp.tone }} />
    </div>
  );
}
