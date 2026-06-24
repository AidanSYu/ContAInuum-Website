-- =====================================================================
-- contAInuum — FULL provisioning bundle (migrations 0001 → 0004)
-- Paste this whole file into Supabase Studio → SQL Editor → Run.
-- Safe to re-run (idempotent).
-- =====================================================================

-- ##################### 0001_init.sql #####################
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


-- ##################### 0002_billing.sql #####################
-- ============================================================================
-- contAInuum — billing: plans, customers, subscriptions (Stripe-backed)
-- ----------------------------------------------------------------------------
-- Apply after 0001_init.sql:   supabase db push
-- Or paste into:               Supabase Studio → SQL Editor → Run
--
-- Security model
--   * Stripe is the source of truth for billing state. The `stripe-webhook`
--     Edge Function (service_role) is the ONLY writer of `subscriptions` and of
--     `profiles.stripe_customer_id`. The client never writes billing rows.
--   * `plans` is public, read-only catalog data (anyone can view pricing).
--   * `subscriptions` is owner-readable only (a user sees just their own).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: link each user to their Stripe customer (written by the webhook).
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists stripe_customer_id text unique;

-- ============================================================================
-- plans — public pricing catalog. Mirrors your Stripe Products/Prices.
-- `stripe_price_id` is what the checkout session is created against.
-- ============================================================================
create table if not exists public.plans (
  id              text primary key,            -- slug, e.g. 'starter', 'pro'
  name            text not null,
  description     text,
  stripe_price_id text unique,                 -- Stripe Price (recurring)
  amount_cents    integer not null default 0,  -- display price, in cents
  currency        text not null default 'usd',
  interval        text not null default 'month'
                    check (interval in ('month', 'year')),
  trial_days      integer not null default 14,
  features        jsonb not null default '[]'::jsonb,  -- string[] for the UI
  is_active       boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_plans_updated on public.plans;
create trigger trg_plans_updated
  before update on public.plans
  for each row execute function public.set_updated_at();

-- ============================================================================
-- subscriptions — one active billing record per user, synced from Stripe.
-- Status mirrors Stripe subscription statuses.
-- ============================================================================
create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null
                           references auth.users (id) on delete cascade,
  plan_id                text references public.plans (id),
  stripe_subscription_id text unique,
  stripe_customer_id     text,
  status                 text not null default 'incomplete'
                           check (status in (
                             'trialing', 'active', 'past_due', 'canceled',
                             'incomplete', 'incomplete_expired', 'unpaid', 'paused'
                           )),
  current_period_end     timestamptz,
  trial_end              timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create unique index if not exists idx_subscriptions_user
  on public.subscriptions (user_id);

drop trigger if exists trg_subscriptions_updated on public.subscriptions;
create trigger trg_subscriptions_updated
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.plans         enable row level security;
alter table public.subscriptions enable row level security;

-- plans: public read of the active catalog (no writes from the client).
drop policy if exists plans_select_public on public.plans;
create policy plans_select_public
  on public.plans for select to anon, authenticated
  using (is_active = true);

-- subscriptions: a user can read ONLY their own. No client writes — the
-- webhook (service_role) is the sole writer and bypasses RLS.
drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own
  on public.subscriptions for select to authenticated
  using (user_id = auth.uid());

-- ============================================================================
-- Seed the pricing catalog. Fill in real stripe_price_id values after creating
-- the Products/Prices in Stripe (or let the webhook/admin update them later).
-- ============================================================================
insert into public.plans
  (id, name, description, amount_cents, currency, interval, trial_days, sort_order, features)
values
  ('starter', 'Starter',
   'For individuals exploring autonomous research workflows.',
   4900, 'usd', 'month', 14, 1,
   '["1 active ATLAS project","Up to 100 agent runs / mo","Community support","Standard compute pool"]'::jsonb),
  ('pro', 'Pro',
   'For teams running ATLAS in production.',
   24900, 'usd', 'month', 14, 2,
   '["10 active ATLAS projects","Up to 5,000 agent runs / mo","Priority support","Priority compute pool","Run history & exports"]'::jsonb),
  ('enterprise', 'Enterprise',
   'Dedicated capacity, SSO, and a named success engineer.',
   0, 'usd', 'month', 14, 3,
   '["Unlimited ATLAS projects","Unlimited agent runs","Dedicated compute","SSO / SAML","SLA & named engineer"]'::jsonb)
on conflict (id) do nothing;


-- ##################### 0003_pricing_realign.sql #####################
-- ============================================================================
-- contAInuum — pricing realignment: generic SaaS plans → lab-retrofit plans
-- ----------------------------------------------------------------------------
-- Apply after 0002_billing.sql:  supabase db push
-- Or paste into:                 Supabase Studio → SQL Editor → Run
--
-- Why
--   The 0002 seed shipped generic plans (Starter / Pro / Enterprise) with
--   "agent runs / compute pool" copy that predates the lab-retrofit
--   positioning. The marketing site advertises Solo / Lab / Institute with
--   campaign-based copy. The `plans` table is the single source of truth for
--   BOTH the marketing pricing page and the in-app billing page, so the two
--   surfaces drifted: a visitor was quoted one catalog and billed against
--   another.
--
--   This migration makes the catalog match the brand. It is non-destructive:
--   the old rows are deactivated (kept for FK integrity with any existing
--   `subscriptions.plan_id`), and the new rows are upserted.
--
-- After applying
--   * Create the matching Products/Prices in Stripe, then set each plan's
--     `stripe_price_id` (UPDATE statements at the bottom, or via Studio).
--   * Until `stripe_price_id` is set, checkout returns "not purchasable yet"
--     for that plan by design (see create-checkout-session).
-- ============================================================================

-- 1. Retire the old generic catalog (kept inactive, not deleted).
update public.plans
   set is_active = false
 where id in ('starter', 'pro', 'enterprise');

-- 2. Upsert the lab-retrofit catalog. Prices are display values in cents;
--    Stripe remains the source of truth for what is actually charged.
insert into public.plans
  (id, name, description, amount_cents, currency, interval, trial_days, sort_order, is_active, features)
values
  ('solo', 'Solo',
   'For a single scientist retrofitting one bench.',
   5900, 'usd', 'month', 14, 1, true,
   '["1 active campaign","Cross-campaign memory","Human handoff via email","Recipe & failure-mode library","Community support"]'::jsonb),
  ('lab', 'Lab',
   'For a group running ATLAS across the bench.',
   32900, 'usd', 'month', 14, 2, true,
   '["10 active campaigns","Shared knowledge graph & lab lore","Slack / mobile handoff","Drift detection & alerts","Run history, lineage & exports","Priority support"]'::jsonb),
  ('institute', 'Institute',
   'Multi-lab deployments with governance.',
   0, 'usd', 'month', 14, 3, true,
   '["Unlimited campaigns & seats","Federated learning (early access)","SSO / SAML & audit log","Dedicated compute","SLA & named success engineer"]'::jsonb)
on conflict (id) do update
  set name         = excluded.name,
      description  = excluded.description,
      amount_cents = excluded.amount_cents,
      currency     = excluded.currency,
      interval     = excluded.interval,
      trial_days   = excluded.trial_days,
      sort_order   = excluded.sort_order,
      is_active    = excluded.is_active,
      features     = excluded.features;

-- 3. After creating the Stripe Prices, wire them up (example — fill real ids):
--   update public.plans set stripe_price_id = 'price_xxx' where id = 'solo';
--   update public.plans set stripe_price_id = 'price_yyy' where id = 'lab';
--   -- 'institute' is sales-led (Custom): leave stripe_price_id null.


-- ##################### 0004_trial_reminded.sql #####################
-- ============================================================================
-- contAInuum — trial reminder bookkeeping
-- ----------------------------------------------------------------------------
-- Adds a marker so the `trial-reminders` Edge Function can send each user a
-- single "your trial ends soon" email instead of one on every run.
-- Apply with:  supabase db push
-- ============================================================================

alter table public.subscriptions
  add column if not exists trial_reminded_at timestamptz;


