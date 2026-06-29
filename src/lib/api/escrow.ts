import { FUNCTIONS_URL, isBackendConfigured } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

export type EscrowAgreement = Database['public']['Tables']['escrow_agreements']['Row'];
export type EscrowMilestone = Database['public']['Tables']['escrow_milestones']['Row'];
export type AgreementWithMilestones = EscrowAgreement & { milestones: EscrowMilestone[] };

/**
 * Escrow mutations go through Edge Functions that hold the Stripe secret key.
 * They require an authenticated user — we forward the user's JWT so the
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

// --- Customer (RLS-scoped reads + checkout) ---

/**
 * The signed-in user's escrow agreements. RLS limits the result to rows the
 * user owns; admins see all rows (see {@link listAllAgreements}).
 */
export async function listMyAgreements(): Promise<EscrowAgreement[]> {
  const { data, error } = await supabase
    .from('escrow_agreements')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * A single agreement with its milestones, or `null` if not found / not
 * accessible. RLS enforces ownership on both reads.
 */
export async function getAgreement(id: string): Promise<AgreementWithMilestones | null> {
  const { data: agreement, error } = await supabase
    .from('escrow_agreements')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!agreement) return null;

  const { data: milestones, error: mErr } = await supabase
    .from('escrow_milestones')
    .select('*')
    .eq('agreement_id', id)
    .order('sort_order', { ascending: true });
  if (mErr) throw mErr;

  return { ...agreement, milestones: milestones ?? [] };
}

/**
 * Start a Stripe Checkout session to fund the given agreement.
 * Returns the hosted Checkout URL to redirect the browser to.
 */
export async function startEscrowCheckout(agreementId: string): Promise<string> {
  const { url } = await authedPost<{ url: string }>('create-escrow-payment', {
    agreement_id: agreementId,
  });
  return url;
}

// --- Admin (escrow-admin edge function; RLS lets admins read all) ---

/**
 * Every escrow agreement. The `is_admin` RLS policy returns all rows for
 * admins; for non-admins this is equivalent to {@link listMyAgreements}.
 */
export async function listAllAgreements(): Promise<EscrowAgreement[]> {
  const { data, error } = await supabase
    .from('escrow_agreements')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export interface NewMilestoneInput {
  title: string;
  amount_cents: number;
  sort_order?: number;
}

export interface CreateAgreementInput {
  user_id: string;
  title: string;
  description?: string;
  currency?: string;
  milestones: NewMilestoneInput[];
}

/** Create an agreement and its milestones (admin only). */
export async function createAgreement(
  input: CreateAgreementInput,
): Promise<AgreementWithMilestones> {
  const { agreement, milestones } = await authedPost<{
    agreement: EscrowAgreement;
    milestones: EscrowMilestone[];
  }>('escrow-admin', { action: 'create_agreement', ...input });
  return { ...agreement, milestones };
}

/** Release escrowed funds for a milestone to the recipient (admin only). */
export async function releaseMilestone(
  milestoneId: string,
): Promise<{ milestone: EscrowMilestone; agreement: EscrowAgreement }> {
  return authedPost<{ milestone: EscrowMilestone; agreement: EscrowAgreement }>(
    'escrow-admin',
    { action: 'release_milestone', milestone_id: milestoneId },
  );
}

/** Refund a milestone back to the customer via Stripe (admin only). */
export async function refundMilestone(
  milestoneId: string,
): Promise<{ milestone: EscrowMilestone; agreement: EscrowAgreement; refund_id: string }> {
  return authedPost<{
    milestone: EscrowMilestone;
    agreement: EscrowAgreement;
    refund_id: string;
  }>('escrow-admin', { action: 'refund_milestone', milestone_id: milestoneId });
}
