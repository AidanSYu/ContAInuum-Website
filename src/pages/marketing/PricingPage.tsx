import { Fragment } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listPlans, planFeatures, type Plan } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { cn } from '@/lib/utils';

/* =============================================================================
   PricingPage — cinematic hero + plan cards + comparison + CTA band.

   Single source of truth: plans render from the live `plans` catalog
   (`listPlans`, the SAME source the in-app billing page uses), so the price a
   visitor is quoted is the price they're billed against. If the backend isn't
   reachable, we fall back to a static catalog that MIRRORS the seed
   (supabase/migrations/0003_pricing_realign.sql) — the page is never empty and
   never contradicts billing.

   Annual billing is intentionally not a toggle here: the billing schema models
   a single monthly Stripe price per plan, so an annual figure would be a number
   we can't actually charge. We surface annual as a sales note instead.
   ============================================================================= */

/** Normalized shape the card renderer consumes (from DB or fallback). */
type PricingTier = {
  id: string;
  name: string;
  description: string;
  amountCents: number;
  interval: string;
  trialDays: number;
  features: string[];
};

/** Mirrors 0003_pricing_realign.sql — used only when the live catalog is
    unavailable, so the page stays populated and consistent with billing. */
const FALLBACK_TIERS: PricingTier[] = [
  {
    id: 'solo',
    name: 'Solo',
    description: 'For a single scientist retrofitting one bench.',
    amountCents: 5900,
    interval: 'month',
    trialDays: 14,
    features: ['1 active campaign', 'Cross-campaign memory', 'Human handoff via email', 'Recipe & failure-mode library', 'Community support'],
  },
  {
    id: 'lab',
    name: 'Lab',
    description: 'For a group running ATLAS across the bench.',
    amountCents: 32900,
    interval: 'month',
    trialDays: 14,
    features: ['10 active campaigns', 'Shared knowledge graph & lab lore', 'Slack / mobile handoff', 'Drift detection & alerts', 'Run history, lineage & exports', 'Priority support'],
  },
  {
    id: 'institute',
    name: 'Institute',
    description: 'Multi-lab deployments with governance.',
    amountCents: 0,
    interval: 'month',
    trialDays: 14,
    features: ['Unlimited campaigns & seats', 'Federated learning (early access)', 'SSO / SAML & audit log', 'Dedicated compute', 'SLA & named success engineer'],
  },
];

function toTier(plan: Plan): PricingTier {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description ?? '',
    amountCents: plan.amount_cents,
    interval: plan.interval,
    trialDays: plan.trial_days,
    features: planFeatures(plan),
  };
}

function priceDisplay(t: PricingTier): string {
  if (t.amountCents === 0) return 'Custom';
  const amount = t.amountCents / 100;
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

const CMP_GROUPS = [
  {
    group: 'Autonomy',
    rows: [
      ['Active campaigns', '1', '10', 'Unlimited'],
      ['Agent runs / month', '200', '5,000', 'Custom'],
      ['Human-as-actuator handoff', 'Email', 'Slack / mobile', 'All channels'],
    ],
  },
  {
    group: 'Memory',
    rows: [
      ['Cross-campaign carry-over', '✓', '✓', '✓'],
      ['Shared lab knowledge graph', '—', '✓', '✓'],
      ['Federated learning', '—', '—', 'Early access'],
    ],
  },
  {
    group: 'Trust & governance',
    rows: [
      ['Drift detection & alerts', '—', '✓', '✓'],
      ['SSO / SAML & audit', '—', '—', '✓'],
      ['Support', 'Community', 'Priority', 'Named engineer'],
    ],
  },
];

const VEIL_HERO =
  'linear-gradient(180deg, rgba(8,10,14,.78) 0%, rgba(8,10,14,.5) 45%, rgba(8,10,14,.9) 100%)';
const VEIL_CTA = 'linear-gradient(180deg, rgba(8,10,14,.6), rgba(8,10,14,.9))';

function Cell({ v }: { v: string }) {
  if (v === '✓') return <span className="font-semibold text-safety">✓</span>;
  return <span>{v}</span>;
}

function PlanCard({ tier, featured }: { tier: PricingTier; featured: boolean }) {
  const isEnterprise = tier.amountCents === 0;
  const href = isEnterprise ? '/contact?topic=enterprise' : '/contact?topic=partner';
  const cta = isEnterprise ? 'Talk to us' : 'Apply for access';
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border bg-surface p-8',
        featured ? 'border-safety shadow-[0_0_0_1px_var(--safety),0_30px_70px_-40px_rgba(255,77,46,.6)]' : 'border-line',
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-safety px-3 py-1 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white">
          Most labs
        </span>
      )}
      <h3 className="text-[22px] font-bold text-ink">{tier.name}</h3>
      <p className="mb-5 mt-2.5 min-h-[42px] text-sm leading-snug text-ink-muted">{tier.description}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-[46px] font-extrabold tracking-tight text-ink">
          {priceDisplay(tier)}
        </span>
        {!isEnterprise && <span className="text-sm text-ink-muted">/{tier.interval}</span>}
      </div>
      <p className={cn('mt-2 font-mono-tech text-[10px] uppercase tracking-[0.12em] text-ink-faint', isEnterprise && 'invisible')}>
        Indicative — pilots scoped individually
      </p>
      <ul className="my-6 flex-1 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-sm leading-snug text-ink-muted">
            <Check className="h-4 w-4 flex-none text-safety" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className={cn(
          'inline-flex w-full items-center justify-center gap-2 rounded px-5 py-3 text-sm font-medium transition-colors',
          featured ? 'bg-safety text-white hover:bg-safety/90' : 'bg-ink text-paper hover:opacity-90',
        )}
      >
        {cta}
      </a>
    </div>
  );
}

