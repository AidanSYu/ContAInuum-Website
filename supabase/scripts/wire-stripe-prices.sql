-- ============================================================================
-- Wire Stripe Price ids into the plans catalog (Go-Live step 4).
-- ----------------------------------------------------------------------------
-- After a clean migrate, public.plans.stripe_price_id is NULL for every plan,
-- so subscription checkout returns "This plan is not purchasable yet." for ALL
-- plans. Create the recurring (monthly) Prices in the Stripe Dashboard, then
-- paste their ids below and run this in Supabase Studio -> SQL Editor.
--
-- The plan identifier is public.plans.id ('solo' | 'lab' | 'institute').
-- 'institute' is sales-led (Custom) and must stay NULL — it never goes to
-- Stripe Checkout; the pricing page routes it to /contact.
-- ============================================================================

update public.plans set stripe_price_id = 'price_REPLACE_WITH_SOLO_PRICE_ID' where id = 'solo';
update public.plans set stripe_price_id = 'price_REPLACE_WITH_LAB_PRICE_ID'  where id = 'lab';
-- 'institute' stays NULL (sales-led). Do NOT set a price for it.

-- Sanity check — solo/lab should now have a price id; institute stays NULL:
select id, stripe_price_id from public.plans order by id;
