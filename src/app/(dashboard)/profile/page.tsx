"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCredits } from "@/hooks/use-credits";
import { formatDate } from "@/lib/utils";
import { User, Mail, Calendar, Coins, Edit2, Save } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const { credits } = useCredits();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (profile?.nickname) {
      setNickname(profile.nickname);
    }
  }, [profile?.nickname]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        加载中...
      </div>
    );
  }

  if (!profile) return null;

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });
    await refreshProfile();
    setEditing(false);
    setSaving(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>个人信息</CardTitle>
            <CardDescription>管理你的账户信息</CardDescription>
          </div>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={() => { setNickname(profile.nickname || ""); setEditing(true); }}>
              <Edit2 className="h-4 w-4 mr-1" /> 编辑
            </Button>
          ) : (
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> 保存
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            {editing ? (
              <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="max-w-xs" />
            ) : (
              <span className="font-medium">{profile.nickname || "未设置"}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">注册于 {formatDate(profile.created_at)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            我的点数
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">{credits}</span>
            <p className="text-sm text-muted-foreground mt-1">剩余点数</p>
          </div>
          <Link href="/recharge">
            <Button className="w-full">充值点数</Button>
          </Link>
          <Link href="/history">
            <Button variant="outline" className="w-full">生成历史</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
