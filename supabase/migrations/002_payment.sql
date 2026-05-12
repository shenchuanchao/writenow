-- ============================================================
-- 002_payment.sql
-- 支付订单表 + 点数流水表
-- 免签支付通用适配
-- ============================================================

-- ============================================================
-- 1. payment_orders 支付订单表
-- ============================================================
create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_no text not null unique,
  package_id text not null,
  credits integer not null check (credits > 0),
  amount numeric(10,2) not null check (amount > 0),
  status text not null default 'pending'
    check (status in ('pending','paid','failed','expired')),
  payment_method text check (payment_method in ('wechat','alipay')),
  pay_url text,
  transaction_id text,
  raw_callback jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payment_orders enable row level security;

-- 用户只能看自己的订单
drop policy if exists "Users can view own payment_orders" on public.payment_orders;
create policy "Users can view own payment orders"
  on public.payment_orders
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 用户可以创建自己的订单
drop policy if exists "Users can insert own payment orders" on public.payment_orders;
create policy "Users can insert own payment orders"
  on public.payment_orders
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================================
-- 2. points_log 点数流水表（替代 credit_transactions）
--    记录每一笔点数变动明细
-- ============================================================
create table if not exists public.points_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null
    check (type in ('recharge','consume','refund','gift')),
  amount integer not null,
  balance_after integer not null,
  order_no text,
  note text,
  created_at timestamptz not null default now()
);

alter table public.points_log enable row level security;

-- 用户只能看自己的流水
drop policy if exists "Users can view own points_log" on public.points_log;
create policy "Users can view own points_log"
  on public.points_log
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 允许写入流水（add_credits 函数已 SECURITY DEFINER，但直接 insert 也需此策略）
drop policy if exists "Users can insert own points_log" on public.points_log;
create policy "Users can insert own points_log"
  on public.points_log
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================================
-- 3. 自动更新 updated_at 的 trigger
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists handle_payment_orders_updated_at
  on public.payment_orders;
create trigger handle_payment_orders_updated_at
  before update on public.payment_orders
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- 4. 原子化：给指定用户增加点数 + 写入 points_log
--    在数据库端完成，避免并发问题
-- ============================================================
create or replace function public.add_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_order_no text default null,
  p_note text default null
)
returns integer -- 返回变动后的余额
language plpgsql
security definer
as $$
declare
  v_balance integer;
begin
  -- 原子更新 profiles.credits
  update public.profiles
    set credits = credits + p_amount,
        updated_at = now()
    where id = p_user_id
    returning credits into v_balance;

  if not found then
    raise exception 'user % not found', p_user_id;
  end if;

  -- 写入流水
  insert into public.points_log (user_id, type, amount, balance_after, order_no, note)
  values (p_user_id, p_type, p_amount, v_balance, p_order_no, p_note);

  return v_balance;
end;
$$;

grant execute on function public.add_credits(uuid, integer, text, text, text)
  to authenticated, service_role;

-- ============================================================
-- 5. 索引
-- ============================================================
create index if not exists idx_payment_orders_user_id
  on public.payment_orders(user_id);
create index if not exists idx_payment_orders_order_no
  on public.payment_orders(order_no);
create index if not exists idx_payment_orders_status
  on public.payment_orders(status);
create index if not exists idx_points_log_user_id
  on public.points_log(user_id);
create index if not exists idx_points_log_created_at
  on public.points_log(created_at desc);
