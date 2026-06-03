-- ============================================================
-- 006_rate_limits.sql
-- 游客速率限制表（防止滥用）
-- ============================================================

-- 1. rate_limits 速率限制表
-- ============================================================
create table if not exists public.rate_limits (
  id bigserial primary key,
  device_id text not null,
  hour_bucket text not null,  -- e.g. "2026-06-03T15"
  count integer not null default 0 check (count >= 0),
  last_ip text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(device_id, hour_bucket)
);

-- RLS：允许所有人读写自己的速率记录（按 device_id 区分）
alter table public.rate_limits enable row level security;

drop policy if exists "Anon can manage rate limits" on public.rate_limits;
create policy "Anon can manage rate limits"
  on public.rate_limits
  for all
  to anon
  using (true)
  with check (true);

-- 2. 索引
-- ============================================================
create index if not exists idx_rate_limits_device_hour
  on public.rate_limits(device_id, hour_bucket);

-- 3. 自动更新 updated_at
-- ============================================================
create or replace function public.handle_rate_limits_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists handle_rate_limits_updated_at on public.rate_limits;
create trigger handle_rate_limits_updated_at
  before update on public.rate_limits
  for each row
  execute function public.handle_rate_limits_updated_at();

-- 4. Supabase Data API 显式授权（2026-10-30 强制要求）
-- ============================================================
grant select, insert, update on public.rate_limits to anon;
grant select, insert, update, delete on public.rate_limits to authenticated, service_role;
