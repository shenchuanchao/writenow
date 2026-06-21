import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "电商产品标题生成器 — 淘宝·拼多多·京东高转化标题AI写作",
  description: "免费无限次AI电商标题生成器，支持淘宝、拼多多、京东等多平台SEO优化。一键生成高转化产品标题、卖点描述和搜索关键词，10秒出稿无需注册。",
  keywords: ["电商标题生成器", "淘宝标题优化", "拼多多标题怎么写", "产品标题SEO", "电商文案生成", "高转化标题", "京东商品标题", "1688标题优化", "电商搜索关键词", "产品卖点生成"],
  openGraph: {
    title: "电商产品标题生成器 — 多平台高转化标题AI写作 | WriteNow",
    description: "免费无限次AI电商标题生成器，支持淘宝·拼多多·京东多平台SEO优化",
  },
  alternates: { canonical: "https://write.coderlog.net/tools/ecommerce" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ prompt?: string; platform?: string; keywords?: string }> }) {
  const sp = await searchParams;
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{TOOL_CONFIGS.ecommerce.title}</h1>
        <p className="text-muted-foreground">{TOOL_CONFIGS.ecommerce.description}</p>
      </div>
      <ToolForm tool={TOOL_CONFIGS.ecommerce} initialPrompt={sp.prompt} initialParams={{ platform: sp.platform, keywords: sp.keywords }} />

      {/* SEO 内容块 */}
      <section className="mt-20 border-t pt-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>如何使用AI电商标题生成器？</h2>
          <ol>
            <li><strong>填产品信息</strong>：输入产品名称和核心卖点，比如"无线降噪蓝牙耳机 40dB深度降噪 30小时续航"。</li>
            <li><strong>选平台</strong>：淘宝标题偏SEO关键词密度、拼多多需要低价暗示、京东侧重品质和服务词 — AI会自动适配。</li>
            <li><strong>一键生成</strong>：10秒出标题，核心词自动前置到权重最高位置，空格断词便于搜索引擎分词。</li>
          </ol>
          <p>💡 <strong>关键规则</strong>：电商标题前30个字符权重最高，AI会自动把核心关键词排在最前面。生成后建议观察1周的搜索曝光和点击率数据，不满意就调整关键词重新生成。</p>

          <h2>3个平台Prompt示例</h2>
          <h3>淘宝标题</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">为[产品名]生成一个淘宝标题，25-30字，核心关键词前置，关键属性词用空格分隔。卖点排序：品类→核心功能→材质→场景。不要堆砌无关热搜词。</pre>
          <h3>拼多多标题</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">为[产品名]生成拼多多标题，20-28字。加"X件装""学生党""白菜价"等低价暗示词。关键词用空格分隔，突出性价比。</pre>
          <h3>京东标题</h3>
          <pre className="not-prose bg-muted text-foreground p-4 rounded-lg text-sm whitespace-pre-wrap break-words">为[产品名]生成京东标题，20-25字。突出品质工艺和物流服务，如"德国工艺""顺丰直发""2年质保"。语气专业可信。</pre>

          <h2>常见问题</h2>
          <h3>Q: 为什么电商标题里要用空格而不是逗号？</h3>
          <p>电商搜索引擎对空格更友好，一个空格 = 一次重新分词 = 多一个搜索匹配机会。逗号在某些平台上不被识别为分词符，可能导致关键词连在一起。</p>
          <h3>Q: 生成后还需要优化吗？</h3>
          <p>建议每周花10分钟看一眼搜索数据：曝光涨但点击率跌 → 标题偏了；点击率高但转化低 → 主图或价格有问题。根据数据微调关键词即可。</p>
        </div>
      </section>

      <section className="mt-12 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground mb-3">试试其他AI文案工具：</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <a href="/tools/xiaohongshu" className="text-primary hover:underline">小红书文案生成</a>
          <span className="text-muted-foreground">·</span>
          <a href="/tools/moments" className="text-primary hover:underline">朋友圈文案生成</a>
          <span className="text-muted-foreground">·</span>
          <a href="/tools/video-script" className="text-primary hover:underline">短视频脚本生成</a>
          <span className="text-muted-foreground">·</span>
          <a href="/blog" className="text-primary hover:underline">文案创作指南</a>
        </div>
      </section>
    </div>
  );
}
