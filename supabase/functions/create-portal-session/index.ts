// Edge Function: create-portal-session
// Opens the Stripe Billing Portal so a user can manage their subscription,
// payment methods, and invoices. Requires an authenticated caller.
//
// Deploy:  supabase functions deploy create-portal-session
// Secrets: STRIPE_SECRET_KEY, SITE_URL (+ auto-injected SUPABASE_*).

import { corsHeaders, json } from '../_shared/cors.ts';
import { adminClient, getUser, stripe, SITE_URL } from '../_shared/stripe.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const user = await getUser(req);
    if (!user) return json({ error: 'Not authenticated' }, 401);

    const { data: profile } = await adminClient()
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.stripe_customer_id) {
      return json({ error: 'No billing account yet. Start a subscription first.' }, 400);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${SITE_URL}/app/billing`,
    });

    return json({ url: session.url });
  } catch (e) {
    console.error('create-portal-session error:', e);
    return json({ error: 'Unexpected error' }, 500);
  }
});
