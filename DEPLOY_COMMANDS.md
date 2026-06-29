# contAInuum — Deploy Command Sheet

A tight, ordered, copy-paste sequence for the external provisioning in
`GO_LIVE_RUNBOOK.md`. Run top-to-bottom. Replace every `<…>` placeholder.
Do the whole thing in **Stripe test mode** first, then repeat with live keys.

Prereqs: `supabase` CLI, `stripe` CLI, repo checked out, logged into both.

---

## 0. Link the Supabase project (once)

```bash
supabase login
supabase link --project-ref <YOUR-PROJECT-REF>
```

## 1. Database — apply migrations 0001 → 0008

```bash
supabase db push
# Then regenerate types so codegen stays in sync:
supabase gen types typescript --linked > src/lib/database.types.ts
```
Non-CLI alternative: paste `supabase/PROVISION_ALL.sql` into Studio → SQL Editor
(idempotent, spans 0001 → 0008).

## 2. Edge Function secrets

`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are auto-injected — do NOT set them.
Set `STRIPE_WEBHOOK_SECRET` after step 5 (register webhook first), then redeploy.

```bash
supabase secrets set \
  STRIPE_SECRET_KEY=<sk_test_…> \
  SITE_URL=https://<YOUR-DOMAIN> \
  ALLOWED_ORIGINS=https://<YOUR-DOMAIN>,https://www.<YOUR-DOMAIN> \
  TURNSTILE_SECRET_KEY=<turnstile-secret> \
  RESEND_API_KEY=<resend-key> \
  EMAIL_FROM=notifications@<YOUR-DOMAIN> \
  CONTACT_NOTIFY_EMAIL=hello@<YOUR-DOMAIN> \
  CRON_SECRET=$(openssl rand -hex 32)
```
⚠️ Do NOT set `ALLOW_INSECURE_NO_CAPTCHA` in production.

## 3. Deploy all 9 Edge Functions

```bash
supabase functions deploy contact
supabase functions deploy newsletter-subscribe
supabase functions deploy newsletter-confirm
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy create-escrow-payment
supabase functions deploy escrow-admin
supabase functions deploy trial-reminders
supabase functions deploy stripe-webhook --no-verify-jwt   # ⚠️ ONLY this one
```

## 4. Stripe — prices, then wire them back (the #1 silent-failure trap)

1. In the Stripe Dashboard create two **recurring monthly** prices:
   - Solo — $59/mo → copy `price_…`
   - Lab — $329/mo → copy `price_…`
   - Institute stays sales-led (leave its `stripe_price_id` NULL).
2. Edit `supabase/scripts/wire-stripe-prices.sql` with the two ids and run it in
   the SQL Editor. Verify nothing important is still NULL:
   ```sql
   select id, stripe_price_id from public.plans order by id;
   ```
3. Enable the **Billing Portal**: Stripe → Settings → Billing → Customer portal.

## 5. Stripe — register the webhook

Endpoint: `https://<YOUR-REF>.supabase.co/functions/v1/stripe-webhook`
Subscribe to:
```
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
customer.subscription.trial_will_end
charge.refunded          # escrow
refund.updated           # escrow
```
Copy the signing secret, then:
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=<whsec_…>
supabase functions deploy stripe-webhook --no-verify-jwt   # redeploy to pick it up
```
Local webhook testing:
```bash
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

## 6. Supabase Auth (Dashboard → Authentication)

- URL Configuration → Site URL = `https://<YOUR-DOMAIN>`; add Redirect URLs for
  the prod origin **and** `http://localhost:5173`.
- Email → **Confirm email = ON**.
- Configure **SMTP** (else confirmation/reset emails won't send).
- Enable **Cloudflare Turnstile** bot protection; paste the secret.

## 7. Frontend env + deploy (Vercel)

Set in Vercel → Project → Settings → Environment Variables:
```
VITE_SUPABASE_URL=https://<YOUR-REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-publishable-key>
VITE_TURNSTILE_SITE_KEY=<turnstile-SITE-key>
VITE_SHOW_DEMO_METRICS=          # leave blank in prod (demo stats stay hidden)
```
Then deploy (push to the connected branch, or `vercel --prod`).

## 8. Make yourself admin (escrow console)

```sql
update public.profiles set role = 'admin'
 where id = (select id from auth.users where email = '<YOUR-LOGIN-EMAIL>');
```

## 9. Verify in test mode (see GO_LIVE_RUNBOOK.md §9 for the full checklist)

- Sign up → confirm email → log in.
- Devtools: `supabase.from('profiles').update({ role: 'admin' })` → rejected (42501).
- Start trial checkout → webhook lands → `subscriptions` row → dashboard active.
- Devtools: `supabase.from('projects').insert(...)` with no active sub → rejected server-side.
- Replay a webhook (`stripe events resend <id>`) → no duplicate (idempotency ledger).
- Escrow: fund → release → partial refund reconciles; foreign `agreement_id` denied.

---

### Still TODO in code before public launch (not external)
- `src/config/legal.ts` — fill the `null` legal facts (entity, address, governing
  law, venue, effective date, retention) and have counsel review the
  `[REVIEW WITH COUNSEL]` clauses. Placeholders stay visible until filled.
</content>
