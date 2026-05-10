"use client";

import { useState, useCallback } from "react";
import { useAuth } from "./use-auth";

export function useCredits() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const recharge = useCallback(async (packageId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/credits/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: packageId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "充值失败");
      await refreshProfile();
      return data;
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  return {
    credits: profile?.credits ?? 0,
    loading,
    recharge,
    refresh: refreshProfile,
  };
}
