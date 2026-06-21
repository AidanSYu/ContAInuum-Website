-- ============================================================================
-- contAInuum — initial schema, triggers, and Row Level Security
-- ----------------------------------------------------------------------------
-- Apply with the Supabase CLI:   supabase db push
-- Or paste this whole file into:  Supabase Studio → SQL Editor → Run
--
-- Security model
--   * RLS is enabled on every table. Enabling RLS WITHOUT a matching policy
--     denies ALL client access — this is the safe default.
--   * `profiles` and `projects` get owner-scoped policies (a user only ever
--     touches their own rows, enforced by the database, not the frontend).
--   * `contact_messages` and `subscribers` get NO client policies on purpose:
--     they are written ONLY by Edge Functions using the service_role key
--     (which bypasses RLS). Read them from the dashboard or an admin function.
-- ============================================================================

create extension if not exists pgcrypto;  -- provides gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Helper: keep updated_at fresh on every UPDATE
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- profiles — app data for each authenticated user (1:1 with auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- contact_messages — public contact form (write-only via Edge Function)
-- ============================================================================
create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 1 and 200),
  email         text not null check (char_length(email) between 3 and 320),
  organization  text check (char_length(organization) <= 200),
  message       text not null check (char_length(message) between 1 and 5000),
  ip_hash       text,                       -- hashed, never the raw IP
  created_at    timestamptz not null default now()
);
create index if not exists idx_contact_created
  on public.contact_messages (created_at desc);

-- ============================================================================
-- subscribers — newsletter / waitlist with double opt-in
-- ============================================================================
create table if not exists public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique check (char_length(email) between 3 and 320),
  status        text not null default 'pending'
                  check (status in ('pending', 'confirmed', 'unsubscribed')),
  confirm_token uuid not null default gen_random_uuid(),
  source        text,
  created_at    timestamptz not null default now(),
  confirmed_at  timestamptz
);

-- ============================================================================
-- projects — example owned, authenticated app data (CRUD)
-- Replace/extend with your real domain tables; the pattern is what matters:
--   user_id defaults to auth.uid() so the DB stamps ownership; the client
--   cannot forge it, and RLS guarantees a user only sees their own rows.
-- ============================================================================
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
                references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_projects_user on public.projects (user_id);

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles         enable row level security;
alter table public.contact_messages enable row level security;
alter table public.subscribers      enable row level security;
alter table public.projects         enable row level security;

-- profiles: read & update only your own row (insert handled by trigger).
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select to authenticated
  using (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- projects: full CRUD, always scoped to the owner.
drop policy if exists projects_select_own on public.projects;
create policy projects_select_own
  on public.projects for select to authenticated
  using (user_id = auth.uid());

drop policy if exists projects_insert_own on public.projects;
create policy projects_insert_own
  on public.projects for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists projects_update_own on public.projects;
create policy projects_update_own
  on public.projects for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists projects_delete_own on public.projects;
create policy projects_delete_own
  on public.projects for delete to authenticated
  using (user_id = auth.uid());

-- contact_messages & subscribers: intentionally NO client policies.
-- They are accessed only by Edge Functions (service_role) or the dashboard.
