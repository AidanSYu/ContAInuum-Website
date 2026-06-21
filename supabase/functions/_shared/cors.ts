// Shared CORS + JSON helpers for Edge Functions.
//
// For tighter security in production, replace '*' with your exact origin(s),
// e.g. set ALLOWED_ORIGIN and echo it back only when it matches.
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*';

export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/** SHA-256 hex digest — used to store hashed IPs (never the raw address). */
export async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Verify a Cloudflare Turnstile token. Returns true if not configured (dev). */
export async function verifyTurnstile(
  token: string,
  ip: string | null,
): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) return true; // not configured → skip (local/dev)
  if (!token) return false;

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: form },
  );
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

export function clientIp(req: Request): string | null {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    null
  );
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 320;
}
