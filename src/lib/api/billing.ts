import { FUNCTIONS_URL, isBackendConfigured } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

/**
 * Billing calls go through Edge Functions that hold the Stripe secret key.
 * They require an authenticated user, we forward the user's JWT so the
 * function can identify them via `auth.getUser()` and never trust a client id.
 */
async function authedPost<T>(fn: string, body: unknown): Promise<T> {
  if (!isBackendConfigured) {
    throw new Error('Backend is not configured yet. Add Supabase keys to .env.local.');
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error('You must be signed in to do that.');

  const res = await fetch(`${FUNCTIONS_URL}/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(errBody.error ?? 'Something went wrong. Please try again.');
  }
  return res.json() as Promise<T>;
}

/**
 * Start a Stripe Checkout session for a trial subscription to `planId`.
 * Returns the hosted Checkout URL to redirect the browser to.
 */
export async function startCheckout(planId: string): Promise<string> {
  const { url } = await authedPost<{ url: string }>('create-checkout-session', {
    plan_id: planId,
  });
  return url;
}

/**
 * Open the Stripe Billing Portal so the user can manage their subscription,
 * payment methods, and invoices. Returns the portal URL.
 */
export async function openBillingPortal(): Promise<string> {
  const { url } = await authedPost<{ url: string }>('create-portal-session', {});
  return url;
}
