# Edge Function integration tests

These tests run the **real** Edge Functions against a **local Supabase stack**
(Postgres + Auth + Edge runtime) started by the Supabase CLI. Unlike the unit
tests (`npm test`), they verify end-to-end behavior: HTTP in, DB rows out.

## Prerequisites

- **Docker Desktop** running.
- **Supabase CLI** installed — https://supabase.com/docs/guides/cli
  (`scoop install supabase`, `brew install supabase/tap/supabase`, or `npx supabase`).

## Run

```bash
# 1. Start the local stack (applies supabase/migrations/*, serves functions).
npm run itest:up          # = supabase start   (first run pulls Docker images)

# 2. Run the integration suite.
npm run test:integration

# 3. Tear the stack down when finished.
npm run itest:down        # = supabase stop
```

`supabase start` prints the local **API URL**, **anon key**, and
**service_role key**. The tests discover these automatically via
`supabase status -o json`, so there's nothing to copy. In CI (or if discovery
fails) you can instead set them explicitly:

```bash
SUPABASE_TEST_URL=http://127.0.0.1:54321 \
SUPABASE_TEST_ANON_KEY=... \
SUPABASE_TEST_SERVICE_ROLE_KEY=... \
  npm run test:integration
```

If no stack is reachable, **the suite skips itself** (prints a hint and exits 0)
— it never fails the build just because Docker isn't up.

## What's covered (no external secrets needed)

| Area | Assertion |
|---|---|
| `handle_new_user` trigger | creating an auth user auto-creates its `profiles` row |
| `contact` | stores valid messages; 400 on bad email; honeypot stores nothing |
| `newsletter-subscribe` + `newsletter-confirm` | pending → confirmed via token link |
| `create-checkout-session` | 401 (no user), 400 (unknown plan), 400 (unpriced plan) |
| `create-portal-session` | 401 (no user), 400 (no Stripe customer yet) |

Turnstile, Resend, and Stripe all degrade gracefully without secrets
(captcha/email skipped; Stripe is never reached because every case returns at a
guard first), so the suite needs **zero** third-party keys.

## Adding the Stripe happy paths (optional)

To cover a real Checkout/Portal URL you need Stripe **test** keys and a seeded
price id:

1. `supabase secrets set STRIPE_SECRET_KEY=sk_test_...` (or pass via an env file
   to `supabase functions serve`).
2. `update public.plans set stripe_price_id = 'price_...' where id = 'starter';`
3. Add a test that calls `create-checkout-session` with a user token and asserts
   the returned `url` starts with `https://checkout.stripe.com/`. Guard it with
   `describe.skipIf(!process.env.STRIPE_SECRET_KEY)` so it only runs when keys
   are present.
