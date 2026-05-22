"use client";

import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/constants";
import { Link2 } from "lucide-react";

// 分享到微博
const shareToWeibo = () => {
  const url = encodeURIComponent(window.location.origin);
  const title = encodeURIComponent("WriteNow - AI智能文案生成平台");
  window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, "_blank", "width=600,height=400");
};

// 分享到QQ
const shareToQQ = () => {
  const url = encodeURIComponent(window.location.origin);
  const title = encodeURIComponent("WriteNow - AI智能文案生成平台");
  const desc = encodeURIComponent("AI驱动的一站式文案生成平台，每天5次免费使用");
  window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&desc=${desc}`, "_blank", "width=600,height=400");
};

// 复制链接
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.origin);
    alert("链接已复制到剪贴板");
  } catch {
    // fallback for older browsers / 微信浏览器
    const textArea = document.createElement("textarea");
    textArea.value = window.location.origin;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("链接已复制到剪贴板");
  }
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-primary">
              {SITE_CONFIG.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              AI驱动的一站式文案生成平台，让内容创作更高效。
            </p>
            {/* 社交分享按钮 */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">分享到</p>
              <div className="flex gap-2">
                <button
                  onClick={shareToQQ}
                  className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  title="分享到QQ"
                  aria-label="分享到QQ"
                >
                  <span className="text-white text-xs font-bold">Q</span>
                </button>
                <button
                  onClick={shareToWeibo}
                  className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                  title="分享到微博"
                  aria-label="分享到微博"
                >
                  <span className="text-white text-xs font-bold">微</span>
                </button>
                <button
                  onClick={copyLink}
                  className="w-8 h-8 rounded-full bg-gray-500 hover:bg-gray-600 flex items-center justify-center transition-colors"
                  title="复制链接"
                  aria-label="复制链接"
                >
                  <Link2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">工具</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {SITE_CONFIG.navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">联系我们</h4>
            <div className="flex items-start gap-3">
              <Image
                src="/images/contact-qr.jpg"
                alt="客服微信"
                width={100}
                height={100}
                className="rounded-md border"
              />
              <p className="text-sm text-muted-foreground pt-1">
                微信扫码添加客服
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
