// Edge Function: stripe-webhook
// The single source that syncs Stripe subscription state into our DB. Stripe is
// authoritative; this function (service_role) is the ONLY writer of the
// `subscriptions` table.
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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await syncSubscription(sub);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.trial_will_end': {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Webhook handler error:', e);
    return new Response('Webhook handler failed', { status: 500 });
  }
});

/** Upsert one Stripe subscription into public.subscriptions, keyed by user. */
async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
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

  // Resolve the plan from the subscription's price.
  const priceId = sub.items.data[0]?.price?.id ?? null;
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

  const row = {
    user_id: userId,
    plan_id: planId,
    stripe_subscription_id: sub.id,
    stripe_customer_id: customerId,
    status: sub.status,
    current_period_end: toIso(sub.current_period_end),
    trial_end: toIso(sub.trial_end),
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
  };

  // One subscription row per user (unique index on user_id).
  const { error } = await admin
    .from('subscriptions')
    .upsert(row, { onConflict: 'user_id' });

  if (error) console.error('Failed to upsert subscription:', error);
}
