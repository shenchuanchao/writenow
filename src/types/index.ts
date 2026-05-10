// ========== 数据库类型 ==========

export type ToolType = "video_script" | "xiaohongshu" | "ecommerce" | "moments";
export type TransactionType = "earn" | "spend" | "admin_grant" | "refund";

export interface Profile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: number;
  user_id: string;
  type: TransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface GenerationRecord {
  id: number;
  user_id: string;
  tool_type: ToolType;
  prompt: string;
  result: string;
  params: Record<string, unknown>;
  created_at: string;
}

// ========== API 请求/响应 ==========

export interface GenerateRequest {
  tool_type: ToolType;
  prompt: string;
  params?: Record<string, unknown>;
}

export interface GenerateResponse {
  result: string;
  credits_remaining: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// ========== 前台 ==========

export interface ToolConfig {
  type: ToolType;
  title: string;
  description: string;
  icon: string;
  color: string;
  placeholder: string;
  formFields: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
}
