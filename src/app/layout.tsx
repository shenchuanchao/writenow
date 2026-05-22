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
  title: { default: "WriteNow - AI文案生成平台｜短视频脚本｜小红书文案｜电商标题", template: "%s | WriteNow" },
  description: "AI驱动的一站式文案生成平台，支持短视频脚本、小红书文案、电商标题、朋友圈文案生成，每天5次免费使用，无需登录即可体验",
  keywords: ["AI文案工具", "文案生成", "短视频脚本", "小红书文案", "电商标题", "朋友圈文案", "AI写作工具", "智能文案", "内容创作", "免费AI写作"],
  authors: [{ name: "WriteNow" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "WriteNow",
    title: "WriteNow - AI智能文案生成平台",
    description: "AI驱动的一站式文案生成平台，每天5次免费使用，支持短视频脚本、小红书文案、电商标题、朋友圈文案生成",
    images: [{ url: "/public/logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WriteNow - AI智能文案生成平台",
    description: "AI驱动的一站式文案生成平台，每天5次免费使用，支持短视频脚本、小红书文案、电商标题、朋友圈文案生成",
  },
  robots: { index: true, follow: true },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WriteNow",
  url: "https://write.coderlog.net",
  description: "AI驱动的一站式文案生成平台，每天5次免费使用",
  author: { "@type": "Organization", name: "WriteNow" },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://write.coderlog.net/tools/video-script?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "WriteNow AI文案工具",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://write.coderlog.net",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
    description: "每日5次免费生成，注册用户额外20点额度",
  },
  description: "免费AI文案生成工具，支持短视频脚本、小红书文案、电商标题、朋友圈文案",
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
