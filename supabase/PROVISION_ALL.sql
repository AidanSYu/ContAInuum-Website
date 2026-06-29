-- =====================================================================
-- contAInuum — FULL provisioning bundle (migrations 0001 → 0007)
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


-- ##################### 0005_security_hardening.sql #####################
-- ============================================================================
-- contAInuum — security hardening (Phase 0)
--   FIX 1: server-side entitlement gate on projects INSERT/UPDATE
--   FIX 2: block role self-escalation on profiles
-- Apply after 0004_trial_reminded.sql:  supabase db push
-- Idempotent: re-runnable (create or replace fn; drop policy if exists +
-- create; revoke is naturally idempotent).
-- ============================================================================

-- ============================================================================
-- FIX 1 — server-side entitlement gate for projects writes
-- ============================================================================

-- 1. Entitlement helper. SECURITY DEFINER so it can read subscriptions even
--    though the caller only has SELECT on their own row; STABLE because it
--    performs no writes and returns the same result within a statement.
--    The active set MUST mirror ACTIVE_STATUSES in src/lib/api/subscriptions.ts
--    exactly: ('trialing', 'active', 'past_due').
create or replace function public.has_active_subscription(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
      from public.subscriptions s
     where s.user_id = uid
       and s.status in ('trialing', 'active', 'past_due')
  );
$$;

-- Lock down EXECUTE: revoke from PUBLIC, grant only to the API roles.
revoke all on function public.has_active_subscription(uuid) from public;
grant execute on function public.has_active_subscription(uuid) to authenticated, service_role;

-- 2. Re-gate the projects WRITE policies. SELECT and DELETE stay ownership-only
--    (a lapsed user may still read and remove their own data). INSERT and UPDATE
--    additionally require an active subscription. Reuse the EXACT 0001 names.

-- INSERT: owner AND entitled.
drop policy if exists projects_insert_own on public.projects;
create policy projects_insert_own
  on public.projects for insert to authenticated
  with check (
    user_id = auth.uid()
    and public.has_active_subscription(auth.uid())
  );

-- UPDATE: owner AND entitled (both USING for the pre-image and WITH CHECK for
-- the post-image so a lapsed user can neither target nor produce a row).
drop policy if exists projects_update_own on public.projects;
create policy projects_update_own
  on public.projects for update to authenticated
  using (
    user_id = auth.uid()
    and public.has_active_subscription(auth.uid())
  )
  with check (
    user_id = auth.uid()
    and public.has_active_subscription(auth.uid())
  );

-- NOTE: projects_select_own and projects_delete_own are intentionally NOT
-- redefined here — they remain ownership-only from 0001_init.sql.

-- ============================================================================
-- FIX 2 — block role self-escalation on profiles
-- ----------------------------------------------------------------------------
-- Approach: column-level privilege. Supabase's default grant to the API roles
-- is a TABLE-level `GRANT ALL ON public.profiles TO authenticated, anon` (and
-- service_role). A column-level REVOKE UPDATE(role) carves `role` out of that
-- table-level UPDATE grant: any UPDATE statement that names the `role` column
-- is rejected at the privilege layer (error 42501), BEFORE RLS is evaluated,
-- for the authenticated and anon roles. service_role keeps full access (it is
-- the webhook/admin writer and bypasses RLS anyway).
--
-- Compatibility with profiles_update_own: that policy only constrains WHICH
-- rows may be updated (id = auth.uid()); it does not grant column privileges.
-- A normal PATCH that omits `role` (e.g. { full_name }) updates only granted
-- columns, so the table-level UPDATE grant still covers it and the policy still
-- passes — those patches keep working. Only statements that explicitly SET role
-- are refused. This is the documented, supported Supabase pattern and is
-- strictly more robust than a trigger for the "client cannot touch role" goal
-- because it cannot be bypassed by any RLS edge case.
-- ============================================================================

revoke update (role) on public.profiles from authenticated, anon;

-- Defense in depth: also ensure the column-level INSERT path can't seed an
-- elevated role from the client. handle_new_user (SECURITY DEFINER) inserts the
-- row with the default 'user'; the client never INSERTs profiles directly
-- (no insert policy exists), but revoke the column grant explicitly so a future
-- insert policy can't accidentally expose it.
revoke insert (role) on public.profiles from authenticated, anon;


