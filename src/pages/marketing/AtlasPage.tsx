import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { ConsolePreview } from '@/components/marketing/ConsolePreview';

const FACTS = [
  { label: 'Pause', text: 'A tool call pauses the campaign and notifies a scientist, like a job awaiting approval.' },
  { label: 'Resume', text: 'Return a TLC photo, a CSV, or a note. Atlas picks up from exactly where it stopped.' },
  { label: 'Learn', text: 'Correct a step once, and that correction becomes signal for every campaign after.' },
];

const CAPABILITIES = [
  { h: 'Autonomous planning', p: 'Atlas decomposes an objective into an ordered campaign of concrete experiments.' },
  { h: 'Runs on your bench', p: 'It executes on the instruments, ELN, and integrations you already operate. No rip-and-replace.' },
  { h: 'Human-in-the-loop', p: 'It pauses for the steps that need hands, then resumes from exactly where it stopped.' },
  { h: 'Compounding memory', p: 'Recipes, failure modes, and lab lore accumulate into a private knowledge graph.' },
  { h: 'Honest evaluation', p: 'Results, including the failures, are read back, scored, and explained.' },
  { h: 'Portable & secure', p: 'Your data, graph, and run history export with you. Access is provisioned, never scraped.' },
];

const LOOP = [
  { k: 'Plan', t: 'Atlas decomposes an objective into a campaign of concrete, ordered experiments.' },
  { k: 'Run', t: 'It executes on your instruments, calling for a human only where hands are genuinely needed.' },
  { k: 'Evaluate', t: 'Results, including the failures, are read back, scored, and explained.' },
  { k: 'Learn', t: 'Every outcome updates the lab’s memory so the next campaign starts smarter.' },
];

const STEPS = [
  { n: '01', h: 'Connect your workcell', p: 'Point Atlas at the instruments, ELN, and data you already run. No rip-and-replace. It speaks to your stack over open integrations.' },
  { n: '02', h: 'Run a campaign', p: 'Define an objective. Atlas plans, executes autonomously, and pauses to hand you the steps that still need a human.' },
  { n: '03', h: 'Watch it compound', p: 'Each campaign seeds the next. Failure modes, recipes, and lab lore accumulate into a memory that is yours alone.' },
];

