import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

export type Plan = Database['public']['Tables']['plans']['Row'];

/** Plan features are stored as a JSON string[] — narrow it for the UI. */
export function planFeatures(plan: Plan): string[] {
  return Array.isArray(plan.features) ? (plan.features as string[]) : [];
}

/** Public pricing catalog (RLS exposes only active plans). */
export async function listPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}
