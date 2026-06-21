// Shared Stripe + Supabase-admin helpers for the billing Edge Functions.
import Stripe from 'npm:stripe@^17';
import { createClient } from 'jsr:@supabase/supabase-js@2';

/** Stripe client configured to use fetch (required on Deno/Edge runtime). */
export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2025-08-27.basil',
  httpClient: Stripe.createFetchHttpClient(),
});

/** Where to send users back to after Stripe Checkout / Portal. */
export const SITE_URL = Deno.env.get('SITE_URL') ?? 'http://localhost:5173';

/** Service-role client — bypasses RLS. Only ever used server-side. */
export function adminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );
}

/** Resolve the authenticated user from the request's Bearer JWT, or null. */
export async function getUser(req: Request) {
  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '').trim();
  if (!token) return null;
  const { data, error } = await adminClient().auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

/**
 * Get the user's Stripe customer id, creating the customer (and stamping it on
 * their profile) on first use. Keeps a single customer per user.
 */
export async function ensureStripeCustomer(
  userId: string,
  email: string | undefined,
): Promise<string> {
  const admin = adminClient();

  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.stripe_customer_id) return profile.stripe_customer_id;

  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  await admin.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', userId);
  return customer.id;
}
