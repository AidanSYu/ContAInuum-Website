// Shared helpers for the Edge Function integration tests.
//
// Discovers a running local Supabase stack (URL + keys) so the tests can hit
// real functions and the real Postgres. Discovery order:
//   1. SUPABASE_TEST_URL / _ANON_KEY / _SERVICE_ROLE_KEY env vars (CI override)
//   2. `supabase status -o json` (a locally running `supabase start`)
//   3. nothing found  ->  `hasStack` is false and every suite self-skips.
import { execSync } from 'node:child_process';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type Stack = { url: string; anonKey: string; serviceRoleKey: string };

function fromEnv(): Stack | null {
  const url = process.env.SUPABASE_TEST_URL;
  const anonKey = process.env.SUPABASE_TEST_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY;
  return url && anonKey && serviceRoleKey ? { url, anonKey, serviceRoleKey } : null;
}

function fromCli(): Stack | null {
  try {
    const out = execSync('supabase status -o json', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const j = JSON.parse(out) as Record<string, string>;
    // Be tolerant of casing differences across CLI versions.
    const pick = (...keys: string[]) => keys.map((k) => j[k]).find(Boolean);
    const url = pick('API_URL', 'api_url');
    const anonKey = pick('ANON_KEY', 'anon_key');
    const serviceRoleKey = pick('SERVICE_ROLE_KEY', 'service_role_key');
    return url && anonKey && serviceRoleKey ? { url, anonKey, serviceRoleKey } : null;
  } catch {
    return null; // CLI missing or stack not running
  }
}

export const stack: Stack | null = fromEnv() ?? fromCli();
export const hasStack = stack !== null;

export const functionsUrl = () => `${stack!.url}/functions/v1`;

/** Service-role client — bypasses RLS, used to set up / assert DB state. */
export function serviceClient(): SupabaseClient {
  return createClient(stack!.url, stack!.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Anon client — what the browser uses; subject to RLS. */
export function anonClient(): SupabaseClient {
  return createClient(stack!.url, stack!.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const DEFAULT_PASSWORD = 'integration-test-pw-123';
let seq = 0;

/** A fresh, collision-proof email for each test. */
export function uniqueEmail(prefix = 'itest'): string {
  seq += 1;
  return `${prefix}+${Date.now()}-${seq}@example.com`;
}

/** Create a pre-confirmed auth user (fires the handle_new_user trigger). */
export async function createUser(email: string, password = DEFAULT_PASSWORD) {
  const { data, error } = await serviceClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  return data.user;
}

/** Sign a user in and return their access token (the JWT functions expect). */
export async function signIn(email: string, password = DEFAULT_PASSWORD): Promise<string> {
  const { data, error } = await anonClient().auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.session) throw new Error('no session returned for sign-in');
  return data.session.access_token;
}

type CallResult = { status: number; body: any };

/**
 * POST an Edge Function. Sends the anon key as apikey + bearer by default;
 * pass `token` to authenticate as a specific user.
 */
export async function callFn(
  name: string,
  opts: { body?: unknown; token?: string; headers?: Record<string, string> } = {},
): Promise<CallResult> {
  const bearer = opts.token ?? stack!.anonKey;
  const res = await fetch(`${functionsUrl()}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: stack!.anonKey,
      Authorization: `Bearer ${bearer}`,
      ...opts.headers,
    },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, body };
}
