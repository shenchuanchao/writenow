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
  metadataBase: new URL("https://writenow.vercel.app"),
  title: { default: "WriteNow - AI文案生成平台", template: "%s | WriteNow" },
  description: "AI驱动的一站式文案生成平台，支持短视频脚本、小红书文案、电商标题、朋友圈文案生成，免费在线使用",
  keywords: ["AI文案", "文案生成", "短视频脚本", "小红书文案", "电商标题", "朋友圈文案", "AI写作", "智能文案", "内容创作"],
  authors: [{ name: "WriteNow" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "WriteNow",
    title: "WriteNow - AI智能文案生成平台",
    description: "AI驱动的一站式文案生成平台，支持短视频脚本、小红书文案、电商标题、朋友圈文案生成",
  },
  twitter: {
    card: "summary_large_image",
    title: "WriteNow - AI智能文案生成平台",
    description: "AI驱动的一站式文案生成平台，支持短视频脚本、小红书文案、电商标题、朋友圈文案生成",
  },
  robots: { index: true, follow: true },
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
      </body>
    </html>
  );
}
