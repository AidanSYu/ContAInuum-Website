# contAInuum — Deployment Guide

**What is left to take this from "code complete" to "live for paying customers."**

This is the single source of truth for go-live. It is action-ordered and tells you
**exactly what only you can do** (accounts, keys, domain, legal facts) versus what
the code already handles. For deeper background on any backend invariant, see
`GO_LIVE_RUNBOOK.md` and `BACKEND.md` — this file supersedes them for sequencing.

> Last regenerated: 2026-06-29.

---

## 0. Status at a glance

**Code is done and verified.** `npm run build` is green, `tsc -b` passes, 71 unit
tests pass, ESLint is clean. The five pre-launch code follow-ups are complete:

| # | Item | State |
|---|------|-------|
| 1 | Dashboard demo metrics | ✅ Feature-flagged off (`VITE_SHOW_DEMO_METRICS`); customers see an honest empty state |
| 2 | Legal placeholders | ⏳ Centralized in `src/config/legal.ts` — **needs your facts + counsel** (see §1A, §2J) |
| 3 | CSP duplication | ✅ Deduped to `vercel.json` only |
| 4 | `.env.local` secret | ✅ Verified never committed; anon key is public-by-design — **no rotation** |
| 5 | `past_due` grace | ✅ Bounded to 7 days (migration `0008` + client gate) — **migration must be applied (§2A)** |

**Almost everything remaining is external setup and your facts — not code.** There
are three things only you can resolve, and the rest is a mechanical runbook:

1. **Domain decision** — the repo hardcodes `containuum.io`; your email is `@contineon.com`. Pick one (§1A).
2. **Legal facts + counsel review** — 8 fields in `src/config/legal.ts` + sign-off on the marked clauses (§1A, §2J).
3. **Third-party accounts and their keys** — Supabase (prod), Stripe, Cloudflare Turnstile, Resend, Vercel, domain/email (§1B–§1C).

---

## 1. What I need from YOU (gather all of this first)

> **Go-to-market: Plan A — design-partner / pilot intake.** The public funnel is "Apply for access" → `/contact?topic=partner` (no self-serve signup), and inside the app **self-serve subscription billing is OFF** (`VITE_SELF_SERVE_BILLING` unset). Design-partner pilots are funded through **escrow milestone engagements** (`/app/escrow`), not Stripe subscriptions. Practical effect on this runbook: the Stripe **subscription** price-wiring (§2B) is **optional** until you re-open self-serve — but the Stripe **webhook + escrow** path (§2C–E) is still required, because it's what confirms pilot funding.

### 1.0 The short list — actions ONLY YOU can do (cannot be delegated to me or a dev)

Everything else in §2 is mechanical (CLI/SQL/code) and a developer or I can run it **once you've supplied the inputs below**. These specific actions require *you* — they need account ownership, money, dashboard access, or legal authority:

1. **Create/own the accounts** and accept their terms: Supabase (prod project), Stripe, Cloudflare Turnstile, Resend, Vercel (already linked), domain registrar. *(§1B)*
2. **Enter billing/identity** in Stripe (bank, tax, business details) so you can switch to live mode. *(§4)*
3. **Hand me / the deploy the secret values** from those dashboards — the §1C table. I can't read your dashboards.
4. **Click the dashboard-only toggles** that have no CLI: register the Stripe webhook, **enable the Stripe Customer Portal**, set Supabase Auth (Site URL, Redirect URLs, Confirm-email ON, SMTP, Turnstile secret), add the Vercel env vars + custom domain. *(§2C, §2F, §2H, §4)*
5. **Create the DNS records** at your registrar. *(§2I)*
6. **Decide the domain** (`containuum.io` vs `contineon.com`) and **supply the 8 legal facts**; **get counsel** to sign off the `[REVIEW WITH COUNSEL]` clauses. *(§1A, §2B/J)*
7. **Verify the mailboxes** `hello@`, `security@`, `notifications@` exist and are monitored. *(§2L)*

> Once you give me items 3 + 6, I can do the rest that touches the repo (legal.ts fill, domain replace, function/SQL scripts, cleanup commits). The account/dashboard/DNS/billing/legal actions (1, 2, 4, 5, 7) are yours alone.

