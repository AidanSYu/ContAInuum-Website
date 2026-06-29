-- ============================================================================
-- contAInuum — store the contact topic (which funnel a message came from)
-- ----------------------------------------------------------------------------
-- The public contact form is topic-keyed (partner, pilot, demo, enterprise,
-- security, general). Persisting the topic lets design-partner / pilot
-- applications be triaged apart from generic messages instead of all looking
-- alike in contact_messages.
-- Apply after 0008_past_due_grace.sql:  supabase db push
-- Idempotent: add column if not exists (the inline check rides along).
-- ============================================================================

alter table public.contact_messages
  add column if not exists topic text check (char_length(topic) <= 50);