export function PricingPage() {
  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: listPlans });

  // Live catalog when available; otherwise the seed-mirroring fallback.
  const tiers: PricingTier[] = plans?.length ? plans.map(toTier) : FALLBACK_TIERS;
  // Highlight the middle tier (the "Lab" plan by sort order).
  const featuredIdx = Math.min(1, tiers.length - 1);

  return (
    <>
      <Seo
        title="Pricing — contAInuum"
        description="Indicative plans for retrofitting your lab with ATLAS. We’re onboarding a limited cohort of design-partner labs — apply for access and we’ll scope a pilot for your bench."
        path="/pricing"
      />

      {/* cinematic hero */}
      <section className="relative overflow-hidden border-b border-line text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('/images/atlas-vision-overlay.jpg')" }} />
        <div className="absolute inset-0" style={{ background: VEIL_HERO }} />
        <div className="relative z-10 mx-auto max-w-7xl px-[5vw] pb-[clamp(48px,6vw,72px)] pt-[150px] text-center lg:px-8">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/5 px-4 py-1.5 font-mono-tech text-[11px] uppercase tracking-[0.2em] text-white/85">
            <span className="h-1.5 w-1.5 rounded-full bg-safety" /> Pricing
          </span>
          <h1 className="mt-6 font-display text-[clamp(36px,5vw,66px)] font-extrabold uppercase leading-none tracking-tight">
            Pay for campaigns,
            <br />
            not for a rebuild.
          </h1>
          <p className="mx-auto mt-5 max-w-[36rem] text-lg text-white/80">
            We’re onboarding a limited cohort of design-partner labs. The tiers below are indicative —
            pilots are scoped individually and run on the instruments you already have.
          </p>
          <p className="mx-auto mt-4 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-white/45">
            Apply for access and we’ll scope an early-partner pilot for your lab.
          </p>
        </div>
      </section>

      {/* plans */}
      <section className="px-[5vw] pt-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-5 pb-12 md:grid-cols-3">
          {tiers.map((t, i) => (
            <PlanCard key={t.id} tier={t} featured={i === featuredIdx} />
          ))}
        </div>
      </section>

      {/* comparison */}
      <section className="px-[5vw] pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="lab-label mb-4.5 text-safety">Compare in detail</p>
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-line px-5 py-4 text-left font-display text-[15px] font-semibold text-ink">Capability</th>
                  <th className="border-b border-line px-5 py-4 text-center font-display text-[15px] font-semibold text-ink">Solo</th>
                  <th className="border-b border-line px-5 py-4 text-center font-display text-[15px] font-semibold text-safety">Lab</th>
                  <th className="border-b border-line px-5 py-4 text-center font-display text-[15px] font-semibold text-ink">Institute</th>
                </tr>
              </thead>
              <tbody>
                {CMP_GROUPS.map((g) => (
                  <Fragment key={g.group}>
                    <tr>
                      <td colSpan={4} className="bg-panel px-5 py-2.5 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                        {g.group}
                      </td>
                    </tr>
                    {g.rows.map((r) => (
                      <tr key={r[0]}>
                        <th className="border-b border-line px-5 py-4 text-left text-sm font-medium text-ink">{r[0]}</th>
                        <td className="border-b border-line px-5 py-4 text-center text-sm text-ink-muted"><Cell v={r[1]} /></td>
                        <td className="border-b border-line px-5 py-4 text-center text-sm text-ink-muted"><Cell v={r[2]} /></td>
                        <td className="border-b border-line px-5 py-4 text-center text-sm text-ink-muted"><Cell v={r[3]} /></td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* guarantees — honest trust signals at the decision point */}
      <section className="px-[5vw] pb-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {[
            ['Runs on your instruments', 'No rip-and-replace. ATLAS retrofits the workcell you already operate.'],
            ['Scoped & milestone-funded', 'Pilots are fixed-scope. You fund milestones as they’re agreed — not a subscription up front.'],
            ['Hands-on onboarding', 'We set ATLAS up with your team and stay close through the pilot.'],
            ['No lock-in', 'Your knowledge graph and run history export with you if you leave.'],
          ].map(([h, p]) => (
            <div key={h} className="bg-surface px-6 py-7">
              <h3 className="font-display text-base font-semibold text-ink">{h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* closing CTA band */}
      <section className="relative overflow-hidden border-t border-line text-center text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.42]" style={{ backgroundImage: "url('/images/thesis-lone-figure.jpg')" }} />
        <div className="absolute inset-0" style={{ background: VEIL_CTA }} />
        <div className="relative z-10 mx-auto max-w-7xl px-[5vw] py-[clamp(64px,9vw,112px)] lg:px-8">
          <p className="font-mono-tech text-[11px] uppercase tracking-[0.24em] text-white/50">[ Get started ]</p>
          <h2 className="mx-auto mt-4 max-w-[18ch] font-display text-[clamp(30px,4.6vw,60px)] font-extrabold uppercase leading-none tracking-tight">
            The next campaign starts where the last one left off.
          </h2>
          <p className="mx-auto mt-4.5 max-w-[34rem] leading-relaxed text-white/70">
            We onboard a few labs at a time. Apply for the design-partner program and we’ll scope a pilot for your bench.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <a href="/contact?topic=partner" className="inline-flex items-center gap-2 rounded-[2px] border border-white bg-white px-7 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.2em] text-[#0D0F13] transition-colors hover:bg-transparent hover:text-white">
              Apply for access <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/contact?topic=demo" className="inline-flex items-center gap-2 rounded-[2px] border border-white/50 px-7 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-[#0D0F13]">
              Book a demo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
