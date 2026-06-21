import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "小红书文案AI生成器 — 种草笔记·好物分享·爆款标题一键生成",
  description: "免费无限次AI小红书文案生成器，支持种草笔记、好物分享、测评文案、爆款标题、话题标签等9种语气风格。10秒出稿，无需注册，完全免费无广告。",
  keywords: ["小红书文案生成器", "小红书种草文案", "AI写红书笔记", "好物分享文案", "小红书爆款标题", "小红书排版工具", "小红书slogan生成", "红书笔记怎么写", "小红书标题技巧", "小红书文案模板"],
  openGraph: {
    title: "小红书文案AI生成器 — 种草笔记·好物分享·爆款标题一键生成 | WriteNow",
    description: "免费无限次AI小红书文案生成器，支持9种语气风格，10秒出稿无需注册",
  },
  alternates: { canonical: "https://write.coderlog.net/tools/xiaohongshu" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ prompt?: string; tone?: string; hashtags?: string }> }) {
  const sp = await searchParams;
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{TOOL_CONFIGS.xiaohongshu.title}</h1>
        <p className="text-muted-foreground">{TOOL_CONFIGS.xiaohongshu.description}</p>
      </div>
      <ToolForm tool={TOOL_CONFIGS.xiaohongshu} initialPrompt={sp.prompt} initialParams={{ tone: sp.tone, hashtags: sp.hashtags }} />

      {/* SEO 内容块 */}
      <section className="mt-20 border-t pt-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>如何使用AI小红书文案生成器？3步搞定</h2>
          <p>不需要写作基础，不需要排版经验，只要把你想分享的产品或主题告诉AI：</p>
          <ol>
            <li><strong>选风格</strong>：从"好物种草""专业测评""避坑指南"等9种语气中选一个，决定文案的整体感觉。</li>
            <li><strong>填主题</strong>：输入你要分享的内容，比如"氨基酸洁面乳干皮使用体验"，AI会自动理解你的需求。</li>
            <li><strong>点生成</strong>：10秒后得到一篇带emoji排版、分点结构、话题标签的完整小红书笔记，直接复制微调就能发布。</li>
          </ol>
          <p>💡 <strong>进阶技巧</strong>：同一个产品用3种不同语气各生成一篇（如"好物种草"→"测评对比"→"经验分享"），挑数据最好的那个发，点击率通常能提升2-3倍。</p>

          <h2>5个AI小红书文案Prompt示例</h2>
          <p>如果你更习惯自己调Prompt，下面是5个经过验证的高质量指令模板：</p>
          <h3>1️⃣ 美妆种草笔记</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">你是一个真实体验过的护肤博主，帮我写一篇[产品名]的小红书种草笔记。用第一人称，语气像是在跟闺蜜聊天。带emoji分段排版，250字左右，最后一句引导评论区互动。</pre>
          <h3>2️⃣ 测评对比文案</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">写一篇[产品A] vs [产品B]的对比测评小红书文案。从价格、使用感、效果三个维度打分（满分5星），最后给出购买建议。语气客观理性，不吹不黑。</pre>
          <h3>3️⃣ 避坑劝退指南</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">以一个踩过坑的真实用户角度，写一篇[产品名]的拔草避坑笔记。先说期待值，再说实际体验落差，最后客观总结适合/不适合什么人群。语气真实坦诚，不极端。</pre>
          <h3>4️⃣ 好物分享合集</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">你是某领域资深爱好者，推荐5款你亲自用过的好物。每个写2-3句话使用感受，最后给一个"最值得买"推荐。语气大大方方，不夸张。</pre>
          <h3>5️⃣ 教程干货帖</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">写一篇"[主题]的保姆级教程"小红书笔记。分步骤讲解（3-5步），每步一段文字解释，关键位置标注emoji。最后加一句"收藏备用"引导。</pre>

          <h2>常见问题</h2>
          <h3>Q: WriteNow完全免费吗？</h3>
          <p>是的。游客每天可以使用基础版无限次免费生成小红书文案，无需注册、无需付费、无广告。注册登录后可解锁全部9种语气风格和更长输出。会员9.9元/月享受优先排队和专属风格。</p>
          <h3>Q: AI生成的小红书文案能直接用吗？</h3>
          <p>AI生成的内容是"高质量初稿"，建议做两件事后再发布：① 加入你的真实使用感受（这是AI给不了的）② 微调emoji位置和段落节奏。通常2-3分钟就能改好一篇。</p>
          <h3>Q: 支持哪些文案风格？</h3>
          <p>支持9种语气：日常随意、好物种草、专业测评、可爱软萌、情感共鸣、干货科普、经验分享、避坑指南、激情感召，覆盖小红书主流内容类型。</p>
          <h3>Q: 会重复生成一样的内容吗？</h3>
          <p>不会。即使相同主题，每次生成的结果都不同。你可以点"重新生成"换一个角度，或用不同语气风格获得完全不同的文案。</p>
        </div>
      </section>

      {/* 工具交叉内链 */}
      <section className="mt-12 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground mb-3">试试其他AI文案工具：</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <a href="/tools/moments" className="text-primary hover:underline">朋友圈文案生成</a>
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
