import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog-posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  params: Promise<{ slug: string }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  "小红书": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "朋友圈": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "电商": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "AI文案": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "文章未找到" };

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
    alternates: { canonical: `https://write.coderlog.net/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const postIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const post = BLOG_POSTS[postIndex];
  if (!post) notFound();

  const prevPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null;
  const nextPost = postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "WriteNow" },
    publisher: { "@type": "Organization", name: "WriteNow" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/blog" className="hover:text-foreground transition-colors">
            文案创作指南
          </Link>
          <span>/</span>
          <span className="text-foreground">{post.title}</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge className={CATEGORY_COLORS[post.category] || "bg-muted"}>
              {post.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {post.date}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 约 {Math.ceil(post.content.length / 500)} 分钟
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
          <p className="text-muted-foreground">{post.description}</p>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:text-foreground prose-p:text-foreground/85 prose-li:text-foreground/85 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-hr:border-border">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>

        {post.ctaTool && (
          <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/10 text-center">
            <p className="text-muted-foreground mb-3">
              看完这篇文章，试试 AI 帮你写文案？
            </p>
            <Link href={post.ctaTool}>
              <Button>免费开始创作 <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        )}

        <div className="mt-10 pt-6 border-t flex justify-between gap-4">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="flex-1 text-left group">
              <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <ArrowLeft className="h-3 w-3" /> 上一篇
              </span>
              <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="flex-1 text-right group">
              <span className="text-xs text-muted-foreground flex items-center justify-end gap-1 mb-1">
                下一篇 <ArrowRight className="h-3 w-3" />
              </span>
              <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> 返回文章列表
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
