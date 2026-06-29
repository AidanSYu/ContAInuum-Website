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