### 1A. Decisions only you can make

| Decision | Detail | Blocking? |
|----------|--------|-----------|
| **Production domain** | The repo hardcodes `containuum.io` in `src/components/Seo.tsx`, `public/robots.txt`, all 12 `public/sitemap.xml` entries, and legal/contact pages. Your account email is `development@contineon.com`. **Confirm which domain is real.** If it's `contineon.com`, I must find-and-replace `containuum.io` repo-wide before deploy. | **Yes** |
| **Legal entity facts** | Fill the 8 `null` fields in `src/config/legal.ts` (entity name, address, effective date, governing law, venue, liability-cap period, retention periods, DPO/EU rep). See §2J for the exact field list and examples. | **Yes** |
| **Counsel review** | A lawyer must review/finalize the 8 clauses marked `[REVIEW WITH COUNSEL]` (limitation of liability, indemnification, governing law, arbitration, legal bases, international transfers, children's privacy, lab-content scope). Only then do we remove the `LegalTemplateNotice` banner. | **Yes** |
| **Trial-reminder scheduler** | `trial-reminders` is deployed but needs a daily trigger — Supabase `pg_cron` (in-DB) or an external cron (GitHub Actions, etc.). Pick one (§2G). | No (emails just won't send) |
| **EU/GDPR footprint** | Do you expect EU customers? If so, GDPR Art. 27 may require an EU representative / DPO (the `dpoOrEuRepresentative` field). | No |
| **Demo metrics in prod** | Already decided: leave `VITE_SHOW_DEMO_METRICS` **unset** in production. Only set `=true` in a separate sales-demo environment. | No |
| **Grace window** | Already decided: **7 days**. To change later, edit `PAST_DUE_GRACE_DAYS` in `src/lib/api/subscriptions.ts` **and** `interval '7 days'` in migration `0008` (keep them in sync). | No |

### 1B. Accounts you must have

| Service | Why | Needed for |
|---------|-----|-----------|
| **Supabase** (production project) | DB, auth, edge functions | Core app — **blocking** |
| **Stripe** | Subscriptions + escrow payments | Revenue — **blocking** |
| **Cloudflare Turnstile** | Captcha on public/auth forms | Bot protection — blocking *if* you want captcha (all-or-nothing, see gotchas) |
| **Resend** | Transactional email (contact, newsletter double opt-in, trial reminders, auth emails) | Email delivery — non-blocking for core flows |
| **Vercel** | Frontend hosting | Already linked (`.vercel/project.json` → project `cont-ai-nuum-website`) |
| **Domain registrar + email** | DNS + mailboxes `hello@`, `security@`, `notifications@` | Domain + branded email — blocking for go-live |

### 1C. Values to collect (master table)

Collect every value below before starting §2. "Where it goes" tells you which store.

| Value | Where you get it | Where it goes |
|-------|------------------|---------------|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | **Vercel** env (Production) |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon/public key | **Vercel** env (Production) |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare → Turnstile → your site → **Site** key (public) | **Vercel** env (Production) |
| `VITE_SELF_SERVE_BILLING` | Leave **unset** (Plan A: self-serve checkout off; pilots funded via escrow). Set `=true` only to re-open self-serve. | **Vercel** env (Production) |
| `VITE_SHOW_DEMO_METRICS` | Leave **unset** for customers (demo numbers off). `=true` only for sales-demo builds. | **Vercel** env (Production) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → Secret key (`sk_test_…` then `sk_live_…`) | **Supabase** secret |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → your endpoint → Signing secret (`whsec_…`) — **only exists after §2C** | **Supabase** secret |
| `TURNSTILE_SECRET_KEY` | Cloudflare → Turnstile → your site → **Secret** key (≠ site key) | **Supabase** secret |
| `RESEND_API_KEY` | Resend → API Keys | **Supabase** secret |
| `EMAIL_FROM` | A Resend-verified sender, e.g. `notifications@<domain>` | **Supabase** secret |
| `CONTACT_NOTIFY_EMAIL` | Inbox that receives contact-form mail, e.g. `hello@<domain>` | **Supabase** secret |
| `SITE_URL` | Your production URL, e.g. `https://containuum.io` | **Supabase** secret |
| `ALLOWED_ORIGINS` | `https://<domain>,https://www.<domain>` (CORS allowlist; optional — falls back to `SITE_URL`) | **Supabase** secret |
| `CRON_SECRET` | Generate: `openssl rand -hex 32` | **Supabase** secret **+** your cron scheduler header |
| `solo` / `lab` Stripe Price IDs | Stripe → Products → each Price (`price_…`) | **DB** via `wire-stripe-prices.sql` — **only if re-opening self-serve** (Plan A funds pilots via escrow) |
| 8 legal facts | You + counsel | `src/config/legal.ts` |

> **Auto-injected, do NOT set:** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected into every Edge Function by Supabase. Never put them in Vercel and never prefix with `VITE_`.
>
> **Never set in production:** `ALLOW_INSECURE_NO_CAPTCHA` — it disables captcha verification and auto-allows localhost CORS. Its absence is the secure default.

---

## 2. The deployment runbook (do these in order)

Prereqs: install the Supabase CLI and the Stripe CLI; run `supabase link --project-ref <YOUR-PROJECT-REF>`
(find the ref in Supabase → Project Settings → General). **Do the whole sequence in Stripe TEST mode first**, verify with §3, then repeat the Stripe-specific steps in live mode (§4).

### A. Apply the database schema
Applies all migrations **including `0008_past_due_grace`** (the `past_due_since` column + the 7-day bounded `has_active_subscription()`); without it the client gate and DB gate disagree.

```bash
supabase db push
```
*Alternative (no CLI):* paste `supabase/PROVISION_ALL.sql` into Supabase Studio → SQL Editor → Run. It already includes migrations through `0009` (`0008` past_due grace + `0009` contact topic) and is safe to re-run.

The `plans` catalog (Solo / Lab / Institute) is seeded by migrations `0002` + `0003` automatically. **Do not run `_seed.mjs` in production** — it creates local test users only.

*(Optional)* re-sync the hand-maintained types after migrating:
```bash
supabase gen types typescript --linked > src/lib/database.types.ts
```
(The file already includes `past_due_since`; only regenerate if you change the schema further.)

### B. Create Stripe Products/Prices and wire them into the DB
> **Plan A: optional / skip for launch.** Self-serve subscription checkout is off, so pilots don't hit this path — they're funded via escrow (§2C–E). Do this step only when you re-open self-serve (`VITE_SELF_SERVE_BILLING=true`).

After a clean migration, `plans.stripe_price_id` is **NULL**, and self-serve checkout returns *"This plan is not purchasable yet"* until wired.

1. Stripe → Products → create two **recurring monthly** prices: **Solo $59/mo**, **Lab $329/mo**. Copy each `price_…` ID. **Do not set a Stripe trial** — the 14-day trial is driven by `plans.trial_days` in the DB.
2. Edit `supabase/scripts/wire-stripe-prices.sql`, replacing `price_REPLACE_WITH_SOLO_PRICE_ID` / `price_REPLACE_WITH_LAB_PRICE_ID` with the real IDs.
3. Run it in Supabase Studio → SQL Editor. Leave **Institute** `NULL` (it's sales-led → routes to `/contact`).
4. Verify: `SELECT id, name, trial_days, stripe_price_id, is_active FROM public.plans ORDER BY sort_order;`

### C. Register the Stripe webhook
Stripe → Developers → Webhooks → **Add endpoint**:

- **Endpoint URL:** `https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/stripe-webhook`
- **Events to enable** (verbatim from the handler's `switch`):
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `customer.subscription.trial_will_end`
  - `charge.refunded`
  - `refund.updated`

After saving, copy the **Signing secret** (`whsec_…`) → this is `STRIPE_WEBHOOK_SECRET` in step D.
*(The code also defensively handles `charge.refund.updated` if your account emits it — no need to register it.)*

### D. Set all Supabase Edge Function secrets
Edge Functions cannot read `.env` files. Set them via CLI (one atomic command):

```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_WEBHOOK_SECRET=whsec_...        # from step C \
  SITE_URL=https://<domain> \
  ALLOWED_ORIGINS=https://<domain>,https://www.<domain> \
  TURNSTILE_SECRET_KEY=<cloudflare-turnstile-SECRET> \
  RESEND_API_KEY=re_... \
  EMAIL_FROM=notifications@<domain> \
  CONTACT_NOTIFY_EMAIL=hello@<domain> \
  CRON_SECRET=$(openssl rand -hex 32)    # save this value for step G
```

### E. Deploy the Edge Functions
There are 9. Two **must** be deployed `--no-verify-jwt` (their callers send no Supabase JWT):

```bash
supabase functions deploy contact
supabase functions deploy newsletter-subscribe
supabase functions deploy newsletter-confirm        --no-verify-jwt   # public GET from email link
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy create-escrow-payment
supabase functions deploy escrow-admin
supabase functions deploy trial-reminders                              # protected by CRON_SECRET header
supabase functions deploy stripe-webhook            --no-verify-jwt    # Stripe is the caller
```
> If you set `STRIPE_WEBHOOK_SECRET` *after* a first deploy, redeploy `stripe-webhook`.

### F. Configure Supabase Auth (dashboard)
Supabase → Authentication:

- **URL Configuration → Site URL:** `https://<domain>`
- **Redirect URLs:** add `https://<domain>/**`, `https://www.<domain>/**`, and `http://localhost:5173/**` (dev password resets). The reset flow uses `window.location.origin + /reset-password`.
- **Email → Confirm email: ON.** (Local `config.toml` disables it for the Docker stack only; production must require confirmation — the `RequireAuth` gate checks `email_confirmed_at`.)
- **SMTP (recommended):** point auth emails at Resend — Host `smtp.resend.com`, Port `465`, User `resend`, Password = your Resend SMTP key, Sender = a verified address on `<domain>`. Without custom SMTP, Supabase's built-in sender is rate-limited and unbranded.
- **Bot & Abuse Protection:** enable Cloudflare Turnstile, paste the **Turnstile secret** (the **site** key goes in Vercel).

### G. Schedule the trial-reminders cron
Pick one:

**Supabase pg_cron** — Database → Extensions → enable `pg_cron` (and `pg_net`), then SQL Editor:
```sql
select cron.schedule(
  'daily-trial-reminders', '0 9 * * *',          -- 09:00 UTC daily
  $$ select net.http_post(
       url := 'https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/trial-reminders',
       headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','<your CRON_SECRET>'),
       body := '{}'
     ); $$
);
```
**Or external cron** (GitHub Actions, etc.) that POSTs to that URL with the `x-cron-secret` header.
> No separate "grace-expiry" job is needed — `past_due` access cutoff is evaluated inline on every request by the gate.

### H. Vercel — set env vars and deploy
Vercel → Project `cont-ai-nuum-website` → Settings → Environment Variables (**Production**):

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_TURNSTILE_SITE_KEY`
- **Do NOT set** `VITE_SHOW_DEMO_METRICS` (leave unset = demo data off).

> `VITE_*` values are **baked in at build time** — after changing any, trigger a fresh deploy. Then deploy (push to the production branch, or `vercel deploy --prod`).

### I. Custom domain + DNS
1. Vercel → Settings → Domains → add `<domain>` and `www.<domain>`; pick the canonical one (apex is conventional).
2. At your DNS provider, add the records **Vercel shows you** — typically apex `A → 76.76.21.21` (or `ALIAS/ANAME → cname.vercel-dns.com`) and `www CNAME → cname.vercel-dns.com`.
3. Wait for HTTPS to verify on **both** hosts before considering HSTS preload (the CSP already ships `Strict-Transport-Security … preload`; only submit to hstspreload.org once HTTPS is confirmed — it's hard to reverse).

### J. Legal — fill facts, counsel review, then remove the banner
Edit `src/config/legal.ts` and replace each `null`:

| Field | Example |
|-------|---------|
| `entityName` | `ContAInuum Inc.` |
| `registeredAddress` | `1234 Lab Lane, Suite 100, Wilmington, DE 19801, USA` |
| `effectiveDate` | `June 29, 2026` |
| `governingLaw` | `the State of Delaware, USA` *(counsel)* |
| `venue` | `New Castle County, Delaware` *(counsel)* |
| `liabilityCapPeriod` | `12 months` *(counsel)* |
| `retentionPeriods` | `Account data … life of account + 90 days; payment records 7 years; logs 30 days.` *(counsel)* |
| `dpoOrEuRepresentative` | EU rep/DPO sentence, or `''`/"none" if not required *(counsel)* |

`hostingProvider` (`Vercel`) and `contactEmail` (`hello@…`) are already set. Once a value is filled, the page renders it instead of the `[PLACEHOLDER]`.

**Then, after counsel signs off the `[REVIEW WITH COUNSEL]` clauses:** remove `<LegalTemplateNotice />` from `src/pages/marketing/TermsPage.tsx` and `PrivacyPage.tsx` (it's at the top of each). Filling the facts does **not** remove the banner — that's a deliberate manual gate.

### K. Promote yourself to admin (for the escrow console)
Role can't be self-assigned (revoked in migration `0005`). Run once in SQL Editor:
```sql
update public.profiles set role = 'admin'
 where id = (select id from auth.users where email = 'YOUR-LOGIN-EMAIL');
```

### L. Cleanup
- Delete `wrangler.jsonc` (dead Cloudflare Pages config — now fully on Vercel). Harmless but misleading.
- Verify mailboxes are live and monitored: `hello@<domain>`, `security@<domain>`, and the `notifications@<domain>` sender (set up SPF/DKIM/DMARC in Resend so mail isn't flagged spam).

---

## 3. Verify before announcing

### Automated (run locally)
```bash
npm run build          # tsc -b + vite build — must be green (Vercel runs this too)
npm run lint
npm run test           # 71 unit tests, no Docker needed
# Integration (needs Docker + local Supabase):
npm run itest:up && npm run test:integration && npm run itest:down
```

### Local Stripe webhook loop (optional pre-prod check)
```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
stripe trigger checkout.session.completed
```
(The CLI prints a temporary `whsec_…` for local use — different from the production endpoint secret.)

### Manual smoke test (production, test-mode Stripe)
1. **Signup → confirm.** Create an account → confirmation email arrives (Resend) → click link → land in `/app`.
2. **Trial start.** Choose Solo/Lab → Stripe Checkout (test card `4242 4242 4242 4242`) → redirected to `/app/billing?checkout=success` → badge shows **Trial · 14d** within a second or two (webhook sync).
3. **Access granted.** `/app/projects` loads; you can create a project (RLS `has_active_subscription` passes).
4. **Overview empty state.** With `VITE_SHOW_DEMO_METRICS` unset, `/app` shows **"No active campaigns yet"**, not the demo stat cards.
5. **Billing portal.** `/app/billing` → "Manage" opens the Stripe portal → cancel → returns to `/app/billing`.
6. **`past_due` 7-day grace.** In SQL Editor: `update public.subscriptions set status='past_due', past_due_since = now() - interval '8 days' where user_id='<test-uuid>';` → reload `/app/projects` → you're redirected to `/app/billing` (access denied). Set `past_due_since = now() - interval '2 days'` → access restored. **Restore the row afterward.**
7. **Escrow** (admin). Fund an agreement via Checkout → webhook marks it `funded`; release one milestone, refund another → states reconcile and the refund shows in Stripe.
8. **Contact + Turnstile.** Submit the contact form → captcha solves → `CONTACT_NOTIFY_EMAIL` receives it.
9. **Newsletter double opt-in.** Subscribe → confirmation email → click → status becomes confirmed.
10. **Webhook idempotency.** In Stripe, "Resend" a past event → Edge logs (`supabase functions logs stripe-webhook`) show a duplicate/stale no-op, no state change.

---

## 4. Test-mode → live-mode cutover (Stripe)

Test and live are fully separate in Stripe. Repeat, in this order, with **live** credentials:
1. Create live Products/Prices → copy live `price_…` IDs.
2. Re-run the `UPDATE plans …` SQL (or `wire-stripe-prices.sql`) with the live IDs.
3. Register the **live** webhook endpoint → copy the live `whsec_…`.
4. `supabase secrets set STRIPE_SECRET_KEY=sk_live_… STRIPE_WEBHOOK_SECRET=whsec_…(live)` and redeploy `stripe-webhook`.
5. Enable the **Customer Portal in live mode** (Stripe → Settings → Billing → Customer portal — it's off by default and must be enabled in *each* mode; `create-portal-session` errors if it isn't).
6. Run one real-card purchase end-to-end before announcing.

---

## 5. Go-live checklist

**Blocking — must be done:**
- [ ] Domain confirmed (`containuum.io` vs `contineon.com`); repo updated if needed (§1A, §2I)
- [ ] `supabase db push` applied incl. migrations `0008` (past_due grace) + `0009` (contact topic) (§2A)
- [ ] Stripe webhook registered with the 7 events; `STRIPE_WEBHOOK_SECRET` set (§2C–D)
- [ ] All Supabase secrets set (§2D); all 9 functions deployed with correct `--no-verify-jwt` flags (§2E)
- [ ] Supabase Auth: Site URL, Redirect URLs, **Confirm email ON**, SMTP, Turnstile secret (§2F)
- [ ] Vercel `VITE_*` env set; `VITE_SELF_SERVE_BILLING` + `VITE_SHOW_DEMO_METRICS` **left unset**; production deploy succeeded (§2H)
- [ ] _(Self-serve only — skip for Plan A)_ Stripe Solo/Lab prices created and wired into `plans` (§2B)
- [ ] Custom domain + DNS live over HTTPS on apex and www (§2I)
- [ ] `src/config/legal.ts` all 8 facts filled; counsel reviewed `[REVIEW WITH COUNSEL]` clauses; banner removed (§2J)
- [ ] Stripe **Customer Portal enabled** (test + live) (§4)
- [ ] Mailboxes live: `hello@`, `security@`, `notifications@` with SPF/DKIM/DMARC (§2L)
- [ ] Manual smoke test §3 passes end-to-end on production

**Recommended / non-blocking:**
- [ ] Trial-reminders cron scheduled (§2G)
- [ ] Admin role granted to your account (§2K)
- [ ] `wrangler.jsonc` deleted (§2L)
- [ ] Escrow accounting treatment confirmed (deferred-revenue liability; refund terms in engagement contracts)
- [ ] EU/GDPR: DPO/EU-rep decision recorded in `legal.ts`
- [ ] `BACKEND.md` refreshed or archived (it references the old starter/pro plan names)

---

## Appendix — top gotchas (the things that silently break)

- **`stripe-webhook` and `newsletter-confirm` must deploy `--no-verify-jwt`** — otherwise their callers get 401 and subscriptions never activate / email confirmations never land.
- **`STRIPE_WEBHOOK_SECRET` is chicken-and-egg** — it only exists after you register the endpoint (§2C). Set the other secrets first, register, then set it and redeploy `stripe-webhook`.
- **NULL `stripe_price_id`** = *"This plan is not purchasable yet."* The #1 silent launch failure. Wire prices (§2B).
- **Stripe Customer Portal is off by default** and must be enabled separately in test and live mode, or `create-portal-session` throws.
- **Site key ≠ secret key** — `VITE_TURNSTILE_SITE_KEY` (public, in Vercel) and `TURNSTILE_SECRET_KEY` (private, in Supabase) are two different Cloudflare keys. Turnstile is all-or-nothing: set both, or neither (unset site key = captcha disabled).
- **`VITE_*` are build-time** — change them in Vercel ⇒ redeploy, or the change does nothing.
- **Trial length is DB-driven** (`plans.trial_days = 14`), not a Stripe setting — don't add a trial to the Stripe price.
- **The 7-day grace lives in two places** that must match: `PAST_DUE_GRACE_DAYS` (`src/lib/api/subscriptions.ts`) and `interval '7 days'` (migration `0008`).
- **Never set `ALLOW_INSECURE_NO_CAPTCHA` in production** — it disables captcha and opens localhost CORS.
- **`PROVISION_ALL.sql` currently bundles through `0009`.** If you add `0010+`, prefer `supabase db push`; the bundle would be stale.
