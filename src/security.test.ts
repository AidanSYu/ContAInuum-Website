/**
 * Security invariants for the contAInuum web app.
 *
 * These are intentionally cheap, deterministic checks that run in CI and fail
 * loudly if a regression breaks one of the trust boundaries the backend relies
 * on: the service_role key staying server-side, RLS staying on, the Stripe
 * webhook verifying signatures, and checkout trusting the server catalog.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { contactSchema, signupSchema } from '@/lib/validation';

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(resolve(ROOT, rel), 'utf8');

function walk(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full, exts));
    else if (exts.some((e) => entry.endsWith(e))) out.push(full);
  }
  return out;
}

describe('the service_role key never reaches the frontend', () => {
  // Only files actually shipped to the browser — tests/harness are excluded
  // (this very file legitimately mentions SERVICE_ROLE to assert the rule).
  const appFiles = walk(resolve(ROOT, 'src'), ['.ts', '.tsx']).filter(
    (f) => !/\.test\.tsx?$/.test(f) && !/[\\/]test[\\/]/.test(f),
  );

  it('scans a non-trivial number of source files', () => {
    expect(appFiles.length).toBeGreaterThan(20);
  });

  it('no frontend source references a SERVICE_ROLE env var or key', () => {
    const offenders = appFiles.filter((f) => /SERVICE_ROLE/.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('the browser supabase client is built from the anon key only', () => {
    const client = read('src/lib/supabase.ts');
    expect(client).toContain('VITE_SUPABASE_ANON_KEY');
    expect(client).not.toMatch(/SERVICE_ROLE/);
  });
});

describe('secrets are kept out of version control', () => {
  it('.gitignore ignores .env files', () => {
    expect(read('.gitignore')).toMatch(/\.env/);
  });
});

describe('Row Level Security is enabled on every public table', () => {
  const sql = read('supabase/migrations/0001_init.sql') + '\n' + read('supabase/migrations/0002_billing.sql');

  it.each(['profiles', 'contact_messages', 'subscribers', 'projects', 'plans', 'subscriptions'])(
    'enables RLS on public.%s',
    (table) => {
      expect(sql).toMatch(new RegExp(`alter table public\\.${table}\\s+enable row level security`, 'i'));
    },
  );

  it('subscriptions has an owner-read policy and no client write policies', () => {
    const billing = read('supabase/migrations/0002_billing.sql');
    expect(billing).toMatch(/create policy subscriptions_select_own/);
    expect(billing).not.toMatch(/on public\.subscriptions\s+for (insert|update|delete)/i);
  });
});

describe('the Stripe webhook verifies signatures before trusting a payload', () => {
  const webhook = read('supabase/functions/stripe-webhook/index.ts');

  it('rejects requests with a missing signature', () => {
    expect(webhook).toContain('stripe-signature');
    expect(webhook).toMatch(/Missing signature/);
  });

  it('verifies the payload against the signing secret', () => {
    expect(webhook).toContain('constructEventAsync');
    expect(webhook).toContain('STRIPE_WEBHOOK_SECRET');
  });
});

describe('checkout trusts the server-side catalog, not the client', () => {
  const fn = read('supabase/functions/create-checkout-session/index.ts');

  it('requires an authenticated caller', () => {
    expect(fn).toMatch(/getUser\(req\)/);
    expect(fn).toMatch(/Not authenticated/);
  });

  it('looks the price up from the plans table and never takes a price id from the body', () => {
    expect(fn).toMatch(/from\('plans'\)/);
    expect(fn).toContain('plan.stripe_price_id');
    // The client may only send a plan_id; it must not be able to dictate a Stripe price.
    expect(fn).not.toMatch(/body[?.]*\.(price|price_id|stripe_price_id)/);
  });
});

describe('input-validation security invariants (defense in depth)', () => {
  const validContact = { name: 'Grace', email: 'grace@example.com', message: 'Hello.' };

  it('the contact honeypot rejects bot submissions', () => {
    expect(contactSchema.safeParse({ ...validContact, company_website: 'http://spam' }).success).toBe(false);
  });

  it('signup passwords are capped at the 72-byte bcrypt limit', () => {
    const base = { fullName: 'Grace', email: 'grace@example.com' };
    expect(signupSchema.safeParse({ ...base, password: 'a'.repeat(73) }).success).toBe(false);
  });
});
