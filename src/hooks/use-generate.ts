"use client";

import { useState, useCallback } from "react";
import type { ToolType } from "@/types";

interface UseGenerateReturn {
  result: string | null;
  loading: boolean;
  error: string | null;
  creditsRemaining: number | null;
  guestUnlimited: boolean;
  generate: (toolType: ToolType, prompt: string, params?: Record<string, unknown>, deviceId?: string) => Promise<void>;
  reset: () => void;
}

export function useGenerate(): UseGenerateReturn {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [guestUnlimited, setGuestUnlimited] = useState(false);

  const generate = useCallback(
    async (toolType: ToolType, prompt: string, params?: Record<string, unknown>, deviceId?: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (deviceId) {
          headers["x-device-id"] = deviceId;
        }

        const res = await fetch("/api/generate", {
          method: "POST",
          headers,
          body: JSON.stringify({ tool_type: toolType, prompt, params }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || `请求失败 (${res.status})`);
        }

        setResult(json.data.result);
        setCreditsRemaining(json.data.credits_remaining ?? null);
        setGuestUnlimited(json.data.guest_unlimited === true);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "生成失败，请重试";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { result, loading, error, creditsRemaining, guestUnlimited, generate, reset };
}