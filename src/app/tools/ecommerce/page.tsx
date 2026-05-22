import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "电商产品标题生成器 — 高转化标题AI写作",
  description: "免费AI电商标题生成工具，支持淘宝、拼多多、京东等多平台。生成SEO优化的产品标题和卖点描述，提升搜索排名和点击率，每天5次免费使用。",
  keywords: ["电商标题生成器", "淘宝标题优化", "拼多多标题怎么写", "产品标题SEO", "电商文案生成", "高转化标题"],
  openGraph: {
    title: "电商产品标题生成器 | WriteNow",
    description: "免费AI电商标题生成工具，支持多平台SEO优化标题和卖点描述",
  },
};

export default function Page() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{TOOL_CONFIGS.ecommerce.title}</h1>
        <p className="text-muted-foreground">{TOOL_CONFIGS.ecommerce.description}</p>
      </div>
      <ToolForm tool={TOOL_CONFIGS.ecommerce} />
    </div>
  );
}
