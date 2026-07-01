import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeedbackButton } from "@/components/feedback/feedback-button";
import { ClarityAnalytics } from "@/components/analytics/clarity";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://write.coderlog.net"),
  title: { default: "AI文案生成器 — 免费一键生成小红书·朋友圈·电商·视频营销文案 | WriteNow", template: "%s | WriteNow" },
  description: "AI文案生成器，免费一键生成小红书文案、朋友圈配文、电商标题、短视频脚本。无需下载注册，10秒出稿，打开即用。支持9种风格，每天无限次免费生成。",
  keywords: ["AI文案", "AI文案生成器", "一键生成文案", "AI写作", "免费文案生成器", "小红书文案生成", "朋友圈文案", "短视频脚本", "电商标题生成", "种草笔记"],
  authors: [{ name: "WriteNow" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "WriteNow",
    title: "AI文案生成器 — 免费一键生成小红书·朋友圈·电商·视频营销文案 | WriteNow",
    description: "AI文案生成器，免费一键生成小红书文案、朋友圈配文、电商标题、短视频脚本。无需下载注册，10秒出稿，打开即用。支持9种风格，每天无限次免费生成。",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI文案生成器 — 免费一键生成小红书·朋友圈·电商·视频营销文案 | WriteNow",
    description: "AI文案生成器，免费一键生成小红书文案、朋友圈配文、电商标题、短视频脚本。无需下载注册，10秒出稿，打开即用。",
  },
  robots: { index: true, follow: true },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WriteNow",
  url: "https://write.coderlog.net",
  description: "AI文案生成器 — 免费一键生成小红书文案、朋友圈配文、电商标题、短视频脚本",
  author: { "@type": "Organization", name: "WriteNow" },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://write.coderlog.net/tools/xiaohongshu?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "WriteNow AI文案生成器",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://write.coderlog.net",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
    description: "免费AI文案生成器，一键生成小红书文案、朋友圈配文、电商标题、短视频脚本，无需下载注册",
  },
  description: "AI文案生成器 — 免费一键生成小红书文案、朋友圈配文、电商标题、短视频脚本",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "AI文案生成器是什么？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI文案生成器是基于人工智能的在线写作工具，能一键生成小红书种草笔记、朋友圈配文、电商产品标题、短视频脚本等多种营销文案。只需输入主题或产品描述，10秒即可获得高质量文案。",
      },
    },
    {
      "@type": "Question",
      name: "WriteNow AI文案生成器免费吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "是的，WriteNow 提供无限次免费生成。游客无需注册即可使用基础风格，注册后解锁全部9种语气和更长输出。会员仅需9.9元/月享受优先排队和专属风格。",
      },
    },
    {
      "@type": "Question",
      name: "AI生成的文案能直接用吗？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI生成的是高质量初稿，建议做3步微调：删掉套话（如'强烈推荐'）、加入你的真实使用细节、添加小缺点增加真实感。通常2-3分钟即可改好一篇可直接发布的文案。",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <FeedbackButton />
            <ClarityAnalytics />
          </AuthProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </body>
    </html>
  );
}
