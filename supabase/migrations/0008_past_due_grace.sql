-- ============================================================================
-- contAInuum — bounded past_due grace window
-- ----------------------------------------------------------------------------
-- Until now a `past_due` subscription kept FULL access indefinitely (both the
-- client gate in src/lib/api/subscriptions.ts and the RLS gate
-- has_active_subscription() treated past_due like active). This bounds it: a
-- failed-payment subscription keeps access only for PAST_DUE_GRACE_DAYS after
-- the unpaid period lapsed, then the gate denies it.
--
-- Access-denial only: we DO NOT cancel the Stripe subscription here. Stripe's
-- own dunning remains authoritative and will move the row to canceled/unpaid in
-- its own time; we simply stop granting product access once the window closes.
--
-- The 7-day bound MUST mirror PAST_DUE_GRACE_DAYS in
-- src/lib/api/subscriptions.ts so the client and server gates agree.
-- Apply after 0007_escrow.sql:  supabase db push
-- Idempotent: add column if not exists / create or replace function / a
-- one-shot backfill that only touches rows still missing the timestamp.
-- ============================================================================

-- 1. Track WHEN a subscription entered past_due (the grace anchor). The webhook
--    stamps this on the transition into past_due and clears it on the way out.
alter table public.subscriptions
  add column if not exists past_due_since timestamptz;

-- 2. Backfill existing past_due rows so the new bound has an anchor to measure
--    from. current_period_end is the moment the paid period lapsed (the best
--    proxy for when payment became due); fall back to now() if it's unknown.
update public.subscriptions
   set past_due_since = coalesce(current_period_end, now())
 where status = 'past_due'
   and past_due_since is null;

-- 3. Re-gate the entitlement helper with the bounded past_due window. trialing
--    and active are unchanged; past_due passes only while inside the window (or
--    while its anchor is unknown — don't lock a user out for missing data, the
--    next webhook stamps past_due_since and the bound applies from then on).
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

-- EXECUTE grants are unchanged from 0005 but re-assert them idempotently.
revoke all on function public.has_active_subscription(uuid) from public;
grant execute on function public.has_active_subscription(uuid) to authenticated, service_role;
