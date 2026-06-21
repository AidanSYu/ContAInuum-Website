import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * The anon key is PUBLIC by design — it only grants what Row Level Security
 * allows. The service_role key must NEVER appear in frontend code.
 */
export const SUPABASE_ANON_KEY = anonKey ?? '';

/** Base URL for invoking Edge Functions, e.g. `${FUNCTIONS_URL}/contact`. */
export const FUNCTIONS_URL = url ? `${url}/functions/v1` : '';

/** Whether the backend is configured. Lets the UI fail gracefully in dev. */
export const isBackendConfigured = Boolean(url && anonKey);

if (!isBackendConfigured) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. ' +
      'Auth, data, and the contact form will not work until you copy ' +
      '.env.example → .env.local and fill them in.',
  );
}

// Use a syntactically valid placeholder when unconfigured so importing this
// module never throws — the static site still renders without a backend.
export const supabase = createClient<Database>(
  url ?? 'https://placeholder.supabase.co',
  anonKey ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
