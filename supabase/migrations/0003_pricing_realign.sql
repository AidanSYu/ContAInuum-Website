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
