import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tools/tool-card";
import { TOOL_CONFIGS, SITE_CONFIG } from "@/constants";
import { ArrowRight, Sparkles, Zap, Shield, Gift, UserPlus, CreditCard } from "lucide-react";

const STEPS = [
  { icon: Sparkles, title: "选择工具", desc: "从四种文案工具中选择你需要的类型" },
  { icon: Zap, title: "输入需求", desc: "描述你的内容需求，设置风格参数，AI 秒级生成" },
  { icon: Shield, title: "获取文案", desc: "一键复制使用，每天 5 次免费，登录无限畅用" },
];

const FREE_RULES = [
  { icon: Gift, title: "游客免费用", desc: "无需注册，每天 5 次免费生成，支持全部四种文案工具" },
  { icon: UserPlus, title: "注册更划算", desc: "注册即送 20 点免费额度，按需充值，1 次生成仅消耗 1 点" },
  { icon: CreditCard, title: "按需充值", desc: "9.9 元起，点数永不过期，一次购买长期使用" },
];

export default function HomePage() {
  return (
    <div>
      {/* ====== Hero ====== */}
      <section className="container mx-auto px-4 py-16 sm:py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Gift className="h-4 w-4 text-primary" />
          无需登录，每天 5 次免费 AI 生成
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          AI 驱动的
          <span className="text-primary"> 智能文案 </span>
          平台
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          {SITE_CONFIG.description} — 短视频脚本、小红书笔记、电商标题、朋友圈状态，一分钟生成高质量文案。
        </p>
        <p className="text-sm text-muted-foreground/70 mb-10">
          不登录也能用，打开即写，每天 5 次免费额度
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/tools/video-script">
            <Button size="lg">
              开始体验（免费）<ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              注册获取更多额度
            </Button>
          </Link>
        </div>
      </section>

      {/* ====== Tools ====== */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">选择文案工具</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(TOOL_CONFIGS).map((tool) => (
            <ToolCard key={tool.type} tool={tool} />
          ))}
        </div>
      </section>

      {/* ====== Free Rules ====== */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">免费使用规则</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            透明、简单——我们对所有用户提供每日免费额度，让你放心创作
          </p>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {FREE_RULES.map((rule, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <rule.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{rule.title}</h3>
                <p className="text-sm text-muted-foreground">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== How It Works ====== */}
      <section className="py-20">
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

      {/* ====== Demo Screenshots ====== */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">工具效果示例</h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-3">
              <img
                src="/images/video-script-demo.png"
                alt="WriteNow 短视频脚本生成工具使用效果截图"
                className="rounded-xl border shadow-sm w-full object-cover"
                loading="lazy"
              />
              <p className="text-center text-sm text-muted-foreground">短视频脚本生成</p>
            </div>
            <div className="space-y-3">
              <img
                src="/images/xiaohongshu-demo.png"
                alt="WriteNow 小红书文案AI生成工具效果截图"
                className="rounded-xl border shadow-sm w-full object-cover"
                loading="lazy"
              />
              <p className="text-center text-sm text-muted-foreground">小红书文案生成</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
        <p className="text-muted-foreground mb-3">每日 5 次免费生成，注册再送 20 点，立即体验 AI 文案的魅力</p>
        <p className="text-xs text-muted-foreground/60 mb-8">无需绑定支付方式，注册即用</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/tools/video-script">
            <Button size="lg">
              免费体验 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              注册账号
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}