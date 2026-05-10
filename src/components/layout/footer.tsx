import Link from "next/link";
import { SITE_CONFIG } from "@/constants";

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
            <h4 className="font-medium mb-3">关于</h4>
            <p className="text-sm text-muted-foreground">
              基于先进AI大模型，为内容创作者提供智能文案解决方案。
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
