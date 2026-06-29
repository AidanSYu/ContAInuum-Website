// Edge Function: stripe-webhook
// The single source that syncs Stripe subscription state into our DB. Stripe is
// authoritative; this function (service_role) is the ONLY writer of the
// `subscriptions` table.
//
// Hardening (migration 0006_webhook_hardening.sql):
//   * Idempotency — Stripe delivers AT LEAST ONCE. After signature verification
//     we check the `processed_stripe_events` ledger; a duplicate event id is a
//     200 no-op. We record every handled event id (race-safe, on-conflict-do-
//     nothing) so retries are skipped.
//   * Ordering — Stripe does NOT guarantee delivery order. Each subscription row
//     carries a `last_event_at` watermark (= the applied event's `created`). We
//     skip a write whose event is older than the stored watermark, so a stale
//     "updated" can't clobber a newer state.
//
// IMPORTANT: deploy WITHOUT JWT verification (Stripe is the caller):
//   supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (+ auto-injected SUPABASE_*).

import Stripe from 'npm:stripe@^17';
import { adminClient, stripe } from '../_shared/stripe.ts';

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    // constructEventAsync uses WebCrypto — required on the Edge runtime.
    event = await stripe.webhooks.constructEventAsync(payload, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const admin = adminClient();

  // Idempotency: if we've already processed this event id, acknowledge and stop.
  // (Stripe retries deliveries; the ledger makes replays no-ops.)
  const { data: seen } = await admin
    .from('processed_stripe_events')
    .select('event_id')
    .eq('event_id', event.id)
    .maybeSingle();
  if (seen) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Subscriptions (mode:'subscription') keep their existing path. Escrow
        // sessions are mode:'payment' with no session.subscription, so the two
        // branches never overlap.
        if (session.mode === 'subscription' || session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await syncSubscription(sub, event.created);
        } else if (session.metadata?.kind === 'escrow') {
          await handleEscrowCheckout(session);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.trial_will_end': {
        await syncSubscription(event.data.object as Stripe.Subscription, event.created);
        break;
      }
      // NEW (escrow only) — subscription handling never uses these, so adding
      // them cannot regress it. A charge.refunded object is a Charge; a
      // refund.updated object is a Refund. handleEscrowRefund handles both.
      case 'charge.refunded':
      case 'refund.updated':
      case 'charge.refund.updated': {
        await handleEscrowRefund(event.data.object as Stripe.Charge | Stripe.Refund);
        break;
      }
      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }

    // Record the event id so any retry of THIS delivery is short-circuited above.
    // Race-safe: a concurrent duplicate that slipped past the initial check
    // hits the primary key and is ignored rather than erroring.
    await recordProcessedEvent(admin, event.id, event.type);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Webhook handler error:', e);
    // Do NOT record the event id on failure — let Stripe retry.
    return new Response('Webhook handler failed', { status: 500 });
  }
});

/** Insert the processed-event marker; ignore the conflict if it already exists. */
async function recordProcessedEvent(
  admin: ReturnType<typeof adminClient>,
  eventId: string,
  type: string,
): Promise<void> {
  const { error } = await admin
    .from('processed_stripe_events')
    .upsert({ event_id: eventId, type }, { onConflict: 'event_id', ignoreDuplicates: true });
  if (error) console.error('Failed to record processed event:', error);
}

/**
 * Upsert one Stripe subscription into public.subscriptions, keyed by user.
 * `eventCreated` is the Stripe Event.created (unix seconds) used as the ordering
 * watermark: an event older than the row's stored last_event_at is skipped.
 */
