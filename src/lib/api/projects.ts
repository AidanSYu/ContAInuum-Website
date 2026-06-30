import { supabase } from '@/lib/supabase';
import { projectSchema, type ProjectInput } from '@/lib/validation';
import type { Database } from '@/lib/database.types';

export type Project = Database['public']['Tables']['projects']['Row'];

/**
 * Authenticated CRUD over the user's own projects. No `user_id` is ever sent
 * from the client, the column defaults to auth.uid() and RLS enforces that a
 * user can only read/write their own rows.
 */

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const payload = projectSchema.parse(input);
  const { data, error } = await supabase
    .from('projects')
    .insert({ title: payload.title, data: payload.data })
    .select()
    .single();
  if (error) {
    // Supabase/PostgREST RLS rejection (code 42501), most likely a lapsed sub
    // hitting the has_active_subscription gate added in 0005.
    if (error.code === '42501' || /row-level security/i.test(error.message)) {
      throw new Error('An active subscription is required to create projects. Visit Billing to start your plan.');
    }
    throw error;
  }
  return data;
}

export async function updateProject(
  id: string,
  patch: Partial<ProjectInput>,
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}
