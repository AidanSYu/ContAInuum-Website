import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/** Fetch the signed-in user's profile (RLS restricts this to their own row). */
export async function getMyProfile(): Promise<Profile | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', auth.user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Update editable fields on the signed-in user's profile. */
export async function updateMyProfile(patch: ProfileUpdate): Promise<Profile> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Not signed in');

  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', auth.user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
