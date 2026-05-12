import { Metadata } from "next";
import { ToolForm } from "@/components/tools/tool-form";
import { TOOL_CONFIGS } from "@/constants";

export const metadata: Metadata = {
  title: "电商标题生成",
  description: "AI电商平台标题优化工具，支持淘宝、拼多多、京东等平台，生成SEO优化的产品标题和描述",
  keywords: ["电商标题", "淘宝标题", "拼多多标题", "京东标题", "SEO标题", "产品标题优化"],
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
