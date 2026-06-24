-- ============================================================================
-- contAInuum — trial reminder bookkeeping
-- ----------------------------------------------------------------------------
-- Adds a marker so the `trial-reminders` Edge Function can send each user a
-- single "your trial ends soon" email instead of one on every run.
-- Apply with:  supabase db push
-- ============================================================================

alter table public.subscriptions
  add column if not exists trial_reminded_at timestamptz;
