import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeedbackButton } from "@/components/feedback/feedback-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://write.coderlog.net"),
  title: { default: "小红书AI文案生成器_朋友圈文案_短视频脚本免费生成 | WriteNow", template: "%s | WriteNow" },
  description: "免费无限次小红书AI文案生成器，支持种草笔记、好物分享、爆款标题一键生成。10秒出稿，无需注册，完全免费无广告。",
  keywords: ["小红书文案生成", "朋友圈文案", "短视频脚本", "AI文案工具", "种草笔记", "好物分享", "免费文案生成器", "小红书AI写作", "电商标题生成"],
  authors: [{ name: "WriteNow" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "WriteNow",
    title: "小红书文案生成器 — 免费无限次AI种草笔记·好物分享·爆款文案一键生成",
    description: "免费无限次小红书文案AI生成器，支持种草笔记、好物分享、爆款标题一键生成。10秒出稿，无需注册，完全免费无广告。",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "小红书文案生成器 — 免费AI种草笔记·好物分享·爆款文案一键生成",
    description: "免费无限次小红书文案AI生成器，支持种草笔记、好物分享、爆款标题一键生成。10秒出稿，无需注册，完全免费无广告。",
  },
  robots: { index: true, follow: true },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WriteNow",
  url: "https://write.coderlog.net",
  description: "免费小红书文案AI生成器 — 种草笔记、好物分享、爆款标题一键生成",
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
  name: "WriteNow 小红书文案生成器",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://write.coderlog.net",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
    description: "免费无限次AI文案生成工具，无需注册，完全免费无广告",
  },
  description: "免费小红书文案AI生成器，支持种草笔记、好物分享、爆款标题一键生成",
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
      </body>
    </html>
  );
}
