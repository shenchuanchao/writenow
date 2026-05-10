// AI 提供商抽象层 - OpenAI 兼容接口（智谱/DeepSeek/通义千问等）
// 环境变量：OPENAI_API_KEY / OPENAI_BASE_URL / OPENAI_MODEL

interface ProviderConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

// ========== 配置校验 ==========

function getProviderConfig(): ProviderConfig {
  const apiKey = process.env.OPENAI_API_KEY || "";
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    throw new Error("AI API 密钥未配置，请在 .env.local 中设置 OPENAI_API_KEY");
  }

  return { apiKey, baseUrl, model };
}

// ========== 带超时 & 重试的请求 ==========

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

async function chat(
  messages: ChatMessage[],
  config: ProviderConfig,
  retries = 2
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s 超时

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          temperature: 0.8,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        const status = response.status;

        // 不重试的错误
        if (status === 401 || status === 403) {
          throw new Error("AI API 认证失败，请检查 API 密钥是否正确");
        }
        if (status === 429 && attempt < retries) {
          // 限流 — 等 2 秒后重试
          await new Promise((r) => setTimeout(r, 2000));
          lastError = new Error("AI 服务繁忙，正在重试...");
          continue;
        }

        throw new Error(`AI 服务返回错误 (${status}): ${errText.slice(0, 200)}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      if (!content) {
        throw new Error("AI 返回内容为空，请重试");
      }

      return content;
    } catch (e) {
      clearTimeout(timeoutId);
      lastError = e instanceof Error ? e : new Error(String(e));

      if (lastError.message.includes("aborted")) {
        throw new Error("AI 响应超时（30秒），请稍后重试");
      }

      if (attempt < retries && !lastError.message.includes("认证失败")) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new Error("AI 调用失败");
}

// ========== 公开接口 ==========

export async function generateAIResponse(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const config = getProviderConfig();

  return chat(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    config
  );
}