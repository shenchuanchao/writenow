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

      {/* SEO 内容块 */}
      <section className="mt-20 border-t pt-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>AI朋友圈文案生成器怎么用？</h2>
          <ol>
            <li><strong>选场景</strong>：日常生活、旅行打卡、美食分享、心情感悟、工作加班 — 选一个你想发的场景。</li>
            <li><strong>选文风</strong>：幽默搞笑适合轻松日常、文艺清新适合旅行美图、简约日常适合随手拍、深度感悟适合走心时刻。</li>
            <li><strong>点生成</strong>：5秒出稿，包含emoji和自然断句，直接复制到微信朋友圈即可。</li>
          </ol>
          <p>💡 <strong>小提示</strong>：朋友圈文案最佳长度是40-80字、3-5行，超过100字会被微信折叠成"全文"。AI会自动控制在这个黄金区间内。</p>

          <h2>3个Prompt示例</h2>
          <h3>旅行打卡</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">你是一个正在旅行的普通上班族，发一条朋友圈记录当下的感受。不要写成导游词，要像随手发的。40-60字，带1-2个emoji，文艺清新的语气。</pre>
          <h3>加班吐槽</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">你刚加完班走出公司，想发一条朋友圈。语气是"有点累但不丧"，带点正能量，不要抱怨。30-50字，简约日常风。</pre>
          <h3>美食分享</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">你在一家等了很久的网红店吃到了好吃的，发朋友圈分享。带一点"值了"的满足感，用五感法描述（味道、口感、视觉），40-60字。</pre>

          <h2>常见问题</h2>
          <h3>Q: 朋友圈文案生成器和通用AI聊天有什么区别？</h3>
          <p>通用AI（如ChatGPT）需要你自己调prompt控制字数、语气、emoji密度。WriteNow朋友圈生成器针对微信场景做了专门优化，自动控制40-80字黄金长度、3-5行视觉节奏，生成结果可以直接复制发布。</p>
          <h3>Q: 有没有更多文风可选？</h3>
          <p>当前支持4种文风（幽默搞笑/文艺清新/简约日常/深度感悟），覆盖主流朋友圈风格。登录后可以通过自定义主题描述实现更精确的风格控制。</p>
        </div>
      </section>

      <section className="mt-12 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground mb-3">试试其他AI文案工具：</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <a href="/tools/xiaohongshu" className="text-primary hover:underline">小红书文案生成</a>
          <span className="text-muted-foreground">·</span>
          <a href="/tools/ecommerce" className="text-primary hover:underline">电商标题优化</a>
          <span className="text-muted-foreground">·</span>
          <a href="/tools/video-script" className="text-primary hover:underline">短视频脚本生成</a>
          <span className="text-muted-foreground">·</span>
          <a href="/blog" className="text-primary hover:underline">文案创作指南</a>
        </div>
      </section>
    </div>
  );
}
