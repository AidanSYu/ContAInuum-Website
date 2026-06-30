import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { ConsolePreview } from '@/components/marketing/ConsolePreview';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';

/* =============================================================================
   Landing, Contineon. Hybrid system: dark cinematic hero + closing band,
   warm-light editorial body. One sans (Hanken Grotesk), one accent, no AI tells.
   ============================================================================= */

function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = root.current?.querySelector('[data-hero-title]');
        if (!title) return;
        const split = new SplitText(title, { type: 'lines,words', linesClass: 'overflow-hidden pb-[0.1em]' });
        gsap.from(split.words, {
          yPercent: 115,
          duration: 1.05,
          ease: 'power4.out',
          stagger: 0.05,
          delay: 0.15,
        });
        gsap.from('[data-hero-fade]', {
          opacity: 0,
          y: 18,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.55,
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="dark relative flex min-h-[100svh] items-end overflow-hidden bg-paper text-ink"
    >
      <div className="absolute inset-0">
        <img
          src="/images/sr71-quote-wide.png"
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D11]/55 via-[#0B0D11]/35 to-[#0B0D11]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D11]/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-[5vw] pb-20 pt-32 lg:px-8 xl:px-16">
        <div className="max-w-4xl">
          <p data-hero-fade>
            <Kicker className="text-white/55">Autonomous laboratories</Kicker>
          </p>
          <h1
            data-hero-title
            className="mt-5 text-[clamp(44px,7vw,104px)] font-bold leading-[0.98] tracking-[-0.04em]"
          >
            The lab that remembers.
          </h1>
          <p
            data-hero-fade
            className="mt-7 max-w-xl text-[clamp(16px,1.3vw,20px)] leading-relaxed text-white/70"
          >
            Atlas retrofits the lab you already run, planning and running campaigns
            autonomously, handing work back when it needs a human, and remembering
            every run it touches.
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
            <Cta to="/contact?topic=partner" variant="accent">
              Request access <ArrowRight className="h-4 w-4" />
            </Cta>
            <Cta to="/platform" variant="outlineLight">
              See Atlas
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

const FACTS = [
  { label: 'Pause', text: 'A tool call pauses the campaign and notifies a scientist, like a job awaiting approval.' },
  { label: 'Resume', text: 'Return a TLC photo, a CSV, or a note. Atlas picks up from exactly where it stopped.' },
  { label: 'Learn', text: 'Correct a step once, and that correction becomes signal for every campaign after.' },
];

const STEPS = [
  { n: '01', h: 'Connect your workcell', p: 'Point Atlas at the instruments, ELN, and data you already run. No rip-and-replace. It speaks to your stack over open integrations.' },
  { n: '02', h: 'Run a campaign', p: 'Define an objective. Atlas plans, executes autonomously, and pauses to hand you the steps that still need a human.' },
  { n: '03', h: 'Watch it compound', p: 'Each campaign seeds the next. Failure modes, recipes, and lab lore accumulate into a memory that is yours alone.' },
];

const LOOP = [
  { k: 'Plan', t: 'Atlas decomposes an objective into a campaign of concrete, ordered experiments.' },
  { k: 'Run', t: 'It executes on your instruments, calling for a human only where hands are genuinely needed.' },
  { k: 'Evaluate', t: 'Results, including the failures, are read back, scored, and explained.' },
  { k: 'Learn', t: 'Every outcome updates the lab’s memory so the next campaign starts smarter.' },
];

export function LandingPage() {
  return (
    <>
      <Seo
        title="Contineon, the self-driving lab that remembers"
        description="Contineon retrofits the lab you already run with Atlas, an autonomous agent that plans, executes, hands work back to your scientists, and remembers every campaign it touches."
        path="/"
      />

      <Hero />

      {/* Trust strip, honest framing, no fabricated logos, no dot motifs. */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-[5vw] py-5 sm:flex-row sm:items-center sm:gap-8 lg:px-8 xl:px-16">
          <span className="lab-label text-safety">Now in private trial</span>
          <span className="text-sm text-ink-muted">
            Built alongside working chemistry, materials &amp; bio labs. Partner names at launch.
          </span>
        </div>
      </section>

      {/* Thesis */}
      <section id="thesis" className="border-b border-line py-[clamp(72px,10vw,128px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Kicker>The thesis</Kicker>
              <h2 className="mt-4 text-[clamp(32px,4.2vw,56px)] font-bold leading-[1.02] tracking-[-0.03em] text-ink">
                Retrofit,
                <br />
                don’t replace.
              </h2>
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.05}>
              <p className="text-[clamp(17px,1.4vw,22px)] leading-relaxed text-ink-muted">
                Every other self-driving lab asks you to rebuild from scratch. Atlas runs
                on the instruments and people you already have, and when a step needs
                hands, it pauses and hands it to you.
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

      {/* Platform / Atlas */}
      <section id="platform" className="border-b border-line bg-surface py-[clamp(72px,10vw,128px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-3xl">
            <Kicker>The platform</Kicker>
            <h2 className="mt-4 text-[clamp(30px,4vw,52px)] font-bold leading-[1.03] tracking-[-0.03em] text-ink">
              One agent that plans, runs, and remembers.
            </h2>
            <p className="mt-5 text-[clamp(16px,1.2vw,19px)] leading-relaxed text-ink-muted">
              Atlas is the operating layer for an autonomous lab. It turns an objective
              into a campaign, runs it on your bench, and keeps a durable memory of
              everything it learns along the way.
            </p>
          </Reveal>
          <Reveal className="mt-12" delay={0.05}>
            <ConsolePreview />
          </Reveal>
        </div>
      </section>

      {/* Campaign loop */}
      <section id="loop" className="border-b border-line py-[clamp(72px,10vw,128px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-2xl">
            <Kicker>The campaign loop</Kicker>
            <h2 className="mt-4 text-[clamp(30px,4vw,52px)] font-bold leading-[1.03] tracking-[-0.03em] text-ink">
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

      {/* How it works */}
      <section id="how" className="border-b border-line bg-surface py-[clamp(72px,10vw,128px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-2xl">
            <Kicker>How it works</Kicker>
            <h2 className="mt-4 text-[clamp(30px,4vw,52px)] font-bold leading-[1.03] tracking-[-0.03em] text-ink">
              From your existing workcell to a learning lab in three moves.
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

      {/* Memory band, dark */}
      <section className="dark bg-paper py-[clamp(72px,10vw,128px)] text-ink">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Kicker className="text-safety">Knowledge graph</Kicker>
              <h2 className="mt-4 text-[clamp(30px,4vw,54px)] font-bold leading-[1.02] tracking-[-0.03em]">
                Most labs throw away their hardest-won knowledge.
              </h2>
              <p className="mt-6 max-w-2xl text-[clamp(16px,1.2vw,19px)] leading-relaxed text-ink-muted">
                Every run (recipes, failure modes, and lab lore) accumulates into a
                private knowledge graph. It is yours alone, it exports with you, and it
                makes each campaign smarter than the last.
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

      {/* Closing CTA, dark, cinematic */}
      <section className="dark relative overflow-hidden bg-paper text-ink">
        <div className="absolute inset-0">
          <img src="/images/sr71-quote-wide.png" alt="" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D11]/85 to-[#0B0D11]/95" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-[5vw] py-[clamp(80px,12vw,160px)] lg:px-8 xl:px-16">
          <Reveal className="max-w-4xl">
            <Kicker className="text-safety">Get started</Kicker>
            <h2 className="mt-5 text-[clamp(34px,5.4vw,76px)] font-bold leading-[1.0] tracking-[-0.04em]">
              The next campaign starts where the last one left off.
            </h2>
            <p className="mt-6 max-w-xl text-[clamp(16px,1.2vw,19px)] leading-relaxed text-white/70">
              We work with a small cohort of design-partner labs. No rip-and-replace,
              no amnesia. Apply to run Atlas on the instruments you already have.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Cta to="/contact?topic=partner" variant="accent">
                Request access <ArrowRight className="h-4 w-4" />
              </Cta>
              <Cta to="/contact?topic=demo" variant="outlineLight">
                Book a demo
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
