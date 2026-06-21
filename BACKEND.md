# contAInuum — Backend & Security Guide

This site is a static React/Vite frontend with a **Supabase** backend
(Postgres + Auth + Edge Functions). The browser only ever uses the public
`anon` key; all data access is gated by **Row Level Security (RLS)** in the
database, and all writes to public tables go through **Edge Functions** that
hold the secret `service_role` key.

```
Browser (anon key)  ──▶  Supabase
  • supabase-js + RLS         • Postgres (RLS-protected)
  • Edge Function calls       • Auth (JWT)
                              • Edge Functions (service_role, secrets)
```

---

## 1. Create the Supabase project

1. Create a project at https://supabase.com/dashboard.
2. **Project Settings → API** — copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / publishable key** → `VITE_SUPABASE_ANON_KEY`
3. Copy env file and fill it in:
   ```bash
   cp .env.example .env.local
   ```
   `.env.local` is gitignored. **Never** put the `service_role` key here — it
   belongs only in Edge Function secrets (step 4).

## 2. Apply the database schema

**Option A — Supabase CLI (recommended, version-controlled):**
```bash
npm i -g supabase            # or: npx supabase ...
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase db push             # applies supabase/migrations/0001_init.sql
```

**Option B — no CLI:** open **SQL Editor** in the dashboard, paste the contents
of [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql), Run.

After this you have: `profiles`, `contact_messages`, `subscribers`, `projects`,
RLS enabled on all four, owner policies on `profiles`/`projects`, and triggers
for `updated_at` + auto-profile-creation on signup.

## 3. Configure Auth

- **Authentication → Providers → Email**: enable. For production keep
  **"Confirm email"** ON.
- **Authentication → URL Configuration**: set Site URL + redirect URLs to your
  domain (and `http://localhost:5173` for dev).
- Consider enabling MFA before granting anyone the `admin` role.

## 4. Deploy Edge Functions

```bash
supabase functions deploy contact
supabase functions deploy newsletter-subscribe
supabase functions deploy newsletter-confirm --no-verify-jwt   # opened from email
```

Set their secrets (the `SUPABASE_*` ones are injected automatically):
```bash
supabase secrets set \
  TURNSTILE_SECRET_KEY=xxxxx \
  RESEND_API_KEY=xxxxx \
  CONTACT_NOTIFY_EMAIL=hello@containuum.io \
  EMAIL_FROM=notifications@containuum.io \
  SITE_URL=https://containuum.io
```
All of these are optional for a first run:
- No `TURNSTILE_SECRET_KEY` → captcha check is skipped (fine for local dev).
- No `RESEND_*` → emails are skipped; the newsletter confirm link is logged to
  the function logs instead.

## 4b. Billing with Stripe (trials + subscriptions)

The app sells trial subscriptions to the plans seeded in
[`supabase/migrations/0002_billing.sql`](supabase/migrations/0002_billing.sql).
Stripe is the source of truth; the `stripe-webhook` function is the only writer
of the `subscriptions` table.

1. **Create Products & Prices** in the Stripe Dashboard (Test mode first) — one
   recurring Price per paid plan (Starter, Pro). Copy each Price id (`price_…`).
2. **Wire Price ids into the catalog** so checkout knows what to charge:
   ```sql
   update public.plans set stripe_price_id = 'price_xxx' where id = 'starter';
   update public.plans set stripe_price_id = 'price_yyy' where id = 'pro';
   ```
   (Enterprise has `amount_cents = 0` → routes to “Contact sales”, no Price needed.)
3. **Deploy the billing functions:**
   ```bash
   supabase functions deploy create-checkout-session
   supabase functions deploy create-portal-session
   supabase functions deploy stripe-webhook --no-verify-jwt   # Stripe is the caller
   ```
4. **Set secrets:**
   ```bash
   supabase secrets set \
     STRIPE_SECRET_KEY=sk_test_xxx \
     STRIPE_WEBHOOK_SECRET=whsec_xxx \
     SITE_URL=https://containuum.io
   ```
5. **Register the webhook** in Stripe → Developers → Webhooks, pointing at
   `https://YOUR-REF.supabase.co/functions/v1/stripe-webhook`, subscribed to:
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `customer.subscription.trial_will_end`. Copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
   - Local testing: `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`
     and use the `whsec_…` it prints.
6. **Enable the Billing Portal** in Stripe → Settings → Billing → Customer portal.

**Flow:** signup → `/app/billing` → *Start free trial* → `create-checkout-session`
returns a Stripe Checkout URL → on return, `stripe-webhook` upserts the row →
the dashboard reads `subscriptions` (RLS-scoped) and gates project access via
`hasAccess()`. *Manage billing* opens the Stripe portal.

## 5. Bot protection (Cloudflare Turnstile)

1. Create a Turnstile widget at https://dash.cloudflare.com/?to=/:account/turnstile.
2. Put the **site key** in `.env.local` as `VITE_TURNSTILE_SITE_KEY` and the
   **secret key** in the `contact` / `newsletter-subscribe` function secrets
   (`TURNSTILE_SECRET_KEY`). The widget renders automatically when the site key
   is present; the form stays usable in dev when it's absent.

## 6. Run it

```bash
npm install
npm run dev      # http://localhost:5173
```
Submit the contact form → a row appears in **Table Editor → contact_messages**.

---

## Security checklist (what's already enforced)

| Control | Where |
|---|---|
| RLS default-deny on every table | `0001_init.sql` |
| Users can only read/write their own rows | `profiles_*` / `projects_*` policies |
| Public tables write-only via service_role | no client policies on `contact_messages` / `subscribers` |
| `service_role` key never in frontend | only in Edge Function env |
| `anon` key safe to expose | RLS does the gatekeeping |
| Server-side input validation | Edge Functions re-validate (mirror of Zod) |
| Captcha on public forms | Turnstile (client widget + server verify) |
| Honeypot spam trap | `company_website` field |
| Raw IPs never stored | `sha256()` → `ip_hash` |
| Ownership can't be forged | `user_id default auth.uid()` + `with check` |
| Security headers (CSP/HSTS/etc.) | `vercel.json` + `public/_headers` |
| Secrets gitignored | `.env*` in `.gitignore` |

### Recommended next hardening steps
- Restrict `ALLOWED_ORIGIN` (Edge Function secret) from `*` to your domain.
- Turn on **Point-in-Time Recovery** (Database → Backups).
- Add rate limiting on the Edge Functions (e.g. per `ip_hash` window).
- Regenerate DB types after any schema change:
  `supabase gen types typescript --linked > src/lib/database.types.ts`

---

## Where things live

| Path | Purpose |
|---|---|
| `supabase/migrations/` | SQL schema + RLS (source of truth) |
| `supabase/functions/` | Edge Functions (contact, newsletter) |
| `src/lib/supabase.ts` | Browser client (anon key) |
| `src/lib/database.types.ts` | Generated DB types |
| `src/lib/validation.ts` | Shared Zod schemas |
| `src/lib/api/` | Typed data-access functions (incl. `plans`, `subscriptions`, `billing`) |
| `src/lib/auth/` | Auth provider + `useAuth()` hook |
| `src/components/Turnstile.tsx` | Captcha widget |
| `supabase/migrations/0002_billing.sql` | Plans, subscriptions, billing RLS + seed |
| `supabase/functions/_shared/stripe.ts` | Stripe client + customer/auth helpers |
| `supabase/functions/create-checkout-session/` | Starts a trial Checkout session |
| `supabase/functions/create-portal-session/` | Opens the Stripe billing portal |
| `supabase/functions/stripe-webhook/` | Syncs Stripe → `subscriptions` (sole writer) |
