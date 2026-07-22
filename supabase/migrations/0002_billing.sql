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
   '["1 active ASILIA project","Up to 100 agent runs / mo","Community support","Standard compute pool"]'::jsonb),
  ('pro', 'Pro',
   'For teams running ASILIA in production.',
   24900, 'usd', 'month', 14, 2,
   '["10 active ASILIA projects","Up to 5,000 agent runs / mo","Priority support","Priority compute pool","Run history & exports"]'::jsonb),
  ('enterprise', 'Enterprise',
   'Dedicated capacity, SSO, and a named success engineer.',
   0, 'usd', 'month', 14, 3,
   '["Unlimited ASILIA projects","Unlimited agent runs","Dedicated compute","SSO / SAML","SLA & named engineer"]'::jsonb)
on conflict (id) do nothing;
