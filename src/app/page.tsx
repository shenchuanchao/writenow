import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tools/tool-card";
import { TOOL_CONFIGS, SITE_CONFIG } from "@/constants";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

const STEPS = [
  { icon: Sparkles, title: "选择工具", desc: "从四种文案工具中选择你需要的类型" },
  { icon: Zap, title: "输入需求", desc: "描述你的内容需求，设置风格参数" },
  { icon: Shield, title: "获取文案", desc: "AI秒级生成高质量文案，一键复制使用" },
];

export default function HomePage() {
  return (
    <div>
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          AI驱动的
          <span className="text-primary"> 智能文案 </span>
          平台
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          {SITE_CONFIG.description} — 短视频脚本、小红书笔记、电商标题、朋友圈状态，一分钟生成高质量文案。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg">
              免费开始 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/tools/video-script">
            <Button variant="outline" size="lg">体验工具</Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">选择文案工具</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(TOOL_CONFIGS).map((tool) => (
            <ToolCard key={tool.type} tool={tool} />
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">三步完成文案创作</h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-center mb-10">工具效果示例</h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-3">
            <img
              src="/images/video-script-demo.png"
              alt="短视频脚本生成效果"
              className="rounded-xl border shadow-sm w-full object-cover"
            />
            <p className="text-center text-sm text-muted-foreground">短视频脚本生成</p>
          </div>
          <div className="space-y-3">
            <img
              src="/images/xiaohongshu-demo.png"
              alt="小红书文案效果"
              className="rounded-xl border shadow-sm w-full object-cover"
            />
            <p className="text-center text-sm text-muted-foreground">小红书文案生成</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
        <p className="text-muted-foreground mb-8">注册即送20点免费额度，立即体验AI文案的魅力</p>
        <Link href="/register">
          <Button size="lg">
            免费注册 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}