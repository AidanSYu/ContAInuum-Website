# ContAInuum — Go-Live Runbook (Phase 1: configuration)

This is the **config/ops** checklist to make the already-built code live. All the
*code* for auth, subscription billing, and escrow exists on branch
`feat/payments-auth-escrow` and passes build + tests. The steps below are the
parts that need **your** Supabase/Stripe/Cloudflare accounts — they can't be done
from the codebase.

Do them roughly in order. Anything marked **⚠️** is a common silent-failure trap.

---

## 0. Prerequisites
- Supabase CLI (`supabase`), Stripe CLI (`stripe`), and project access.
- `supabase link --project-ref <YOUR-REF>` against your project.
- A Cloudflare Turnstile site (for captcha) — gives you a **site key** (public)
  and a **secret key**.

---

## 1. Database — apply all migrations (0001 → 0007)

Option A (preferred, versioned):
```bash
supabase db push      # applies migrations 0001..0007 in order
```
Option B (one paste): open `supabase/PROVISION_ALL.sql` and run it in
**Supabase Studio → SQL Editor**. It's idempotent and now spans 0001 → 0007.

What 0005–0007 add (built in Phases 0/2/3):
- **0005** — `has_active_subscription()` + projects INSERT/UPDATE gated on it; `REVOKE UPDATE/INSERT (role)` on `profiles` (no more self-made admins).
- **0006** — `processed_stripe_events` idempotency ledger + `subscriptions.last_event_at` ordering watermark.
- **0007** — escrow: `escrow_agreements`, `escrow_milestones`, `is_admin()`, RLS (clients read-only, service_role is the sole writer).

⚠️ After applying, **regenerate the typed schema** so future codegen stays in sync (the hand-written types are correct but should be reconciled):
```bash
supabase gen types typescript --linked > src/lib/database.types.ts
```

---

## 2. Edge Function secrets

