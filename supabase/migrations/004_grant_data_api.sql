-- ============================================================
-- 004_grant_data_api.sql
-- Supabase Data API 显式授权（应对 2026-10-30 安全变更）
-- ============================================================
-- 背景：从 2026-10-30 起，Supabase 强制要求 public schema 表
-- 必须显式 GRANT 才能通过 Data API（supabase-js/PostgREST/GraphQL）访问
-- https://supabase.com/docs/guides/database/data-api-grants

-- ============================================================
-- 1. profiles — 用户资料
-- ============================================================
grant select on public.profiles to anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

-- ============================================================
-- 2. credit_transactions — 点数变动流水
-- ============================================================
grant select, insert on public.credit_transactions to authenticated;
grant select, insert, update, delete on public.credit_transactions to service_role;

-- ============================================================
-- 3. generation_history — 生成历史
-- ============================================================
grant select, insert on public.generation_history to authenticated;
grant select, insert, update, delete on public.generation_history to service_role;

-- ============================================================
-- 4. payment_orders — 支付订单
-- ============================================================
grant select, insert on public.payment_orders to authenticated;
grant select, insert, update, delete on public.payment_orders to service_role;

-- ============================================================
-- 5. points_log — 点数流水
-- ============================================================
grant select, insert on public.points_log to authenticated;
grant select, insert, update, delete on public.points_log to service_role;

-- ============================================================
-- 6. feedbacks — 用户反馈
-- ============================================================
grant select, insert on public.feedbacks to anon;
grant select, insert on public.feedbacks to authenticated;
grant select, insert, update, delete on public.feedbacks to service_role;

-- ============================================================
-- 7. 函数授权（已有，此处记录以防重建需要）
-- ============================================================
-- deduct_credits: 由服务端 API 调用，无需给 anon/authenticated
-- add_credits: 已在 002_payment.sql 中授权

-- ============================================================
-- 8. 枚举类型授权
-- ============================================================
grant usage on type public.tool_type to anon, authenticated, service_role;
grant usage on type public.transaction_type to anon, authenticated, service_role;