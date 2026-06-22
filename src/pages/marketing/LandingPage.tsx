import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  ShieldCheck,
  GitBranch,
  Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingCards } from '@/components/marketing/PricingCards';
import { BlueprintGrid } from '@/components/effects';

const FEATURES = [
  {
    icon: Bot,
    title: 'Autonomous agents',
    body: 'ATLAS agents plan, run, and iterate on research workflows end-to-end — no babysitting required.',
  },
  {
    icon: GitBranch,
    title: 'Reproducible runs',
    body: 'Every run is versioned and traceable. Branch, replay, and compare experiments with full lineage.',
  },
  {
    icon: Gauge,
    title: 'Managed compute',
    body: 'Elastic compute pools provisioned for you. Scale from a single run to thousands without ops work.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by default',
    body: 'Row-level isolation, encrypted secrets, and audited access. Your data never trains anyone else’s models.',
  },
];

const STEPS = [
  { n: '01', title: 'Start your trial', body: 'Sign up in seconds and get instant access to the ATLAS platform — no card charged during the trial.' },
  { n: '02', title: 'Spin up a project', body: 'Connect your data and define an objective. ATLAS agents take it from there, running autonomously.' },
  { n: '03', title: 'Ship results', body: 'Review traceable outputs, export findings, and scale to production when you’re ready.' },
];

const READOUT = [
  { k: 'Runs', v: '12,480+' },
  { k: 'Lineage', v: '100%' },
  { k: 'Uptime', v: '99.9%' },
  { k: 'Status', v: 'Operational' },
];

/** Schematic ATLAS pipeline — a Swiss line diagram of the agent loop. */
function AtlasSchematic() {
  const nodes = [
    { label: 'OBJECTIVE' },
    { label: 'PLAN' },
    { label: 'RUN' },
    { label: 'EVALUATE' },
    { label: 'RESULTS' },
  ];
  return (
    <div className="relative overflow-hidden border border-line bg-surface shadow-lab">
      {/* readout header */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="lab-label">FIG.01 — ATLAS AGENT LOOP</span>
        <span className="inline-flex items-center gap-2 lab-label text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-safety animate-pulse-tick" />
          LIVE
        </span>
      </div>

      <div className="px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-8">
          {nodes.map((node, i) => (
            <div key={node.label} className="flex items-center gap-3 sm:gap-4">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={
                    'flex h-10 w-10 items-center justify-center border ' +
                    (i === 2
                      ? 'border-safety bg-safety/[0.06] text-safety'
                      : 'border-ink/30 text-ink')
                  }
                >
                  <span className="font-mono-tech text-xs">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <span className="font-mono-tech text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                  {node.label}
                </span>
              </div>
              {i < nodes.length - 1 && (
                <div className="hidden h-px w-8 bg-line sm:block lg:w-12" />
              )}
            </div>
          ))}
        </div>

        {/* feedback loop caption */}
        <div className="mt-8 flex items-center gap-3 border-t border-dashed border-line pt-5">
          <span className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            ↺ loop continues until objective is met
          </span>
        </div>
      </div>

      {/* readout footer */}
      <div className="grid grid-cols-2 divide-x divide-line border-t border-line sm:grid-cols-4">
        {READOUT.map((r) => (
          <div key={r.k} className="px-5 py-4">
            <p className="lab-label">{r.k}</p>
            <p className="mt-1 font-mono-tech text-sm text-ink">{r.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line px-[5vw] pb-20 pt-32 lg:px-8 lg:pt-40">
        <BlueprintGrid />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 border border-line bg-surface px-3 py-1.5 lab-label">
              <span className="h-1.5 w-1.5 rounded-full bg-safety" />
              Autonomous Labs — now in trial
            </span>

            <h1
              className="mt-7 font-display font-extrabold leading-[0.98] tracking-tight text-ink"
              style={{ fontSize: 'clamp(42px, 6vw, 92px)' }}
            >
              Run autonomous
              <br />
              research at scale.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              contAInuum gives your team the ATLAS platform — autonomous agents,
              managed compute, and reproducible runs — on infrastructure that’s
              secure from the first request.
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-safety px-8 text-white hover:bg-safety/90">
                <Link to="/signup">
                  Start free trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-ink/20 px-8 text-ink hover:bg-panel">
                <Link to="/pricing">View pricing</Link>
              </Button>
            </div>

            <p className="mt-6 lab-label">
              14-DAY TRIAL · NO CARD REQUIRED · CANCEL ANYTIME
            </p>
          </div>

          <AtlasSchematic />
        </div>
      </section>

      {/* ── Platform / Features ───────────────────────────────────────────── */}
      <section id="platform" className="relative px-[5vw] py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 border-b border-line pb-8">
            <div className="max-w-2xl">
              <p className="lab-label text-safety">[ 01 ] THE PLATFORM</p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                Everything ATLAS needs to run itself.
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm text-ink-muted lg:block">
              A managed home for autonomous research — so your team focuses on
              the science, not the infrastructure.
            </p>
          </div>

          <div className="mt-px grid border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="group border-b border-r border-line bg-surface p-8 transition-colors hover:bg-panel"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-ink" strokeWidth={1.5} />
                  <span className="font-mono-tech text-xs text-ink-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="relative border-t border-line bg-panel/50 px-[5vw] py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="lab-label text-safety">[ 02 ] HOW IT WORKS</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            From signup to shipped results in three steps.
          </h2>

          <div className="mt-14 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="bg-surface p-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-5xl font-bold text-safety">{step.n}</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ────────────────────────────────────────────────── */}
      <section className="relative border-t border-line px-[5vw] py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="border-b border-line pb-8 text-center">
            <p className="lab-label text-safety">[ 03 ] PRICING</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Start free. Scale when you’re ready.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-muted">
              Every plan begins with a 14-day free trial. No long-term contracts.
            </p>
          </div>

          <div className="mt-14">
            <PricingCards />
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/pricing"
              className="lab-label text-ink-muted transition-colors hover:text-ink"
            >
              Compare plans in detail ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line bg-ink px-[5vw] py-28 text-center lg:px-8">
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="lab-label text-white/50">[ 04 ] GET STARTED</p>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your lab, running on its own.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Start your free trial today. Payments are handled securely by Stripe —
            we never see your card details.
          </p>
          <Button asChild size="lg" className="mt-10 bg-safety px-8 text-white hover:bg-safety/90">
            <Link to="/signup">
              Start free trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
