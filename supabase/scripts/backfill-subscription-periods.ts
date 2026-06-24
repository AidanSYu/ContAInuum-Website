// One-off backfill: repopulate `subscriptions.current_period_end` for rows that
// predate the Basil-API fix (period bounds moved from the Subscription object
// onto the subscription *item*, so the webhook used to write null).
//
// It re-reads each affected subscription from Stripe (the source of truth) and
// writes the period end from the item — exactly what the fixed webhook now does.
//
// Dry run (default — prints what WOULD change, writes nothing):
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... STRIPE_SECRET_KEY=... \
//     deno run --allow-env --allow-net supabase/scripts/backfill-subscription-periods.ts
//
// Apply for real:
//   ...same env... deno run --allow-env --allow-net \
//     supabase/scripts/backfill-subscription-periods.ts --apply
//
// Notes
//   * SUPABASE_SERVICE_ROLE_KEY bypasses RLS — run this from a trusted machine.
//   * Rows still missing a period after this (e.g. canceled subs Stripe no
//     longer reports a period for) are left as-is and listed under "skipped".

import { adminClient, stripe } from '../functions/_shared/stripe.ts';

const APPLY = Deno.args.includes('--apply');
const toIso = (unix: number | null | undefined) =>
  unix ? new Date(unix * 1000).toISOString() : null;

const admin = adminClient();

// Only rows that are missing a period but DO have a Stripe id to look up.
const { data: rows, error } = await admin
  .from('subscriptions')
  .select('id, user_id, stripe_subscription_id, status, current_period_end')
  .is('current_period_end', null)
  .not('stripe_subscription_id', 'is', null);

if (error) {
  console.error('Failed to read subscriptions:', error.message);
  Deno.exit(1);
}

console.log(`${APPLY ? 'APPLY' : 'DRY RUN'} — ${rows?.length ?? 0} candidate row(s) with a null period.\n`);

let updated = 0;
let skipped = 0;
let failed = 0;

for (const row of rows ?? []) {
  const stripeId = row.stripe_subscription_id as string;
  try {
    const sub = await stripe.subscriptions.retrieve(stripeId);
    const cpe = toIso(sub.items.data[0]?.current_period_end);

    if (!cpe) {
      skipped++;
      console.log(`SKIP  ${row.id}  (${stripeId}, status=${sub.status}) — Stripe reports no period end`);
      continue;
    }

    if (!APPLY) {
      updated++;
      console.log(`WOULD ${row.id}  (${stripeId}) → current_period_end=${cpe}`);
      continue;
    }

    const { error: upErr } = await admin
      .from('subscriptions')
      .update({ current_period_end: cpe })
      .eq('id', row.id);

    if (upErr) {
      failed++;
      console.error(`FAIL  ${row.id}  (${stripeId}) — ${upErr.message}`);
    } else {
      updated++;
      console.log(`OK    ${row.id}  (${stripeId}) → current_period_end=${cpe}`);
    }
  } catch (e) {
    failed++;
    console.error(`FAIL  ${row.id}  (${stripeId}) — ${e instanceof Error ? e.message : String(e)}`);
  }
}

console.log(
  `\nDone. ${APPLY ? 'updated' : 'would update'}=${updated}, skipped=${skipped}, failed=${failed}.` +
    (APPLY ? '' : '\nRe-run with --apply to write these changes.'),
);

if (failed > 0) Deno.exit(1);
