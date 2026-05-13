-- ============================================================
-- 003_feedback.sql
-- 用户反馈建议表
-- ============================================================

-- 1. feedbacks 反馈表
-- ============================================================
create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('bug','feature','other')),
  content text not null,
  contact text,
  status text not null default 'pending'
    check (status in ('pending','resolved')),
  created_at timestamptz not null default now()
);

alter table public.feedbacks enable row level security;

-- 所有人可以提交反馈（无需登录）
drop policy if exists "Anyone can insert feedbacks" on public.feedbacks;
create policy "Anyone can insert feedbacks"
  on public.feedbacks
  for insert
  to authenticated, anon
  with check (true);

-- 已登录用户只能看自己的反馈，管理看全部（暂时开放给所有人查自己的）
drop policy if exists "Users can view own feedbacks" on public.feedbacks;
create policy "Users can view own feedbacks"
  on public.feedbacks
  for select
  using (auth.uid() = user_id or auth.uid() is null);

-- 2. 索引
-- ============================================================
create index if not exists idx_feedbacks_user_id
  on public.feedbacks(user_id);
create index if not exists idx_feedbacks_status
  on public.feedbacks(status);
create index if not exists idx_feedbacks_created_at
  on public.feedbacks(created_at desc);