export function AtlasPage() {
  return (
    <>
      <Seo
        title="Atlas Framework, Contineon"
        description="Atlas is Contineon's autonomous lab agent: it plans, runs campaigns on your existing instruments, hands work back when it needs a human, and remembers everything it learns."
        path="/platform"
      />

      {/* Hero */}
      <section className="border-b border-line pt-32">
        <div className="mx-auto max-w-7xl px-[5vw] pb-[clamp(48px,7vw,96px)] lg:px-8 xl:px-16">
          <Reveal className="max-w-4xl">
            <Kicker>Atlas Framework / Our first product</Kicker>
            <h1 className="mt-5 text-[clamp(40px,6vw,86px)] font-bold leading-[0.98] tracking-[-0.04em] text-ink">
              One agent that plans, runs, and remembers.
            </h1>
            <p className="mt-7 max-w-2xl text-[clamp(17px,1.4vw,21px)] leading-relaxed text-ink-muted">
              Atlas is the operating layer for an autonomous lab. It turns an objective into a
              campaign, runs it on the bench you already have, and keeps a durable memory of
              everything it learns.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Cta to="/contact?topic=partner" variant="accent">
                Request access <ArrowRight className="h-4 w-4" />
              </Cta>
              <Cta to="/contact?topic=demo" variant="outline">
                Book a demo
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Retrofit thesis */}
      <section className="border-b border-line py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Kicker>The approach</Kicker>
              <h2 className="mt-4 text-[clamp(30px,4vw,52px)] font-bold leading-[1.02] tracking-[-0.03em] text-ink">
                Retrofit, don’t replace.
              </h2>
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.05}>
              <p className="text-[clamp(17px,1.4vw,21px)] leading-relaxed text-ink-muted">
                Every other self-driving lab asks you to rebuild from scratch. Atlas runs on the
                instruments and people you already have, and when a step needs hands, it pauses and
                hands it to you.
              </p>
              <dl className="mt-10 divide-y divide-line border-y border-line">
                {FACTS.map((f) => (
                  <div key={f.label} className="grid grid-cols-[110px_1fr] gap-4 py-4">
                    <dt className="lab-label pt-0.5">{f.label}</dt>
                    <dd className="text-[15px] leading-relaxed text-ink-muted">{f.text}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-line bg-surface py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-2xl">
            <Kicker>Capabilities</Kicker>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.04] tracking-[-0.03em] text-ink">
              The full loop, on your instruments.
            </h2>
          </Reveal>
          <Reveal className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3" stagger>
            {CAPABILITIES.map((c) => (
              <div key={c.h} className="bg-surface p-7">
                <h3 className="text-lg font-semibold text-ink">{c.h}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{c.p}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Campaign loop */}
      <section className="border-b border-line py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-2xl">
            <Kicker>The campaign loop</Kicker>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.04] tracking-[-0.03em] text-ink">
              Plan, run, evaluate, learn. Then carry it forward.
            </h2>
          </Reveal>
          <Reveal className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" stagger>
            {LOOP.map((s, i) => (
              <div key={s.k} className="bg-surface p-7">
                <span className="lab-label text-safety">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-xl font-semibold text-ink">{s.k}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{s.t}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Console preview */}
      <section className="border-b border-line bg-surface py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-2xl">
            <Kicker>The console</Kicker>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.04] tracking-[-0.03em] text-ink">
              Watch every campaign think.
            </h2>
          </Reveal>
          <Reveal className="mt-12" delay={0.05}>
            <ConsolePreview />
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-line py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-2xl">
            <Kicker>How it works</Kicker>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.04] tracking-[-0.03em] text-ink">
              From your workcell to a learning lab in three moves.
            </h2>
          </Reveal>
          <Reveal className="mt-12 grid gap-10 md:grid-cols-3" stagger>
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="flex items-baseline gap-3 border-b border-line pb-4">
                  <span className="text-3xl font-bold tracking-tight text-safety">{s.n}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{s.h}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{s.p}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Memory / knowledge graph — dark */}
      <section className="dark bg-paper py-[clamp(64px,9vw,120px)] text-ink">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Kicker className="text-safety">Knowledge graph</Kicker>
              <h2 className="mt-4 text-[clamp(30px,4vw,54px)] font-bold leading-[1.02] tracking-[-0.03em]">
                Most labs throw away their hardest-won knowledge.
              </h2>
              <p className="mt-6 max-w-2xl text-[clamp(16px,1.2vw,19px)] leading-relaxed text-ink-muted">
                Every run, including recipes, failure modes, and lab lore, accumulates into a private
                knowledge graph. It is yours alone, it exports with you, and it makes each campaign
                smarter than the last.
              </p>
            </Reveal>
            <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.05}>
              <dl className="space-y-px overflow-hidden rounded-xl border border-line">
                {[
                  ['Compounding', 'Knowledge carries across campaigns'],
                  ['Portable', 'Your graph and run history export with you'],
                  ['Honest', 'Claims are labelled as targets until benchmarked'],
                ].map(([t, d]) => (
                  <div key={t} className="bg-surface px-5 py-4">
                    <dt className="text-[15px] font-semibold">{t}</dt>
                    <dd className="mt-1 text-sm text-ink-muted">{d}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Demo, honest placeholder */}
      <section className="border-b border-line py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-line bg-surface p-[clamp(28px,4vw,56px)] lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <Kicker className="text-safety">Live demo / Coming soon</Kicker>
              <h2 className="mt-4 text-[clamp(26px,3.2vw,40px)] font-bold leading-[1.05] tracking-[-0.03em] text-ink">
                An interactive Atlas demo is on the way.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                We are putting the finishing touches on an interactive walkthrough. Until then, book a
                live session and we will run Atlas against a campaign close to your own.
              </p>
            </div>
            <Cta to="/contact?topic=demo" variant="accent" className="shrink-0">
              Book a walkthrough <ArrowRight className="h-4 w-4" />
            </Cta>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-3xl">
            <h2 className="text-[clamp(28px,4vw,52px)] font-bold leading-[1.02] tracking-[-0.03em] text-ink">
              Run Atlas on the lab you already have.
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <Cta to="/contact?topic=partner" variant="ink">
                Request access <ArrowRight className="h-4 w-4" />
              </Cta>
              <Cta to="/docs" variant="outline">
                Read the docs
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
