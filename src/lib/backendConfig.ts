const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Public configuration needed by anonymous Edge Function requests. Keeping
 * this separate from the Supabase client avoids loading the full SDK for a
 * plain newsletter `fetch()` call. */
export const SUPABASE_ANON_KEY = anonKey ?? '';
export const FUNCTIONS_URL = url ? `${url}/functions/v1` : '';
export const isBackendConfigured = Boolean(url && anonKey);