-- ##################### 0006_webhook_hardening.sql #####################
-- ============================================================================
-- contAInuum — Stripe webhook hardening (idempotency + ordering)
-- ----------------------------------------------------------------------------
-- Apply after 0005_security_hardening.sql:  supabase db push
-- Or paste into:                            Supabase Studio → SQL Editor → Run
-- Idempotent: re-runnable (create table if not exists / add column if not
-- exists; revoke is naturally idempotent).
--
-- Why
--   Stripe delivers webhooks AT LEAST ONCE and NOT necessarily in order. The
--   `stripe-webhook` Edge Function is the single writer of `subscriptions`, so
--   it must:
--     1. De-duplicate retried deliveries (idempotency) — a `processed_stripe_events`
--        ledger keyed by Stripe's `event.id`. The function records each handled
--        event and short-circuits if it sees the id again.
--     2. Reject stale/out-of-order writes (ordering guard) — `subscriptions`
--        gains a `last_event_at` watermark (set to the applied event's
--        `event.created`). The function skips a write whose event is older than
--        the watermark already stored on the row.
--
--   Both tables/columns are written ONLY by the webhook using the service_role
--   key, which bypasses RLS. No client ever touches them.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- processed_stripe_events — idempotency ledger of handled Stripe event ids.
-- Written only by the webhook (service_role, bypasses RLS). RLS is enabled with
-- NO policies so every client role is denied by default.
-- ----------------------------------------------------------------------------
create table if not exists public.processed_stripe_events (
  event_id    text primary key,                 -- Stripe Event.id (evt_...)
  type        text,                             -- Stripe Event.type (for audit)
  created_at  timestamptz not null default now()
);

alter table public.processed_stripe_events enable row level security;

-- No client policies on purpose: only the service_role writes/reads this, and
-- it bypasses RLS. Revoke the default table grants from the API roles so the
-- ledger is never reachable from anon/authenticated even if a policy is later
-- added by mistake.
revoke all on public.processed_stripe_events from anon, authenticated;

-- ----------------------------------------------------------------------------
-- subscriptions.last_event_at — ordering watermark. Holds to_timestamp(event.created)
-- of the most recently APPLIED Stripe event for this row. Nullable: existing
-- rows (and rows touched before this column existed) start NULL, which the
-- webhook treats as "no watermark yet → always apply".
-- ----------------------------------------------------------------------------
alter table public.subscriptions
  add column if not exists last_event_at timestamptz;


-- ##################### 0007_escrow.sql #####################
-- ============================================================================
-- contAInuum — Phase 3: platform-held milestone escrow (deposit + refunds)
-- ----------------------------------------------------------------------------
-- Apply after 0006_webhook_hardening.sql:  supabase db push
-- Or paste into:                           Supabase Studio -> SQL Editor -> Run
-- Idempotent: re-runnable (create table if not exists / add column if not
-- exists / create or replace fn / drop policy if exists + create / revoke &
-- grant are naturally idempotent / create index if not exists).
--
-- Escrow model (single recipient = ContAInuum):
--   * Capture-now + refund-on-fail. The CUSTOMER funds the FULL agreement
--     amount up front via one Stripe Checkout (mode:'payment'); funds sit in
--     the platform Stripe balance. The ADMIN later RELEASES a milestone
--     (internal state change only -- funds already captured) or REFUNDS a
--     milestone (Stripe partial refund of that milestone's amount_cents).
--   * service_role (escrow edge functions + the stripe-webhook) is the SOLE
--     writer of all escrow financial state. Clients get SELECT only.
--   * Admin identity = profiles.role = 'admin' (role is REVOKE'd from clients
--     in 0005, so only service_role / the dashboard can grant it). The
--     is_admin(uid) SECURITY DEFINER helper below backs admin RLS and the
--     escrow-admin edge function's authorization check.
--
-- Amount invariant (enforced in APPLICATION code, not the DB):
--   For a given agreement, sum(escrow_milestones.amount_cents) MUST equal
--   escrow_agreements.total_amount_cents. The escrow-admin 'create_agreement'
--   action validates this server-side before insert. We deliberately do NOT
--   add a cross-row CHECK/trigger for it (keeps inserts simple and matches the
--   repo convention of app-enforced money math; see create-checkout-session).
-- ============================================================================

create extension if not exists pgcrypto;  -- gen_random_uuid(), no-op if present

-- ----------------------------------------------------------------------------
-- is_admin(uid) — SECURITY DEFINER STABLE admin check.
-- Reads profiles.role='admin'. SECURITY DEFINER so it can read any profile row
-- (callers only have SELECT on their own profile via 0001 RLS); STABLE because
-- it performs no writes. Safe search_path pins schema resolution. Mirrors the
-- has_active_subscription(uid) pattern from 0005_security_hardening.sql.
-- ----------------------------------------------------------------------------
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
      from public.profiles p
     where p.id = uid
       and p.role = 'admin'
  );
$$;

-- Lock down EXECUTE: revoke from PUBLIC, grant only to the API roles.
revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated, service_role;

