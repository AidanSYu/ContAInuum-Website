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
