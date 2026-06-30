import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField, Plate } from '@/components/marketing/visuals';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';

/* =============================================================================
   Landing — Contineon MISSION page. The thesis: industrializing breakthrough
   science. Atlas is only teased; product detail lives on /platform.
   Dark/light rhythm, one accent, technical grid, cinematic imagery.
   ============================================================================= */

function Hero() {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = root.current?.querySelector('[data-hero-title]');
        if (title) {
          const split = new SplitText(title, { type: 'lines,words', linesClass: 'overflow-hidden pb-[0.1em]' });
          gsap.from(split.words, { yPercent: 115, duration: 1.05, ease: 'power4.out', stagger: 0.045, delay: 0.15 });
        }
        gsap.from('[data-hero-fade]', { opacity: 0, y: 18, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.5 });
        if (img.current) {
          gsap.to(img.current, {
            yPercent: 18,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="dark relative flex min-h-[100svh] items-end overflow-hidden bg-paper text-ink">
      <div className="absolute inset-0">
        <img
          ref={img}
          src="/images/sr71-quote-wide.png"
          alt=""
          className="h-[118%] w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/55 via-[#06080B]/35 to-[#06080B]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080B]/85 via-transparent to-transparent" />
      </div>
      <GridField className="opacity-[0.5]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-[5vw] pb-20 pt-32 lg:px-8 xl:px-16">
        <div className="max-w-5xl">
          <p data-hero-fade>
            <Kicker className="text-white/55">Industrializing science</Kicker>
          </p>
          <h1
            data-hero-title
            className="mt-5 text-[clamp(40px,6.4vw,98px)] font-bold leading-[0.96] tracking-[-0.04em]"
          >
            Make discovery compound like industry.
          </h1>
          <p data-hero-fade className="mt-7 max-w-2xl text-[clamp(16px,1.35vw,21px)] leading-relaxed text-white/70">
            Science still advances one lab, one researcher, one lucky run at a time. Contineon is
            building the machine that turns one result into the next, on purpose, at scale, until
            breakthroughs arrive on a cadence instead of by accident.
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

const PILLARS = [
  {
    n: '01',
    name: 'Infrastructure',
    headline: 'Compute and the physical lab, one layer.',
    body: 'Autonomous science needs a substrate that reaches all the way down to the instrument. We build the compute and the physical lab layer as a single system, because the gap between them is where most automation quietly fails.',
    plate: { label: 'Fig. 01 / Substrate', src: undefined as string | undefined },
  },
  {
    n: '02',
    name: 'Foundational models',
    headline: 'Models that act in the world, not just describe it.',
    body: 'We train our own frontier models: language models that reason over the literature, world models that perceive an experiment, predict its outcome, and decide the next move. A model that can only read about the world cannot run one. Ours are built to do both.',
    plate: { label: 'Fig. 02 / World model', src: '/images/gargantua-blackhole.png' as string | undefined },
  },
  {
    n: '03',
    name: 'Own the stack',
    headline: 'We own intelligence. We do not rent it.',
    body: 'The field is busy renting its mind from a vendor and calling it strategy. We hold the contrarian view that the hard parts cannot be outsourced. We integrate vertically, from silicon to instrument to model, because the company that owns the full loop is the only one that can close it.',
    plate: { label: 'Fig. 03 / Vertical integration', src: undefined as string | undefined },
  },
  {
    n: '04',
    name: 'Unusual methods',
    headline: 'State of the art, off the main road.',
    body: 'Consensus is a crowded road to a small destination. We reach state of the art through the approaches the field overlooked, and we know precisely why they were overlooked. The largest gains are still sitting in the assumptions everyone agreed to stop questioning. The hardness is the moat.',
    plate: { label: 'Fig. 04 / Off the main road', src: undefined as string | undefined },
  },
];

export function LandingPage() {
  return (
    <>
      <Seo
        title="Contineon, industrializing breakthrough science"
        description="Contineon is building the infrastructure, foundational models, and autonomous systems that make scientific discovery compound like industry. Atlas is our first product."
        path="/"
      />

      <Hero />

      {/* Thesis — light, the manifesto */}
      <section id="thesis" className="border-y border-line bg-surface py-[clamp(80px,12vw,160px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-5xl">
            <Kicker>The thesis</Kicker>
            <h2 className="mt-6 text-[clamp(30px,4.4vw,62px)] font-bold leading-[1.04] tracking-[-0.035em] text-ink">
              We are not betting that science is easy. We are betting that it is industrializable.
            </h2>
          </Reveal>
          <Reveal className="mt-10 grid gap-x-12 gap-y-6 lg:grid-cols-[1fr_1.1fr]" delay={0.05}>
            <p className="text-[clamp(17px,1.5vw,23px)] font-medium leading-snug text-ink">
              The ceiling on progress was never how fast one mind could think. It was that knowledge
              never accumulated faster than people could be trained to carry it.
            </p>
            <p className="text-[clamp(16px,1.2vw,19px)] leading-relaxed text-ink-muted">
              We treat that ceiling as an engineering problem, not a law of nature. Break it and
              discovery begins to compound: every experiment sharpens the next, every result becomes a
              tool, the frontier starts to move on its own. That is not a better lab. That is a
              different century.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pillars — dark, alternating rows with cinematic plates */}
      <section id="pillars" className="dark relative overflow-hidden bg-paper py-[clamp(72px,10vw,140px)] text-ink">
        <GridField className="opacity-40" />
        <div className="relative z-10 mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-2xl">
            <Kicker className="text-safety">How we do it</Kicker>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,50px)] font-bold leading-[1.03] tracking-[-0.03em]">
              Four bets, built as one company.
            </h2>
          </Reveal>

          <div className="mt-16 flex flex-col gap-[clamp(56px,9vw,120px)]">
            {PILLARS.map((p, i) => (
              <Reveal
                key={p.n}
                className={`grid items-center gap-x-12 gap-y-8 lg:grid-cols-2 ${i % 2 === 1 ? '' : ''}`}
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-sm text-safety">{p.n}</span>
                    <span className="lab-label">{p.name}</span>
                  </div>
                  <h3 className="mt-5 max-w-xl text-[clamp(24px,2.8vw,40px)] font-bold leading-[1.06] tracking-[-0.025em]">
                    {p.headline}
                  </h3>
                  <p className="mt-5 max-w-xl text-[clamp(15px,1.1vw,18px)] leading-relaxed text-ink-muted">
                    {p.body}
                  </p>
                </div>
                <Plate
                  src={p.plate.src}
                  label={p.plate.label}
                  className={`aspect-[4/3] ${i % 2 === 1 ? 'lg:order-1' : ''}`}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Atlas teaser — light band */}
      <section className="border-y border-line bg-surface py-[clamp(72px,10vw,140px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <Kicker>First, Atlas</Kicker>
              <h2 className="mt-4 text-[clamp(30px,4vw,56px)] font-bold leading-[1.02] tracking-[-0.035em] text-ink">
                The first place discovery compounds.
              </h2>
              <p className="mt-6 max-w-xl text-[clamp(16px,1.2vw,19px)] leading-relaxed text-ink-muted">
                Atlas is an autonomous lab agent that plans and runs research campaigns on the
                instruments a lab already owns, hands the work back to a human the moment judgment is
                needed, and remembers everything it learns. The first place discovery starts to
                compound. Not the last.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Cta to="/platform" variant="ink">
                  Explore Atlas Framework <ArrowRight className="h-4 w-4" />
                </Cta>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <Plate src="/images/sr71-horse-rider.png" label="Atlas / first instrument" className="aspect-[4/3] h-full" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing — dark, cinematic */}
      <section className="dark relative overflow-hidden bg-paper text-ink">
        <div className="absolute inset-0">
          <img src="/images/sr71-quote-wide.png" alt="" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/85 to-[#06080B]/96" />
        </div>
        <GridField className="opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-[5vw] py-[clamp(88px,13vw,180px)] lg:px-8 xl:px-16">
          <Reveal className="max-w-4xl">
            <Kicker className="text-safety">The frontier</Kicker>
            <h2 className="mt-5 text-[clamp(32px,5vw,76px)] font-bold leading-[1.0] tracking-[-0.04em]">
              The frontier was never closed. We just stopped riding out to it.
            </h2>
            <p className="mt-7 max-w-2xl text-[clamp(16px,1.2vw,19px)] leading-relaxed text-white/70">
              Contineon is for the people who find that obvious and unbearable in equal measure.
              Builders, scientists, and contrarians who believe the largest problems are the ones
              worth their years, and that the next century of science should be built, not waited for.
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
