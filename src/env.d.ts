/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://abc.supabase.co */
  readonly VITE_SUPABASE_URL: string;
  /** Public anon/publishable key, safe for the browser (protected by RLS). */
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** Cloudflare Turnstile site key (public). Optional; blank disables captcha. */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