-- ============================================================================
-- escrow_agreements — one funded deposit per sales-led engagement.
-- Written ONLY by service_role (escrow-admin creates; create-escrow-payment
-- stamps the checkout session id; the webhook stamps the payment_intent +
-- funded status). Clients get SELECT (own rows; admins via is_admin) only.
-- ============================================================================
create table if not exists public.escrow_agreements (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null
                              references auth.users (id) on delete cascade,
  title                     text not null check (char_length(title) between 1 and 200),
  description               text check (char_length(description) <= 5000),
  currency                  text not null default 'usd',
  total_amount_cents        integer not null check (total_amount_cents >= 0),
  -- draft   : created, milestones may still be edited, not yet payable
  -- pending : finalized + awaiting customer payment (fundable)
  -- funded  : customer paid; Stripe captured into platform balance
  -- completed: all milestones released and/or refunded (terminal)
  -- canceled: voided before funding (terminal)
  status                    text not null default 'draft'
                              check (status in (
                                'draft', 'pending', 'funded', 'completed', 'canceled'
                              )),
  stripe_payment_intent_id  text,
  stripe_checkout_session_id text,
  created_by                uuid references auth.users (id) on delete set null,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index if not exists idx_escrow_agreements_user
  on public.escrow_agreements (user_id);
create index if not exists idx_escrow_agreements_status
  on public.escrow_agreements (status);

drop trigger if exists trg_escrow_agreements_updated on public.escrow_agreements;
create trigger trg_escrow_agreements_updated
  before update on public.escrow_agreements
  for each row execute function public.set_updated_at();

-- ============================================================================
-- escrow_milestones — line items of an agreement. Sum of amount_cents equals
-- the agreement total (app-enforced). Each milestone is independently RELEASED
-- (internal) or REFUNDED (Stripe partial refund). Written ONLY by service_role.
-- ============================================================================
create table if not exists public.escrow_milestones (
  id              uuid primary key default gen_random_uuid(),
  agreement_id    uuid not null
                    references public.escrow_agreements (id) on delete cascade,
  title           text not null check (char_length(title) between 1 and 200),
  amount_cents    integer not null check (amount_cents >= 0),
  -- pending  : agreement created but not yet funded
  -- funded   : customer paid; this milestone's money is held on platform
  -- released : admin marked work delivered (internal; funds kept, no refund)
  -- refunded : admin issued a Stripe partial refund of amount_cents (terminal)
  status          text not null default 'pending'
                    check (status in ('pending', 'funded', 'released', 'refunded')),
  sort_order      integer not null default 0,
  released_at     timestamptz,
  refunded_at     timestamptz,
  stripe_refund_id text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_escrow_milestones_agreement
  on public.escrow_milestones (agreement_id);
create index if not exists idx_escrow_milestones_status
  on public.escrow_milestones (status);

-- ============================================================================
-- Row Level Security
--   * Customers SELECT their own agreements + milestones.
--   * Admins (is_admin) SELECT ALL agreements + milestones.
--   * NO client INSERT/UPDATE/DELETE policies anywhere -- every write goes
--     through a service_role edge function or the webhook (both bypass RLS).
-- ============================================================================
alter table public.escrow_agreements enable row level security;
alter table public.escrow_milestones enable row level security;

-- escrow_agreements: owner OR admin may read.
drop policy if exists escrow_agreements_select_own on public.escrow_agreements;
create policy escrow_agreements_select_own
  on public.escrow_agreements for select to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- escrow_milestones: readable when the caller can read the parent agreement
-- (own agreement OR admin). Subquery scopes to the parent's owner.
drop policy if exists escrow_milestones_select_own on public.escrow_milestones;
create policy escrow_milestones_select_own
  on public.escrow_milestones for select to authenticated
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1
        from public.escrow_agreements a
       where a.id = escrow_milestones.agreement_id
         and a.user_id = auth.uid()
    )
  );

-- No INSERT/UPDATE/DELETE policies on purpose: service_role is the sole writer.

-- ##################### 0008_past_due_grace.sql #####################
-- ============================================================================
-- Bounded past_due grace window. Until now a `past_due` subscription kept FULL
-- access indefinitely; this bounds it to PAST_DUE_GRACE_DAYS (7) after the
-- unpaid period lapsed. Access-denial only — Stripe's own dunning stays
-- authoritative; we never cancel the subscription here. The 7-day bound MUST
-- mirror PAST_DUE_GRACE_DAYS in src/lib/api/subscriptions.ts.
-- Idempotent: add column if not exists / create or replace function / a
-- one-shot backfill that only touches rows still missing the timestamp.
-- ============================================================================

-- Track WHEN a subscription entered past_due (the grace anchor). The webhook
-- stamps this on the transition into past_due and clears it on the way out.
alter table public.subscriptions
  add column if not exists past_due_since timestamptz;

-- Backfill existing past_due rows so the new bound has an anchor to measure
-- from. current_period_end is the moment the paid period lapsed; fall back to
-- now() if it's unknown.
update public.subscriptions
   set past_due_since = coalesce(current_period_end, now())
 where status = 'past_due'
   and past_due_since is null;

-- Re-gate the entitlement helper with the bounded past_due window. trialing and
-- active are unchanged; past_due passes only while inside the window (or while
-- its anchor is unknown — don't lock a user out for missing data).
create or replace function public.has_active_subscription(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
      from public.subscriptions s
     where s.user_id = uid
       and (
            s.status in ('trialing', 'active')
         or (
              s.status = 'past_due'
              and (
                   coalesce(s.past_due_since, s.current_period_end) is null
                or coalesce(s.past_due_since, s.current_period_end) > now() - interval '7 days'
              )
            )
       )
  );
$$;

revoke all on function public.has_active_subscription(uuid) from public;
grant execute on function public.has_active_subscription(uuid) to authenticated, service_role;

