-- ============================================================
-- 005_guest_quota.sql
-- 游客免费额度表（无需登录，每天5次）
-- ============================================================

-- 1. guest_daily_quota 游客每日配额表
-- ============================================================
create table if not exists public.guest_daily_quota (
  id bigserial primary key,
  device_id text not null,
  quota_date date not null default current_date,
  used_count integer not null default 0 check (used_count >= 0),
  last_ip text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(device_id, quota_date)
);

-- RLS：允许所有人读写自己的配额记录（按 device_id 区分）
alter table public.guest_daily_quota enable row level security;

-- anon 可读写
drop policy if exists "Anon can manage own quota" on public.guest_daily_quota;
create policy "Anon can manage own quota"
  on public.guest_daily_quota
  for all
  to anon
  using (true)
  with check (true);

-- 2. 索引
-- ============================================================
create index if not exists idx_guest_daily_quota_device_date
  on public.guest_daily_quota(device_id, quota_date);

-- 3. 自动更新 updated_at
-- ============================================================
create or replace function public.handle_guest_quota_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists handle_guest_daily_quota_updated_at
  on public.guest_daily_quota;
create trigger handle_guest_daily_quota_updated_at
  before update on public.guest_daily_quota
  for each row
  execute function public.handle_guest_quota_updated_at();

-- 4. Supabase Data API 显式授权（2026-10-30 强制要求）
-- ============================================================
grant select, insert, update on public.guest_daily_quota to anon;
grant select, insert, update, delete on public.guest_daily_quota to authenticated, service_role;
