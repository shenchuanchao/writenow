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

      {/* SEO 内容块 */}
      <section className="mt-20 border-t pt-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>AI短视频脚本生成器使用指南</h2>
          <ol>
            <li><strong>填视频主题</strong>：描述你想拍的视频内容，比如"去大理3天2夜旅行vlog"，越具体AI理解越准。</li>
            <li><strong>选风格</strong>：Vlog日常适合生活记录、教程讲解适合知识分享、故事叙事适合有情节的内容、好物测评适合种草推荐。</li>
            <li><strong>定时长</strong>：30秒适合短视频平台、60秒适合中等深度内容、3分钟适合B站或视频号长内容。</li>
            <li><strong>一键生成</strong>：20秒出完整脚本，含分镜表格（场景+画面+台词+时长）和完整的拍摄建议。</li>
          </ol>
          <p>💡 <strong>进阶用法</strong>：生成脚本后，把分镜表格直接发给拍摄的小伙伴或自己当拍摄清单用，按镜头逐个拍，剪辑效率提升50%以上。</p>

          <h2>3个Prompt示例</h2>
          <h3>旅行Vlog</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">为"[目的地]3天2夜旅行"写一个60秒的Vlog短视频脚本。包含分镜表（场景、画面描述、口播台词、时长），开头3秒要有吸引钩子，结尾自然收束。口语化，像在和朋友分享。</pre>
          <h3>好物测评</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">写一个[产品名]的30秒测评短视频脚本。开头直接展示使用效果（钩子），中间讲3个核心卖点，结尾给出购买建议。分镜表包含特写镜头和字幕提示。</pre>
          <h3>教程教学</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">写一个"[技能/教程主题]"的3分钟教学视频脚本。开头说学完能达成什么效果，分5-8个步骤讲解，每步配画面说明和口播稿，结尾总结关键点+引导关注。</pre>

          <h2>常见问题</h2>
          <h3>Q: 生成的脚本适合什么平台？</h3>
          <p>30秒版本适合抖音、视频号；60秒版本适合小红书视频和抖音深度内容；3分钟版本适合B站、YouTube。不同时长的脚本结构、节奏、信息密度都不同，AI会自动适配。</p>
          <h3>Q: 分镜表里的内容能直接用吗？</h3>
          <p>分镜表提供的是拍摄框架——每个镜头拍什么、说什么、多长时间。你拿到后可以直接当拍摄清单用，根据实际场景调整具体画面即可。</p>
          <h3>Q: 不会拍摄怎么办？</h3>
          <p>AI会给出具体的画面描述和拍摄建议，比如"手持跟拍""固定机位俯拍""切换到产品特写"等。跟着分镜逐个拍，手机就能拍出有节奏感的视频。</p>
        </div>
      </section>

      <section className="mt-12 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground mb-3">试试其他AI文案工具：</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <a href="/tools/xiaohongshu" className="text-primary hover:underline">小红书文案生成</a>
          <span className="text-muted-foreground">·</span>
          <a href="/tools/moments" className="text-primary hover:underline">朋友圈文案生成</a>
          <span className="text-muted-foreground">·</span>
          <a href="/tools/ecommerce" className="text-primary hover:underline">电商标题优化</a>
          <span className="text-muted-foreground">·</span>
          <a href="/blog" className="text-primary hover:underline">文案创作指南</a>
        </div>
      </section>
    </div>
  );
}