async function syncSubscription(sub: Stripe.Subscription, eventCreated: number): Promise<void> {
  const admin = adminClient();
  const customerId = sub.customer as string;

  // Resolve the owning user: prefer subscription metadata, fall back to the
  // profile linked to this Stripe customer.
  let userId = sub.metadata?.supabase_user_id ?? null;
  if (!userId) {
    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    userId = profile?.id ?? null;
  }
  if (!userId) {
    console.error('No user for Stripe customer', customerId);
    return;
  }

  // Ordering guard: if the existing row was last written by a NEWER event,
  // skip this (stale / out-of-order) delivery so we don't roll state backwards.
  const eventAtIso = new Date(eventCreated * 1000).toISOString();
  const { data: existing } = await admin
    .from('subscriptions')
    .select('last_event_at, past_due_since')
    .eq('user_id', userId)
    .maybeSingle();
  if (existing?.last_event_at && new Date(existing.last_event_at) > new Date(eventAtIso)) {
    console.log(
      `Skipping stale Stripe event for user ${userId}: event ${eventAtIso} <= stored ${existing.last_event_at}`,
    );
    return;
  }

  // Resolve the plan from the subscription's price.
  const item = sub.items.data[0];
  const priceId = item?.price?.id ?? null;
  let planId = sub.metadata?.plan_id ?? null;
  if (!planId && priceId) {
    const { data: plan } = await admin
      .from('plans')
      .select('id')
      .eq('stripe_price_id', priceId)
      .maybeSingle();
    planId = plan?.id ?? null;
  }

  const toIso = (unix: number | null | undefined) =>
    unix ? new Date(unix * 1000).toISOString() : null;

  // Grace anchor for the bounded past_due window (see has_active_subscription /
  // PAST_DUE_GRACE_DAYS). Stamp the FIRST time we see past_due and preserve it
  // across subsequent past_due events; clear it once the sub leaves past_due.
  // The watermark guard above means we only get here for events newer than the
  // stored state, so the earliest past_due event wins the timestamp.
  const pastDueSince =
    sub.status === 'past_due' ? (existing?.past_due_since ?? eventAtIso) : null;

  const row = {
    user_id: userId,
    plan_id: planId,
    stripe_subscription_id: sub.id,
    stripe_customer_id: customerId,
    status: sub.status,
    // Basil API (2025-08-27): period bounds live on the subscription item,
    // not the top-level subscription.
    current_period_end: toIso(item?.current_period_end),
    trial_end: toIso(sub.trial_end),
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
    // When the subscription entered past_due (null unless currently past_due).
    past_due_since: pastDueSince,
    // Ordering watermark: the event that produced this state.
    last_event_at: eventAtIso,
  };

  // One subscription row per user (unique index on user_id).
  const { error } = await admin
    .from('subscriptions')
    .upsert(row, { onConflict: 'user_id' });

  if (error) console.error('Failed to upsert subscription:', error);
}

// ── Escrow (platform-held milestone escrow) ──────────────────────────────────
// The webhook is the SOLE authority that moves an agreement to 'funded' once
// Stripe confirms the Checkout payment. Escrow transitions are monotonic
// (pending -> funded -> released/refunded) and every UPDATE is predicated on the
// prior status, so duplicate / out-of-order deliveries are naturally idempotent
// — no last_event_at watermark is needed for escrow rows.

/**
 * checkout.session.completed for an escrow (mode:'payment') session. Marks the
 * agreement 'funded', stamps the PaymentIntent, and funds every still-'pending'
 * milestone. The status predicates make replays no-ops.
 */
async function handleEscrowCheckout(session: Stripe.Checkout.Session): Promise<void> {
  const admin = adminClient();
  const agreementId = session.metadata?.agreement_id;
  const pi = session.payment_intent as string | null;
  if (!agreementId) {
    console.error('Escrow checkout missing agreement_id metadata');
    return;
  }

  const { data: agreement } = await admin
    .from('escrow_agreements')
    .select('id, status')
    .eq('id', agreementId)
    .maybeSingle();

  // Missing, or already advanced — no-op (idempotent against duplicate
  // deliveries that slipped past the ledger).
  if (!agreement || agreement.status === 'funded' || agreement.status === 'completed') {
    return;
  }

  // The status='pending' predicate makes this a no-op on replay.
  const { error: agErr } = await admin
    .from('escrow_agreements')
    .update({ status: 'funded', stripe_payment_intent_id: pi })
    .eq('id', agreementId)
    .eq('status', 'pending');
  if (agErr) {
    console.error('Failed to mark escrow agreement funded:', agErr);
    return;
  }

  const { error: mErr } = await admin
    .from('escrow_milestones')
    .update({ status: 'funded' })
    .eq('agreement_id', agreementId)
    .eq('status', 'pending');
  if (mErr) console.error('Failed to fund escrow milestones:', mErr);
}

