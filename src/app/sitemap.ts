import { MetadataRoute } from "next";

const BASE_URL = "https://write.coderlog.net";

const TOOL_ROUTES = [
  { path: "/tools/xiaohongshu", priority: 1.0, changeFreq: "daily" as const },
  { path: "/tools/video-script", priority: 0.8, changeFreq: "weekly" as const },
  { path: "/tools/ecommerce", priority: 0.8, changeFreq: "weekly" as const },
  { path: "/tools/moments", priority: 0.8, changeFreq: "weekly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...TOOL_ROUTES.map((tool) => ({
      url: `${BASE_URL}${tool.path}`,
      lastModified,
      changeFrequency: tool.changeFreq,
      priority: tool.priority,
    })),
    {
      url: `${BASE_URL}/templates`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
