-- supabase/setup.sql
-- 在 Supabase 后台：左侧 SQL Editor → New query → 整段粘贴 → Run。可以重复运行。
--
-- 设计：数据都放在一张表里，但这张表对网页「完全关闭」（开了行级安全、又不给任何策略），
-- 网页只能通过下面两个函数读写，而且必须带上一个 ≥16 位的随机房间码。
-- 不知道房间码，就读不到、也猜不到任何人的数据，没办法 select * 把整张表拉走。

create table if not exists public.kv (
  room       text        not null,
  k          text        not null,
  v          jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (room, k)
);

alter table public.kv enable row level security;
-- 故意不建任何 policy：anon / authenticated 角色直接访问这张表一律被拒。
revoke all on table public.kv from anon, authenticated;

create or replace function public.kv_get(p_room text, p_key text)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select v from public.kv
  where room = p_room and k = p_key and length(p_room) >= 16
$$;

create or replace function public.kv_set(p_room text, p_key text, p_val jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if length(p_room) < 16 then
    raise exception 'room too short';
  end if;
  if length(p_key) > 200 then
    raise exception 'key too long';
  end if;
  if pg_column_size(p_val) > 300000 then      -- 单条上限约 300KB，防止被灌满
    raise exception 'value too large';
  end if;
  insert into public.kv (room, k, v, updated_at)
  values (p_room, p_key, p_val, now())
  on conflict (room, k) do update set v = excluded.v, updated_at = now();
end;
$$;

revoke all on function public.kv_get(text, text)        from public;
revoke all on function public.kv_set(text, text, jsonb) from public;
grant execute on function public.kv_get(text, text)        to anon;
grant execute on function public.kv_set(text, text, jsonb) to anon;
