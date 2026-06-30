import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

/** Statuses that can grant access (past_due only inside its grace window). */
const ACTIVE_STATUSES: Subscription['status'][] = ['trialing', 'active', 'past_due'];

/**
 * How long a `past_due` subscription keeps access after a failed payment, before
 * the gate denies it. Access-denial only, we never mutate the Stripe
 * subscription, so Stripe's own dunning stays authoritative.
 *
 * MUST mirror the `interval '7 days'` bound in has_active_subscription()
 * (supabase/migrations/0008_past_due_grace.sql) so the client gate and the
 * server-side RLS gate stay in agreement.
 */
export const PAST_DUE_GRACE_DAYS = 7;
const PAST_DUE_GRACE_MS = PAST_DUE_GRACE_DAYS * 86_400_000;

/**
 * The signed-in user's subscription, if any. RLS guarantees a user only ever
 * reads their own row; the webhook (service_role) is the only writer.
 */
export async function getMySubscription(): Promise<Subscription | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * The grace anchor (epoch ms) for a past_due subscription: when the unpaid
 * period lapsed. Prefer `past_due_since` (stamped by the webhook on entry into
 * past_due); fall back to `current_period_end`. Null when we have neither.
 */
function pastDueAnchorMs(sub: Subscription): number | null {
  const anchor = sub.past_due_since ?? sub.current_period_end;
  return anchor ? new Date(anchor).getTime() : null;
}

/** Whether a past_due subscription is still inside its bounded grace window. */
function withinPastDueGrace(sub: Subscription): boolean {
  const anchor = pastDueAnchorMs(sub);
  // Unknown start (no timestamps yet) → don't lock the user out; the next Stripe
  // webhook stamps past_due_since and the bound applies from then on.
  if (anchor === null) return true;
  return Date.now() < anchor + PAST_DUE_GRACE_MS;
}

/** Whether a subscription currently grants product access. */
export function hasAccess(sub: Subscription | null): boolean {
  if (!sub) return false;
  if (!ACTIVE_STATUSES.includes(sub.status)) return false;
  // A failed payment keeps access only inside the bounded grace window.
  if (sub.status === 'past_due') return withinPastDueGrace(sub);
  // A canceled-at-period-end sub still has access until the period actually ends.
  return true;
}

/**
 * Whole days left in a past_due grace window, for a "payment failed, N days
 * left" banner. Returns 0 when the window has closed or the sub isn't past_due,
 * and null when the window is effectively unbounded because we don't yet know
 * when past_due began.
 */
export function pastDueGraceDaysLeft(sub: Subscription | null): number | null {
  if (!sub || sub.status !== 'past_due') return 0;
  const anchor = pastDueAnchorMs(sub);
  if (anchor === null) return null;
  return Math.max(0, Math.ceil((anchor + PAST_DUE_GRACE_MS - Date.now()) / 86_400_000));
}

/** Days left in a trial (0 if not trialing or already ended). */
export function trialDaysLeft(sub: Subscription | null): number {
  if (!sub || sub.status !== 'trialing' || !sub.trial_end) return 0;
  const ms = new Date(sub.trial_end).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
