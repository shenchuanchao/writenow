import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "注册 WriteNow - 免费使用AI文案工具" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="sr-only">注册 WriteNow</h1>
      <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">创建账户</CardTitle>
        <CardDescription>免费注册，立刻开始使用AI文案工具</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
    </>
  );
}