/**
 * charge.refunded / refund.updated for an escrow PaymentIntent. Reconciles each
 * Stripe refund to a milestone by (payment_intent + amount + still-'funded').
 * Convergent & idempotent with the escrow-admin refund_milestone write: whoever
 * sees a still-'funded' milestone marks it 'refunded'; the loser's predicate
 * matches nothing and writes nothing.
 */
async function handleEscrowRefund(object: Stripe.Charge | Stripe.Refund): Promise<void> {
  const admin = adminClient();

  // Normalize the event object into a list of refunds. Each refund carries the
  // milestone_id stamped on it at creation time (escrow-admin) so we can settle
  // EXACTLY the milestone that was refunded — never match by amount alone, which
  // would over-settle sibling milestones that happen to share an amount.
  type RefundRef = {
    paymentIntent: string;
    refundId: string;
    amount: number;
    milestoneId: string | null;
  };
  const refunds: RefundRef[] = [];
  const milestoneIdOf = (meta: Record<string, string> | null | undefined): string | null =>
    (meta?.milestone_id as string | undefined) ?? null;

  if (object.object === 'charge') {
    const charge = object as Stripe.Charge;
    const pi = charge.payment_intent as string | null;
    if (!pi) return;
    for (const r of charge.refunds?.data ?? []) {
      refunds.push({ paymentIntent: pi, refundId: r.id, amount: r.amount, milestoneId: milestoneIdOf(r.metadata) });
    }
  } else if (object.object === 'refund') {
    const r = object as Stripe.Refund;
    const pi = r.payment_intent as string | null;
    if (!pi) return;
    refunds.push({ paymentIntent: pi, refundId: r.id, amount: r.amount, milestoneId: milestoneIdOf(r.metadata) });
  } else {
    return;
  }

  const touchedAgreements = new Set<string>();

  for (const r of refunds) {
    // Resolve the owning agreement by its captured PaymentIntent.
    const { data: agreement } = await admin
      .from('escrow_agreements')
      .select('id')
      .eq('stripe_payment_intent_id', r.paymentIntent)
      .maybeSingle();
    if (!agreement) continue; // not an escrow PI — ignore
    touchedAgreements.add(agreement.id);

    // Resolve EXACTLY ONE target milestone. Prefer the milestone_id stamped on
    // the refund (escrow-admin sets it at creation). Only if it's absent, fall
    // back to a single still-'funded' milestone with the matching amount, chosen
    // deterministically (.limit(1)) — so one refund settles at most one milestone
    // even when several share an amount (the H-1 over-settlement bug).
    let milestoneId = r.milestoneId;
    if (!milestoneId) {
      const { data: candidate } = await admin
        .from('escrow_milestones')
        .select('id')
        .eq('agreement_id', agreement.id)
        .eq('amount_cents', r.amount)
        .eq('status', 'funded')
        .is('stripe_refund_id', null)
        .order('sort_order', { ascending: true })
        .limit(1)
        .maybeSingle();
      milestoneId = candidate?.id ?? null;
    }
    if (!milestoneId) continue; // already settled, or not an escrow refund

    // Mark that one milestone, predicated on still-'funded' + unset refund id so
    // this CONVERGES with escrow-admin's write: whoever lands first wins; the
    // other matches nothing = harmless no-op.
    const { error } = await admin
      .from('escrow_milestones')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
        stripe_refund_id: r.refundId,
      })
      .eq('id', milestoneId)
      .eq('agreement_id', agreement.id)
      .eq('status', 'funded')
      .is('stripe_refund_id', null);
    if (error) console.error('Failed to reconcile escrow refund:', error);
  }

  // After marking, complete any agreement that has no remaining open milestone.
  for (const agreementId of touchedAgreements) {
    const { count } = await admin
      .from('escrow_milestones')
      .select('id', { count: 'exact', head: true })
      .eq('agreement_id', agreementId)
      .in('status', ['pending', 'funded']);
    if ((count ?? 0) === 0) {
      await admin
        .from('escrow_agreements')
        .update({ status: 'completed' })
        .eq('id', agreementId)
        .eq('status', 'funded');
    }
  }
}
