import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tools/tool-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOOL_CONFIGS } from "@/constants";
import { getRecentPosts } from "@/data/blog-posts";
import { ArrowRight, Sparkles, Zap, Shield, Gift, UserPlus, Crown, Heart, Infinity, Calendar } from "lucide-react";

const STEPS = [
  { icon: Sparkles, title: "选风格", desc: "从种草笔记到测评开箱，选好你要的文案风格" },
  { icon: Zap, title: "写需求", desc: "描述你的产品或内容，AI 10 秒出高质量小红书文案" },
  { icon: Shield, title: "拿文案", desc: "一键复制使用，每天免费生成，登录解锁更多风格" },
];

const FREE_RULES = [
  { icon: Infinity, title: "无限免费生成", desc: "无需注册，无限次使用基础版，AI 辅助你的内容创作" },
  { icon: UserPlus, title: "注册解锁高级", desc: "注册后解锁全部文案风格，更长输出、更高生成质量" },
  { icon: Crown, title: "会员无限制", desc: "9.9 元/月享受完整功能：超长文案、优先排队、专属风格" },
];

const SECONDARY_TOOLS = [
  TOOL_CONFIGS.moments,
  TOOL_CONFIGS.video_script,
  TOOL_CONFIGS.ecommerce,
];

const BLOG_CATEGORY_COLORS: Record<string, string> = {
  "小红书": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "朋友圈": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "电商": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function HomePage() {
  return (
    <div>
      {/* ====== Hero ====== */}
      <section className="container mx-auto px-4 py-16 sm:py-20 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Gift className="h-4 w-4 text-primary" />
          AI 一键生成 · 完全免费 · 无需注册
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          小红书文案一键生成，免费无广告
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          种草笔记｜好物分享｜爆款文案，10 秒出稿
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/tools/xiaohongshu">
            <Button size="lg">
              免费开始创作 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              登录解锁更多风格
            </Button>
          </Link>
        </div>
      </section>

      {/* ====== Tools (unified section) ====== */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Featured: 小红书 */}
        <h2 className="text-sm font-semibold text-center text-rose-500 uppercase tracking-wider mb-6">
          主打工具
        </h2>
        <Link href="/tools/xiaohongshu" className="block group mb-12">
          <div className="rounded-2xl border-2 border-rose-200 dark:border-rose-800/50 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/10 p-8 transition-shadow hover:shadow-lg hover:shadow-rose-200/30 dark:hover:shadow-rose-900/20">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-200 dark:shadow-rose-900/40">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">小红书AI文案</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  种草笔记、好物分享、测评开箱 — AI 量身定制，10 秒出高质量小红书文案
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["种草笔记", "好物分享", "测评文案", "爆款标题", "话题标签"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
                  免费开始创作 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>

        {/* More Tools */}
        <h2 className="text-sm font-medium text-center text-muted-foreground mb-6">
          更多实用工具
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {SECONDARY_TOOLS.map((tool) => (
            <ToolCard key={tool.type} tool={tool} />
          ))}
        </div>
      </section>

      {/* ====== Free Rules ====== */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-4">免费无限次，够用才付费</h2>
          <p className="text-center text-muted-foreground mb-12">
            游客无限次基础版 → 注册解锁高级 → 会员完整体验，按需升级
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
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
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-4">三步完成小红书文案创作</h2>
          <p className="text-center text-muted-foreground mb-12">
            不用学排版、不用想标题，AI 帮你把点子变成高质量文案
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
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

      {/* ====== Demo ====== */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-10">小红书文案生成效果</h2>
          <div className="space-y-3">
            <img
              src="/images/xiaohongshu-demo.png"
              alt="WriteNow 小红书文案AI生成工具使用效果截图 — 种草笔记一键生成"
              className="rounded-xl border shadow-sm w-full object-cover"
              loading="lazy"
            />
            <p className="text-center text-sm text-muted-foreground">
              输入产品描述，AI 自动生成带有 emoji、话题标签、分段排版的标准小红书笔记
            </p>
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="container mx-auto px-4 py-20 max-w-5xl text-center">
        <h2 className="text-3xl font-bold mb-4">开始生成你的第一条小红书文案</h2>
        <p className="text-muted-foreground mb-3">免费无限次，无需注册，打开即用</p>
        <p className="text-xs text-muted-foreground/60 mb-8">注册解锁更多风格 · 会员 9.9 元/月无限制</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/tools/xiaohongshu">
            <Button size="lg">
              免费体验 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              注册解锁更多
            </Button>
          </Link>
        </div>
      </section>
      {/* ====== Latest Articles ====== */}
      <LatestArticles />
    </div>
  );
}

function LatestArticles() {
  const posts = getRecentPosts(3);
  if (posts.length === 0) return null;

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">📝 文案创作指南</h2>
            <p className="text-muted-foreground text-sm">最新的小红书、朋友圈、电商标题写作技巧</p>
          </div>
          <Link href="/blog" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 flex-shrink-0">
            查看全部 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Badge className={`text-xs ${BLOG_CATEGORY_COLORS[post.category] || "bg-muted"}`}>
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {post.description}
                  </p>
                  <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    阅读全文 →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}