import { ToolType } from "@/types";

export interface Template {
  id: string;
  title: string;
  description: string;
  toolType: ToolType;
  prompt: string;
  params?: Record<string, string>;
  tags: string[];
}

export const TEMPLATES: Template[] = [
  // ==================== 小红书 ====================
  {
    id: "xhs-sunscreen",
    title: "夏日防晒好物推荐",
    description: "适合美妆博主分享防晒霜测评，带使用感受和对比",
    toolType: "xiaohongshu",
    prompt: "推荐几款我今年夏天用过最值得入手的防晒霜，从肤感、防晒力、性价比三个维度对比，适合油皮和混油皮",
    params: { tone: "recommend", hashtags: "yes" },
    tags: ["防晒", "测评", "夏季"],
  },
  {
    id: "xhs-skincare-student",
    title: "平价学生党护肤品测评",
    description: "百元内护肤好物实测，适合学生党种草向",
    toolType: "xiaohongshu",
    prompt: "分享我用过的5款百元内平价护肤品真实体验，从洗面奶到面霜全套，适合学生党和预算党",
    params: { tone: "cute", hashtags: "yes" },
    tags: ["平价", "学生党", "护肤"],
  },
  {
    id: "xhs-coffee-shop",
    title: "周末探店宝藏咖啡厅",
    description: "探店分享类笔记，环境+饮品+拍照攻略",
    toolType: "xiaohongshu",
    prompt: "打卡了一家藏在巷子里的日系咖啡厅，环境超治愈，招牌抹茶拿铁和巴斯克蛋糕绝了，附送拍照机位攻略",
    params: { tone: "casual", hashtags: "yes" },
    tags: ["探店", "咖啡", "周末"],
  },
  {
    id: "xhs-fitness-30days",
    title: "健身打卡30天变化",
    description: "身材管理类种草，适合健身博主的打卡总结",
    toolType: "xiaohongshu",
    prompt: "坚持健身30天的真实变化总结，从体重、体脂率、围度三个维度对比，分享我的饮食和训练计划",
    params: { tone: "emotional", hashtags: "yes" },
    tags: ["健身", "打卡", "自律"],
  },
  {
    id: "xhs-room-makeover",
    title: "租房改造出租屋攻略",
    description: "家居改造类实用干货，低成本提升幸福感",
    toolType: "xiaohongshu",
    prompt: "500元预算改造10平米出租屋，从墙面、灯光、收纳三个方面分享我的改造思路和购物清单",
    params: { tone: "informative", hashtags: "yes" },
    tags: ["租房改造", "家居", "干货"],
  },
  {
    id: "xhs-commute-outfit",
    title: "通勤穿搭一周Look",
    description: "穿搭分享类内容，OOTD通勤风合集",
    toolType: "xiaohongshu",
    prompt: "分享我一周5天的通勤穿搭，主打简约气质风，每套预算300以内，附单品链接和搭配思路",
    params: { tone: "casual", hashtags: "yes" },
    tags: ["穿搭", "通勤", "OOTD"],
  },
  {
    id: "xhs-bikeng",
    title: "网红产品踩雷合集",
    description: "避坑指南类内容，帮姐妹们省钱的真实吐槽",
    toolType: "xiaohongshu",
    prompt: "盘点我上半年跟风买过最后悔的5件网红产品，从美妆到家居都有，重点说为什么不值得买和替代推荐",
    params: { tone: "warn", hashtags: "yes" },
    tags: ["避坑", "踩雷", "劝退"],
  },
  {
    id: "xhs-weekend-trip",
    title: "周末周边游强烈安利",
    description: "旅行攻略类，激情感召式种草目的地",
    toolType: "xiaohongshu",
    prompt: "求求姐妹们一定要去这个地方！距市区1小时车程的绝美小众景点，人少景美出片率超高，附交通住宿美食全攻略",
    params: { tone: "enthusiastic", hashtags: "yes" },
    tags: ["周末游", "周边", "攻略"],
  },
  {
    id: "xhs-study-method",
    title: "三个月逆袭上岸经验分享",
    description: "学习方法类，讲真实经历引发共情",
    toolType: "xiaohongshu",
    prompt: "从学渣到考上心仪学校，分享我这三个月的高效学习方法和时间管理技巧，每天只学6小时但效率翻倍",
    params: { tone: "story", hashtags: "yes" },
    tags: ["学习", "经验", "逆袭"],
  },

  // ==================== 短视频脚本 ====================
  {
    id: "video-unboxing",
    title: "数码产品开箱体验",
    description: "第一人称开箱测评，适合数码博主的内容模板",
    toolType: "video_script",
    prompt: "新买的降噪耳机到了，从开箱、外观、佩戴舒适度、音质、降噪效果五个方面做第一人称真实体验分享",
    params: { style: "review", duration: "60" },
    tags: ["开箱", "测评", "数码"],
  },
  {
    id: "video-travel-vlog",
    title: "一日游旅行Vlog",
    description: "旅行打卡类短视频脚本，含行程和拍摄建议",
    toolType: "video_script",
    prompt: "记录周末杭州一日游的全过程：早上西湖晨跑→中午打卡网红餐厅→下午灵隐寺→晚上河坊街夜市",
    params: { style: "vlog", duration: "60" },
    tags: ["旅行", "Vlog", "一日游"],
  },
  {
    id: "video-cooking-tutorial",
    title: "美食制作教程",
    description: "厨房教程类脚本，适合美食博主和烹饪教学",
    toolType: "video_script",
    prompt: "手把手教你做一道酸菜鱼，从选鱼、片鱼、腌制、煮汤每个步骤详细讲解，新手也能一次成功",
    params: { style: "tutorial", duration: "180" },
    tags: ["美食", "教程", "烹饪"],
  },
  {
    id: "video-story-vlog",
    title: "我的转行故事",
    description: "故事叙事风格，适合个人IP人设类内容",
    toolType: "video_script",
    prompt: "从月薪5K到月入3W的自媒体之路：分享我转行自媒体的心路历程、踩过的坑和三条核心经验",
    params: { style: "story", duration: "180" },
    tags: ["故事", "自媒体", "成长"],
  },

  // ==================== 电商标题 ====================
  {
    id: "ec-dress-summer",
    title: "夏季爆款连衣裙",
    description: "女装类淘宝标题优化，适合服饰电商卖家",
    toolType: "ecommerce",
    prompt: "法式复古碎花连衣裙，V领收腰显瘦，雪纺面料透气舒适，适合约会通勤度假，多色可选",
    params: { platform: "taobao", keywords: "碎花 显瘦 法式 雪纺 收腰" },
    tags: ["连衣裙", "女装", "淘宝"],
  },
  {
    id: "ec-phone-case",
    title: "手机壳标题优化",
    description: "3C配件拼多多标题，低价走量型产品",
    toolType: "ecommerce",
    prompt: "iPhone 15 Pro Max 磁吸防摔透明手机壳，不发黄不变形，四角气囊保护，镜头全包设计",
    params: { platform: "pdd", keywords: "防摔 磁吸 透明 不发黄 iPhone" },
    tags: ["手机壳", "3C", "拼多多"],
  },
  {
    id: "ec-storage-box",
    title: "家居收纳神器",
    description: "家居用品京东标题，品质感卖点突出",
    toolType: "ecommerce",
    prompt: "多功能可折叠收纳箱，加厚PP材质，大容量带盖防尘，可叠放节省空间，适合衣柜厨房杂物整理",
    params: { platform: "jd", keywords: "收纳箱 可折叠 大容量 加厚 防尘" },
    tags: ["收纳", "家居", "京东"],
  },

  // ==================== 朋友圈 ====================
  {
    id: "mom-travel-checkin",
    title: "周末出游打卡",
    description: "旅行类朋友圈，配图发圈一步到位",
    toolType: "moments",
    prompt: "周末和朋友自驾去了莫干山，住了一间超美的竹林民宿，晚上在露台看星星聊天，太治愈了",
    params: { scene: "travel", tone: "literary" },
    tags: ["旅行", "周末", "治愈"],
  },
  {
    id: "mom-late-work",
    title: "深夜加班感悟",
    description: "工作场景朋友圈，幽默化解加班负能量",
    toolType: "moments",
    prompt: "又是一个加班到凌晨的夜晚，办公室里只剩我和咖啡机，但想到下个月的旅行计划突然又有了动力",
    params: { scene: "work", tone: "humor" },
    tags: ["加班", "工作", "深夜"],
  },
  {
    id: "mom-foodie",
    title: "美食探店分享",
    description: "美食朋友圈文案，适合饭前拍照发圈",
    toolType: "moments",
    prompt: "终于拔草了收藏夹里躺了半年的日料店，鹅肝寿司入口即化，三文鱼刺身厚切超满足",
    params: { scene: "food", tone: "simple" },
    tags: ["美食", "探店", "日料"],
  },
  {
    id: "mom-fitness-morning",
    title: "早起健身打卡",
    description: "自律激励类朋友圈，适合健身打卡配图",
    toolType: "moments",
    prompt: "连续30天6点起床运动打卡完成！从跑800米就喘到现在能跑5公里，变化真的太让人惊喜了",
    params: { scene: "daily", tone: "deep" },
    tags: ["健身", "早起", "自律"],
  },
];

/** 按工具类型分组 */
export function getTemplatesByTool(): Record<string, Template[]> {
  const groups: Record<string, Template[]> = {};
  for (const t of TEMPLATES) {
    if (!groups[t.toolType]) groups[t.toolType] = [];
    groups[t.toolType].push(t);
  }
  return groups;
}

/** 工具类型 → 显示标签 */
export const TOOL_LABELS: Record<string, string> = {
  xiaohongshu: "小红书文案",
  video_script: "短视频脚本",
  ecommerce: "电商标题",
  moments: "朋友圈文案",
};
