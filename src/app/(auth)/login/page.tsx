import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "登录 WriteNow - AI文案工具" };

export default function LoginPage() {
  return (
    <>
      <h1 className="sr-only">登录 WriteNow</h1>
      <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">欢迎回来</CardTitle>
        <CardDescription>登录你的账户继续使用</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
    </>
  );
}
