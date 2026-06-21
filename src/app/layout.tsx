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
  title: { default: "AI文案生成器 - 免费一键生成小红书·朋友圈·电商·短视频文案 | WriteNow", template: "%s | WriteNow" },
  description: "2026最新AI文案生成器，免费一键生成小红书种草笔记、朋友圈配文、电商爆款标题、短视频脚本。无需注册，10秒出稿，每天无限次使用。",
  keywords: ["AI文案", "AI文案生成器", "一键生成文案", "AI写作", "免费文案生成器", "小红书文案生成", "朋友圈文案", "短视频脚本", "电商标题生成", "种草笔记"],
  authors: [{ name: "WriteNow" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "WriteNow",
    title: "AI文案生成器 — 免费一键生成小红书·朋友圈·电商·短视频文案 | WriteNow",
    description: "2026最新AI文案生成器，免费一键生成小红书种草笔记、朋友圈配文、电商爆款标题、短视频脚本。无需注册，10秒出稿，每天无限次使用。",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI文案生成器 — 免费一键生成小红书·朋友圈·电商·短视频文案 | WriteNow",
    description: "2026最新AI文案生成器，免费一键生成小红书种草笔记、朋友圈配文、电商爆款标题、短视频脚本。无需注册，10秒出稿，每天无限次使用。",
  },
  robots: { index: true, follow: true },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WriteNow",
  url: "https://write.coderlog.net",
  description: "AI文案生成器 — 免费一键生成小红书种草笔记、朋友圈配文、电商标题、短视频脚本",
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
    description: "免费AI文案生成器，一键生成小红书·朋友圈·电商·短视频文案，无需注册",
  },
  description: "AI文案生成器 — 免费一键生成小红书种草笔记、朋友圈配文、电商标题、短视频脚本",
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
