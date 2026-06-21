import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  ShieldCheck,
  GitBranch,
  Gauge,
  FlaskConical,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingCards } from '@/components/marketing/PricingCards';
import { DustParticles } from '@/components/effects';

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

export function LandingPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[5vw] text-center">
        <DustParticles />
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-[140px]"
          style={{ background: 'radial-gradient(circle, #FF4D2E 0%, transparent 65%)' }}
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 font-mono-tech text-[11px] uppercase tracking-[0.2em] text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-safety" />
            Autonomous Labs — now in trial
          </span>

          <h1
            className="mt-8 font-display font-extrabold leading-[0.95] tracking-tight text-text-primary"
            style={{ fontSize: 'clamp(44px, 7vw, 104px)' }}
          >
            Run autonomous
            <br />
            research at scale.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            contAInuum gives your team the ATLAS platform — autonomous agents,
            managed compute, and reproducible runs — on infrastructure that’s
            secure from the first request.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-safety px-8 text-white hover:bg-safety/90">
              <Link to="/signup">
                Start free trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 px-8">
              <Link to="/pricing">View pricing</Link>
            </Button>
          </div>

          <p className="mt-5 font-mono-tech text-xs uppercase tracking-[0.15em] text-text-secondary/60">
            14-day trial · no card required to start · cancel anytime
          </p>
        </div>
      </section>

      {/* ── Platform / Features ───────────────────────────────────────────── */}
      <section id="platform" className="relative border-t border-white/10 px-[5vw] py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-safety">The platform</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-text-primary sm:text-5xl">
              Everything ATLAS needs to run itself.
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              A managed home for autonomous research — so your team focuses on the
              science, not the infrastructure.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-void p-8 transition-colors hover:bg-void-lifted/40">
                <Icon className="h-7 w-7 text-safety" />
                <h3 className="mt-5 font-display text-xl font-semibold text-text-primary">{title}</h3>
                <p className="mt-2 leading-relaxed text-text-secondary">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="relative border-t border-white/10 px-[5vw] py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-5 w-5 text-safety" />
            <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-safety">How it works</p>
          </div>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold text-text-primary sm:text-5xl">
            From signup to shipped results in three steps.
          </h2>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="relative">
                <div className="font-display text-5xl font-bold text-white/10">{step.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-text-secondary">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ────────────────────────────────────────────────── */}
      <section className="relative border-t border-white/10 px-[5vw] py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-safety">Pricing</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-text-primary sm:text-5xl">
              Start free. Scale when you’re ready.
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Every plan begins with a 14-day free trial. No long-term contracts.
            </p>
          </div>

          <div className="mt-16">
            <PricingCards />
          </div>

          <div className="mt-10 text-center">
            <Link to="/pricing" className="font-mono-tech text-sm uppercase tracking-wider text-text-secondary hover:text-text-primary">
              Compare plans in detail ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 px-[5vw] py-32 lg:px-8">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[400px] opacity-[0.15] blur-[140px]"
          style={{ background: 'radial-gradient(ellipse at center, #FF4D2E 0%, transparent 70%)' }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Lock className="mx-auto h-8 w-8 text-safety" />
          <h2 className="mt-6 font-display text-4xl font-bold text-text-primary sm:text-5xl">
            Your lab, running on its own.
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
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
