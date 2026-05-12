/**
 * ============================================================
 * payment/crypto.ts
 * 支付签名与验签工具
 * 通用适配中国免签支付平台的签名方式
 * ============================================================
 */

import crypto from "crypto";

/**
 * 生成支付签名
 * 常见规则：将所有参数（排除 sign 本身）按 key 排序后拼接 "key=value&key=value"，
 * 末尾追加 apiKey，进行 MD5 或 SHA256 哈希。
 *
 * @param params  - 参与签名的参数对象
 * @param apiKey  - 商户 API 密钥
 * @param signType - 签名方式 (md5 | sha256)，默认 md5
 * @returns 签名字符串（小写）
 *
 * @example
 *   generateSign({ amount: "9.9", order_no: "WN20260512...", type: "wechat" }, "abc123")
 *   → "d41d8cd98f00b204e9800998ecf8427e"
 */
export function generateSign(
  params: Record<string, string | number>,
  apiKey: string,
  signType: "md5" | "sha256" = "md5"
): string {
  // 1. 排除 sign, sign_type, api_key 字段
  const signParams: Record<string, string> = {};
  for (const key of Object.keys(params).sort()) {
    if (key === "sign" || key === "sign_type" || key === "api_key") continue;
    const val = params[key];
    if (val !== undefined && val !== null && val !== "") {
      signParams[key] = String(val);
    }
  }

  // 2. 拼接 "key1=val1&key2=val2" + "&key=" + apiKey
  const raw = Object.entries(signParams)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  // 部分平台可能不用 "&key=" 格式，这里同时支持两种
  // 默认格式: param1=val1&param2=val2{{apiKey}}
  const signStr = raw + apiKey;

  // 3. 计算哈希
  if (signType === "sha256") {
    return crypto.createHash("sha256").update(signStr, "utf8").digest("hex").toLowerCase();
  }
  return crypto.createHash("md5").update(signStr, "utf8").digest("hex").toLowerCase();
}

/**
 * 验证支付回调签名
 * @param params  - 回调参数（包含 sign 字段）
 * @param apiKey  - 商户 API 密钥
 * @param signType - 签名方式
 * @returns true 表示签名有效
 */
export function verifySign(
  params: Record<string, string>,
  apiKey: string,
  signType: "md5" | "sha256" = "md5"
): boolean {
  const receivedSign = params.sign;
  if (!receivedSign) return false;

  // 从回调参数中提取 sign，然后用其余参数重新生成签名比较
  const signParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (key === "sign" || key === "sign_type" || key === "api_key") continue;
    if (value !== undefined && value !== null && value !== "") {
      signParams[key] = value;
    }
  }

  // 按键排序后拼接
  const sortedKeys = Object.keys(signParams).sort();
  const raw = sortedKeys.map((k) => `${k}=${signParams[k]}`).join("&");
  const signStr = raw + apiKey;

  let computedSign: string;
  if (signType === "sha256") {
    computedSign = crypto.createHash("sha256").update(signStr, "utf8").digest("hex");
  } else {
    computedSign = crypto.createHash("md5").update(signStr, "utf8").digest("hex");
  }

  // 大小写不敏感比较（部分平台返回大写）
  return computedSign.toLowerCase() === receivedSign.toLowerCase();
}

/**
 * 生成唯一订单号
 * 格式: WN + 日期时间 + 6位随机数
 *
 * @example "WN20260512083015a3b7c2"
 */
export function generateOrderNo(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const timestamp =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const random = crypto.randomBytes(3).toString("hex"); // 6 位 hex
  return `WN${timestamp}${random}`;
}