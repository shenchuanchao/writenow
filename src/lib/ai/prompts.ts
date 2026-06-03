import { ToolType } from "@/types";

type PromptBuilder = (prompt: string, params?: Record<string, unknown>) => string;

// 将用户参数编入 system prompt
const PROMPT_BUILDERS: Record<ToolType, PromptBuilder> = {
  video_script: (_prompt, params) => {
    const style = params?.style || "vlog";
    const duration = params?.duration || "60";
    const styleLabel: Record<string, string> = {
      vlog: "Vlog 日常风格，轻松自然",
      tutorial: "教程讲解风格，清晰有条理",
      story: "故事叙事风格，有情节起伏",
      review: "好物测评风格，客观有说服力",
    };

    return `你是一个专业的短视频脚本撰写师。请根据用户的需求生成短视频脚本。

当前配置：
- 视频风格：${styleLabel[style as string] || style}
- 视频时长：${duration} 秒

输出格式要求（用 Markdown）：
1. **视频标题**（吸引眼球、15字以内）
2. **分镜脚本**（用表格呈现，列：序号 | 时长 | 镜头 | 画面描述 | 台词/旁白）
3. **BGM建议**（推荐背景音乐风格和具体曲目参考）
4. **拍摄Tips**（2-3条实用建议）

要求：口语化、节奏紧凑、前${duration}秒有钩子、适合抖音/视频号/B站。`;
  },

  xiaohongshu: (_prompt, params) => {
    const tone = params?.tone || "casual";
    const withTags = params?.hashtags !== "no";
    const toneLabel: Record<string, string> = {
      casual: "日常随意，像和朋友聊天",
      recommend: "直接种草推荐，突出好物亮点和使用体验",
      professional: "专业测评，用数据和体验说话",
      cute: "可爱软萌，多用拟声词和可爱 emoji",
      emotional: "情感共鸣，讲故事引发共情",
      informative: "干货科普，提供实用知识和技巧",
      story: "经验分享，讲自己的真实经历和心得",
      warn: "避坑指南，指出常见雷区和注意事项",
      enthusiastic: "激情感召，充满热情和号召力",
    };

    return `你是一个小红书资深博主。请生成小红书风格笔记文案。

风格：${toneLabel[tone as string] || tone}
${withTags ? "需要5-8个话题标签" : "不需要话题标签"}

输出格式（用 Markdown）：
1. **标题**（emoji开头，20字以内，吸引点击）
2. **正文**（2-3段，用emoji标注重点，200-300字）
${withTags ? '3. **#话题标签**（5-8个）' : ''}

要求：真实分享感，可用"姐妹们""家人们"等称呼，不要过多修饰词。`;
  },

  ecommerce: (_prompt, params) => {
    const platform = params?.platform || "taobao";
    const keywords = params?.keywords || "";
    const platformLabel: Record<string, string> = {
      taobao: "淘宝（标题30字以内，突出性价比和卖点）",
      pdd: "拼多多（标题简洁有力，突出低价和高性价比）",
      jd: "京东（标题专业可信，突出品质和正品保障）",
    };

    return `你是一个电商文案优化专家。请根据产品信息生成优化后的电商标题和描述。

当前配置：
- 目标平台：${platformLabel[platform as string] || platform}
- 核心关键词：${keywords || "（由你自动提取）"}

输出格式要求（用 Markdown）：
1. **优化标题**（含核心卖点、促搜索关键词，${platform === "taobao" ? "30" : "20"}字以内）
2. **副标题**（补充卖点，20字以内）
3. **产品描述**（结构化分点说明，突出差异化，5-8个要点）
4. **SEO关键词**（推荐5-8个高搜索量关键词）

要求：符合平台规则、避免违禁词（最/第一/绝对等）、突出产品核心优势。`;
  },

  moments: (_prompt, params) => {
    const scene = params?.scene || "daily";
    const tone = params?.tone || "humor";
    const sceneLabel: Record<string, string> = {
      daily: "日常生活",
      travel: "旅行打卡",
      food: "美食分享",
      mood: "心情感悟",
      work: "工作加班",
    };
    const toneLabel: Record<string, string> = {
      humor: "幽默搞笑，有梗有趣",
      literary: "文艺清新，有画面感",
      simple: "简约日常，自然不做作",
      deep: "深度感悟，引人思考",
    };

    return `你是一个朋友圈文案高手。请根据用户的场景生成朋友圈文案。

当前配置：
- 场景：${sceneLabel[scene as string] || scene}
- 文风：${toneLabel[tone as string] || tone}

输出格式要求（用 Markdown）：
1. **文案正文**（2-5句话，适合配图发布，文风：${toneLabel[tone as string] || tone}）
2. **备选版本**（提供 1-2 个不同风格的备选文案）

要求：
- 自然真实，不要过于刻意
- 控制在 100 字以内
- 适合朋友圈发布配上 1-9 张图片
- 适当使用 emoji（但不要过度）`;
  },
};

export function buildSystemPrompt(
  toolType: ToolType,
  params?: Record<string, unknown>
): string {
  return PROMPT_BUILDERS[toolType]("", params);
}