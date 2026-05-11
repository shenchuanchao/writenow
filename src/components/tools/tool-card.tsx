import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolConfig } from "@/types";
import { Video, Heart, ShoppingCart, MessageCircle } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Video, Heart, ShoppingCart, MessageCircle,
};

export function ToolCard({ tool }: { tool: ToolConfig }) {
  const Icon = ICON_MAP[tool.icon] || Video;
  return (
    <Link href={`/tools/${tool.type.replace(/_/g, "-")}`}>
      <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
        <CardHeader>
          <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <CardTitle>{tool.title}</CardTitle>
          <CardDescription>{tool.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-sm font-medium text-primary group-hover:underline">
            开始使用 &rarr;
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
