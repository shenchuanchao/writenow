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
    </div>
  );
}
