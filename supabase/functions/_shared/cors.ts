// Shared CORS + JSON helpers for Edge Functions.
//
// CORS is allowlist-based and origin-reflective (never a bare '*'):
//   * The browser sends an `Origin` header. We reflect it back in
//     Access-Control-Allow-Origin ONLY when it is in the allowlist.
//   * Allowlist = env ALLOWED_ORIGINS (comma-separated) + SITE_URL, plus any
//     localhost / 127.0.0.1 origin (any port/scheme) for local development.
//   * If the origin is not allowed, we omit Access-Control-Allow-Origin
//     entirely (the browser then blocks the cross-origin read). Same-origin and
//     non-browser callers (no Origin header) are unaffected.
//
// `corsHeaders(req)` computes the per-request header set. Pass the Request so
// the correct origin can be reflected. Calling it without a Request yields the
// static (no-ACAO) base headers — safe, but a browser cross-origin read will be
// blocked, so prefer passing `req`.

/** Parse the configured allowlist (ALLOWED_ORIGINS + SITE_URL) once. */
function configuredOrigins(): string[] {
  const list = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const site = (Deno.env.get('SITE_URL') ?? '').trim();
  if (site) list.push(site);
  // Normalize: strip any trailing slash so 'https://x/' matches 'https://x'.
  return list.map((o) => o.replace(/\/+$/, ''));
}

/** Shape of a local-dev origin (any port): http://localhost:* / 127.0.0.1:*. */
function isLocalhostOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

/**
 * Localhost is auto-allowed ONLY in insecure dev mode (the same explicit opt-out
 * that disables the Turnstile fail-closed). In production this is unset, so
 * localhost origins must be listed in ALLOWED_ORIGINS like any other — no broad
 * localhost allowance ships to prod.
 */
function devModeAllowsLocalhost(): boolean {
  return Deno.env.get('ALLOW_INSECURE_NO_CAPTCHA') === 'true';
}

/** True if the request Origin is permitted to read our responses. */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const normalized = origin.replace(/\/+$/, '');
  if (devModeAllowsLocalhost() && isLocalhostOrigin(normalized)) return true;
  return configuredOrigins().includes(normalized);
}

const BASE_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
};

/**
 * Per-request CORS headers. Reflects the request Origin in
 * Access-Control-Allow-Origin only when it is in the allowlist; otherwise the
 * header is omitted (deny). Pass the Request so the origin can be evaluated.
 */
export function corsHeaders(req?: Request): Record<string, string> {
  const origin = req?.headers.get('origin') ?? null;
  if (isAllowedOrigin(origin)) {
    return { ...BASE_CORS_HEADERS, 'Access-Control-Allow-Origin': origin! };
  }
  return { ...BASE_CORS_HEADERS };
}

export function json(body: unknown, status = 200, req?: Request): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
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

/**
 * Verify a Cloudflare Turnstile token against Cloudflare's siteverify API.
 *
 * Fail-CLOSED: if TURNSTILE_SECRET_KEY is not configured, verification returns
 * false (request rejected) UNLESS ALLOW_INSECURE_NO_CAPTCHA === 'true' is set
 * as an explicit local-dev opt-out. This prevents a missing secret in
 * production from silently disabling bot protection.
 */
export async function verifyTurnstile(
  token: string,
  ip: string | null,
): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) {
    // No secret configured → fail closed, unless explicitly opted out for dev.
    return Deno.env.get('ALLOW_INSECURE_NO_CAPTCHA') === 'true';
  }
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
