"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, nickname: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, profile: null, loading: true });
  const supabase = useMemo(() => createClient(), []);
  const mountedRef = useRef(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setState((prev) => ({ ...prev, profile: data as Profile }));
  }, []);

  const refreshProfile = useCallback(async () => {
    if (state.user) await fetchProfile(state.user.id);
  }, [state.user, fetchProfile]);

  useEffect(() => {
    mountedRef.current = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mountedRef.current) return;
      const user = session?.user ?? null;
      setState((prev) => ({ ...prev, user, loading: false }));
      if (user) fetchProfile(user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mountedRef.current) return;
      const user = session?.user ?? null;
      setState((prev) => ({ ...prev, user }));
      if (user) fetchProfile(user.id);
      else setState((prev) => ({ ...prev, profile: null }));
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUp = async (email: string, password: string, nickname: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });
    return error ? { error: error.message } : {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, profile: null, loading: false });
    // 整页刷新跳转，确保 httpOnly cookie 在微信等浏览器中正确清除
    window.location.href = "/login";
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { ...state, signIn, signUp, signOut, refreshProfile } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}