Set server-only secrets (NEVER prefixed `VITE_`; `SUPABASE_URL` /
`SUPABASE_SERVICE_ROLE_KEY` are auto-injected, don't set them):
```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_live_or_test_... \
  STRIPE_WEBHOOK_SECRET=whsec_...            \
  SITE_URL=https://YOUR-DOMAIN              \
  ALLOWED_ORIGINS=https://YOUR-DOMAIN,https://www.YOUR-DOMAIN \
  TURNSTILE_SECRET_KEY=your-turnstile-secret \
  RESEND_API_KEY=your-resend-key            \
  EMAIL_FROM=notifications@YOUR-DOMAIN       \
  CONTACT_NOTIFY_EMAIL=hello@YOUR-DOMAIN     \
  CRON_SECRET=$(openssl rand -hex 32)
```
Notes:
- `ALLOWED_ORIGINS` — CORS allowlist (Phase 2). `SITE_URL` is also allowed; `localhost`/`127.0.0.1` are always allowed for dev. Unknown origins are denied.
- `STRIPE_WEBHOOK_SECRET` comes from step 5 (register the webhook first, then set this).
- `RESEND_*` / `CONTACT_NOTIFY_EMAIL` / `CRON_SECRET` are only needed for contact emails, newsletter, and trial reminders.
- ⚠️ **Do NOT** set `ALLOW_INSECURE_NO_CAPTCHA` in production — it's the single "insecure dev mode" flag: it lets local dev bypass Turnstile when the secret is unset **and** auto-allows `localhost` CORS origins. In prod, leaving it unset means captcha **fails closed** and `localhost` is denied CORS unless explicitly added to `ALLOWED_ORIGINS` (both the secure defaults). For local dev, set `ALLOW_INSECURE_NO_CAPTCHA=true`.

---

## 3. Deploy Edge Functions
```bash
supabase functions deploy contact
supabase functions deploy newsletter-subscribe
supabase functions deploy newsletter-confirm
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy create-escrow-payment      # NEW (escrow)
supabase functions deploy escrow-admin                # NEW (escrow)
supabase functions deploy trial-reminders
supabase functions deploy stripe-webhook --no-verify-jwt   # ⚠️ MUST be --no-verify-jwt
```
⚠️ Only `stripe-webhook` uses `--no-verify-jwt` (Stripe calls it without a Supabase JWT; it authenticates via the **Stripe signature** instead). All others keep JWT verification.

---

## 4. Stripe — Products, Prices, and wiring (subscriptions)

⚠️ **This is the #1 silent failure.** After a clean migrate, `plans.stripe_price_id`
is **NULL**, so every subscription checkout returns *"This plan is not purchasable
yet."* You must create Stripe Prices and write their ids back.

1. In the Stripe Dashboard create two **recurring (monthly)** Products/Prices:
   - **Solo** — $59/mo  → copy its `price_id` (e.g. `price_...`)
   - **Lab** — $329/mo  → copy its `price_id`
   - **Institute** stays sales-led — leave its `stripe_price_id` NULL.
2. Wire them: edit and run `supabase/scripts/wire-stripe-prices.sql`
   (template provided) in the SQL Editor.
3. Enable the **Billing Portal** (Stripe → Settings → Billing → Customer portal)
   so `create-portal-session` works.

(Escrow needs **no** catalog Price — it charges a dynamic amount per agreement.)

---

## 5. Stripe — register the webhook

Create one webhook endpoint pointing at:
`https://<YOUR-REF>.supabase.co/functions/v1/stripe-webhook`

Subscribe it to these events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `charge.refunded`   ← **escrow**
- `refund.updated`    ← **escrow** (and optionally `charge.refund.updated`)

Copy the endpoint's **Signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`
(step 2), then redeploy `stripe-webhook` if you set it afterwards.

---

## 6. Supabase Auth configuration
- **URL Configuration** → Site URL = `https://YOUR-DOMAIN`; add Redirect URLs for the prod origin **and** `http://localhost:5173` (so password-reset `redirectTo` is accepted).
- **Confirm email** = **ON** (the app now also enforces an `email_confirmed_at` gate in code, but the project setting is what actually sends the email).
- **SMTP** — configure a provider, otherwise confirmation/reset emails won't send.
- **Bot/Captcha protection** → enable **Cloudflare Turnstile** and paste the secret. Then set `VITE_TURNSTILE_SITE_KEY` (step 7) so the widget renders on login/signup/forgot/reset.

---

## 7. Frontend env + deploy
In `.env.local` (dev) **and** your host's env (Vercel/Cloudflare project settings):
```
VITE_SUPABASE_URL=https://YOUR-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
VITE_TURNSTILE_SITE_KEY=your-turnstile-SITE-key   # blank = captcha off (dev)
```
⚠️ Confirm the `.env.local` currently in the repo (it has a real project ref) was
never committed/pushed; if it was, **rotate** the anon key. Pick **one** deploy
target (Vercel *or* Cloudflare Pages) and dedupe the CSP that's currently
hand-duplicated across `vercel.json` and `public/_headers`.

---

## 8. Make yourself an admin (for the escrow console)
Admin = `profiles.role = 'admin'`. Clients can no longer set `role` (Phase 0), so
do it once via the SQL Editor (service_role):
```sql
update public.profiles set role = 'admin'
 where id = (select id from auth.users where email = 'YOUR-LOGIN-EMAIL');
```
The **Admin → Escrow** nav item and `/app/admin/escrow` then appear for you.

---

## 9. Verification (do this in Stripe **test mode** before real money)

Auth:
- [ ] Sign up → receive confirmation email → confirm → log in.
- [ ] Password reset end-to-end.
- [ ] In devtools, attempt `supabase.from('profiles').update({ role: 'admin' })` → **rejected** (42501).

Subscriptions:
- [ ] Start a trial checkout → webhook lands → a `subscriptions` row appears → dashboard flips to active.
- [ ] In devtools, attempt `supabase.from('projects').insert(...)` with **no** active sub → **rejected** server-side (not just a disabled button).
- [ ] Cancel via Billing Portal → status syncs.
- [ ] Replay a webhook event (`stripe events resend <id>`) → no duplicate/corruption (idempotency ledger).

Escrow:
- [ ] As admin, create an agreement + milestones for a test customer.
- [ ] As that customer, **Fund escrow** → Checkout → webhook marks agreement `funded`, milestones `funded`.
- [ ] As admin, **Release** a milestone (internal) and **Refund** another (Stripe partial refund) → states reconcile; refund appears in Stripe.
- [ ] Confirm a customer cannot read/fund another customer's agreement (try a foreign `agreement_id`).

---

## 10. Known follow-ups (not blockers, but decide before scale)
- **`past_due` grace is unbounded** — `has_active_subscription()` and `hasAccess()` treat `past_due` as full access with no time limit. Decide a grace window (e.g. 7 days) and bound it. *Product decision — left for you.*
- **Legal pages** — `/terms` and `/privacy` are accurate drafts with a "review with counsel" banner and `[PLACEHOLDERS]`. Fill the placeholders and have counsel review before launch.
- **Escrow is escrow-*like*** (you hold your own customers' funds with a refund obligation), **not** neutral third-party custody. Treat captured-but-unreleased funds as deferred revenue / a liability and state refund terms in the engagement contract.
- **Overview demo data** — the dashboard Overview still shows hardcoded sample metrics; replace or feature-flag before customers see it.
- **BACKEND.md drift** — the old runbook references deactivated `starter/pro` plans; this file supersedes it for go-live.
