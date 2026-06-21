import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

/** Statuses that grant access to the product (trial counts as active). */
const ACTIVE_STATUSES: Subscription['status'][] = ['trialing', 'active', 'past_due'];

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

/** Whether a subscription currently grants product access. */
export function hasAccess(sub: Subscription | null): boolean {
  if (!sub) return false;
  if (!ACTIVE_STATUSES.includes(sub.status)) return false;
  // A canceled-at-period-end sub still has access until the period actually ends.
  return true;
}

/** Days left in a trial (0 if not trialing or already ended). */
export function trialDaysLeft(sub: Subscription | null): number {
  if (!sub || sub.status !== 'trialing' || !sub.trial_end) return 0;
  const ms = new Date(sub.trial_end).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
