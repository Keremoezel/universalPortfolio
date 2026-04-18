-- ============================================================
-- PORTFOLIO SAAS — DATABASE SCHEMA
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- 1. User profiles (mirrors auth.users, adds role + allow flag)
create table if not exists public.users (
  id         uuid references auth.users(id) on delete cascade primary key,
  email      text not null,
  role       text not null default 'user' check (role in ('admin', 'user')),
  is_allowed boolean not null default false,
  created_at timestamptz default now()
);

-- 2. Portfolio sites — one per user
create table if not exists public.sites (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.users(id) on delete cascade not null unique,
  username   text unique not null,
  theme      jsonb not null default '{}',
  content    jsonb not null default '{}',
  components jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists sites_username_idx on public.sites (username);
create index if not exists sites_user_id_idx  on public.sites (user_id);

-- 3. Invite tokens — admin-issued, single-use
create table if not exists public.invites (
  id         uuid default gen_random_uuid() primary key,
  token      text unique not null,
  email      text,
  used       boolean not null default false,
  created_by uuid references public.users(id),
  created_at timestamptz default now(),
  used_at    timestamptz
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create public.users row when Supabase Auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-stamp updated_at on sites
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_sites_updated on public.sites;
create trigger on_sites_updated
  before update on public.sites
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users   enable row level security;
alter table public.sites   enable row level security;
alter table public.invites enable row level security;

-- users: read own profile
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

-- users: admin reads all profiles
create policy "users_select_admin"
  on public.users for select
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- users: update own profile
create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id);

-- sites: anyone can read (public portfolios)
create policy "sites_public_read"
  on public.sites for select
  using (true);

-- sites: owner can insert/update/delete their own site
create policy "sites_owner_insert"
  on public.sites for insert
  with check (auth.uid() = user_id);

create policy "sites_owner_update"
  on public.sites for update
  using (auth.uid() = user_id);

create policy "sites_owner_delete"
  on public.sites for delete
  using (auth.uid() = user_id);

-- invites: anyone can read (token validation on signup)
create policy "invites_public_read"
  on public.invites for select
  using (true);

-- invites: only admin can create/update
create policy "invites_admin_insert"
  on public.invites for insert
  with check (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

create policy "invites_admin_update"
  on public.invites for update
  using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );

-- ============================================================
-- FIRST-TIME ADMIN SETUP
-- After you create your account via /signup or Supabase Auth,
-- run this to promote yourself to admin:
--
--   update public.users
--   set role = 'admin', is_allowed = true
--   where email = 'your-email@example.com';
-- ============================================================
