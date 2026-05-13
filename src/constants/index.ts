import { ToolConfig, ToolType } from "@/types";

export const TOOL_CONFIGS: Record<string, ToolConfig> = {
  video_script: {
    type: "video_script",
    title: "短视频脚本",
    description: "抖音、B站、视频号等短视频脚本生成，包含分镜和口播稿",
    icon: "Video",
    color: "bg-amber-500",
    placeholder: "请描述你想要的视频主题、风格和时长...",
    formFields: [
      { name: "topic", label: "视频主题", type: "text", placeholder: "如：旅行 vlog", required: true },
      { name: "style", label: "视频风格", type: "select", options: [
        { value: "vlog", label: "Vlog 日常" },
        { value: "tutorial", label: "教程讲解" },
        { value: "story", label: "故事叙事" },
        { value: "review", label: "好物测评" },
      ]},
      { name: "duration", label: "时长（秒）", type: "select", options: [
        { value: "30", label: "30 秒" },
        { value: "60", label: "60 秒" },
        { value: "180", label: "3 分钟" },
      ]},
    ],
  },
  xiaohongshu: {
    type: "xiaohongshu",
    title: "小红书文案",
    description: "小红书风格笔记、种草文、好物分享文案生成",
    icon: "Heart",
    color: "bg-rose-500",
    placeholder: "请描述你要分享的内容或产品...",
    formFields: [
      { name: "topic", label: "分享主题", type: "text", placeholder: "如：夏日防晒好物", required: true },
      { name: "tone", label: "语气风格", type: "select", options: [
        { value: "casual", label: "日常随意" },
        { value: "professional", label: "专业测评" },
        { value: "cute", label: "可爱软萌" },
        { value: "emotional", label: "情感共鸣" },
      ]},
      { name: "hashtags", label: "是否带话题标签", type: "select", options: [
        { value: "yes", label: "是" },
        { value: "no", label: "否" },
      ]},
    ],
  },
  ecommerce: {
    type: "ecommerce",
    title: "电商标题",
    description: "淘宝、拼多多、京东等电商平台标题优化与SEO描述",
    icon: "ShoppingCart",
    color: "bg-orange-500",
    placeholder: "请描述你的产品特点、卖点和目标客群...",
    formFields: [
      { name: "product", label: "产品名称", type: "text", placeholder: "如：无线蓝牙耳机", required: true },
      { name: "platform", label: "平台", type: "select", options: [
        { value: "taobao", label: "淘宝" },
        { value: "pdd", label: "拼多多" },
        { value: "jd", label: "京东" },
      ]},
      { name: "keywords", label: "核心关键词", type: "text", placeholder: "如：降噪、长续航、低延迟" },
    ],
  },
  moments: {
    type: "moments",
    title: "朋友圈文案",
    description: "朋友圈、微信状态文案生成，让你的动态更有趣",
    icon: "MessageCircle",
    color: "bg-emerald-500",
    placeholder: "说说你想分享的事情或心情...",
    formFields: [
      { name: "scene", label: "场景", type: "select", options: [
        { value: "daily", label: "日常生活" },
        { value: "travel", label: "旅行打卡" },
        { value: "food", label: "美食分享" },
        { value: "mood", label: "心情感悟" },
        { value: "work", label: "工作加班" },
      ]},
      { name: "tone", label: "文风", type: "select", options: [
        { value: "humor", label: "幽默搞笑" },
        { value: "literary", label: "文艺清新" },
        { value: "simple", label: "简约日常" },
        { value: "deep", label: "深度感悟" },
      ]},
    ],
  },
};

export const SITE_CONFIG = {
  name: "WriteNow",
  description: "一站式 AI 文案工具平台",
  navLinks: [
    { href: "/tools/video-script", label: "短视频脚本" },
    { href: "/tools/xiaohongshu", label: "小红书" },
    { href: "/tools/ecommerce", label: "电商标题" },
    { href: "/tools/moments", label: "朋友圈" },
  ],
};

export const CREDIT_PACKAGES = [
  { id: "basic", credits: 20, price: 9.9, label: "基础包", popular: false },
  { id: "pro", credits: 100, price: 39.9, label: "进阶包", popular: true },
  { id: "max", credits: 300, price: 99, label: "顶配套餐", popular: false },
];

export function getCost(toolType: ToolType, params?: Record<string, unknown>): number {
  if (toolType === "video_script") {
    const duration = params?.duration as string | undefined;
    if (duration === "60") return 2;
    if (duration === "180") return 5;
    return 1; // default 30s
  }
  return 1;
}

export const COST_PER_GENERATION = 1;
export const PAGE_SIZE = 20;