import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal, Magnetic, ParticleField } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { AsciiMedia } from '@/components/marketing/AsciiMedia';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';

/* =============================================================================
   Landing — Contineon MISSION page. The first frame (hero) is fixed. Everything
   below is the manifesto: what we are, the thesis, the new category, how we
   build it, the wedge (Atlas), the dream. Big type, short lines, signature
   ASCII media, one accent. Built to be felt fast.
   ============================================================================= */

function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLVideoElement>(null);

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
        if (media.current) {
          gsap.fromTo(
            media.current,
            { scale: 1.06 },
            { scale: 1.16, duration: 24, ease: 'sine.inOut', repeat: -1, yoyo: true },
          );
          gsap.to(media.current, {
            yPercent: 16,
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
        <video
          ref={media}
          className="h-[118%] w-full object-cover will-change-transform [filter:saturate(0.85)_contrast(1.04)_brightness(0.9)]"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/airglow.jpg"
          onLoadedData={(e) => {
            e.currentTarget.playbackRate = 2.2;
          }}
        >
          <source src="/images/iss-earth.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/55 via-[#06080B]/35 to-[#06080B]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080B]/85 via-transparent to-transparent" />
      </div>
      <ParticleField className="pointer-events-none absolute inset-0 z-[1]" />
      <GridField className="opacity-[0.5]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-[5vw] pb-20 pt-32 lg:px-8 xl:px-16">
        <div className="max-w-5xl">
          <h1
            data-hero-title
            className="text-[clamp(44px,7.4vw,116px)] font-bold leading-[0.94] tracking-[-0.045em]"
          >
            <span className="block">Industrializing</span>
            <span className="block">Breakthrough</span>
            <span className="block">Science.</span>
          </h1>
          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Cta to="/platform" variant="outlineLight">
                See Atlas <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

const BETS = [
  {
    n: '01',
    name: 'Infrastructure',
    headline: 'Compute fused with the lab.',
    line: 'One substrate that reaches all the way down to the instrument. The gap between thinking and doing is where most automation quietly dies. We close it.',
    media: { src: '/images/earth-night-poster.jpg', tint: 'ember' as const },
  },
  {
    n: '02',
    name: 'Foundational models',
    headline: 'Models that act, not just describe.',
    line: 'Our own frontier models. Language models that read the literature; world models that perceive an experiment, predict its outcome, and decide the next move.',
    media: { src: '/images/gargantua-blackhole.png', tint: 'ember' as const },
  },
  {
    n: '03',
    name: 'Own the stack',
    headline: 'We own intelligence. We never rent it.',
    line: 'Silicon to instrument to model, held as a single loop. The company that owns the full loop is the only one that can close it.',
    media: { src: '/images/sun-sdo-poster.jpg', tint: 'ice' as const },
  },
  {
    n: '04',
    name: 'Unusual methods',
    headline: 'State of the art, off the main road.',
    line: 'The largest gains are still sitting in the assumptions everyone agreed to stop questioning. The hardness is the moat.',
    media: { src: '/images/sr71-horse-rider.png', tint: 'ember' as const },
  },
];

function BetsSection() {
  return (
    <section id="how" className="border-y border-line bg-surface py-[clamp(72px,11vw,150px)]">
      <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
        <Reveal className="max-w-2xl">
          <Kicker className="text-safety">How we build it</Kicker>
          <h2 className="mt-4 text-[clamp(28px,4vw,56px)] font-bold leading-[1.02] tracking-[-0.035em] text-ink">
            Four bets, built as one company.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {BETS.map((b, i) => (
            <Reveal key={b.n} delay={i * 0.05} className="group flex flex-col bg-surface">
              <div className="relative aspect-[16/10] overflow-hidden">
                <AsciiMedia
                  src={b.media.src}
                  type="image"
                  tint={b.media.tint}
                  cols={118}
                  className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 top-0 flex items-center gap-3 p-5">
                  <span className="font-mono text-xs text-safety">{b.n}</span>
                  <span className="lab-label text-white/80">{b.name}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7 lg:p-9">
                <h3 className="text-[clamp(20px,2.1vw,30px)] font-bold leading-[1.07] tracking-[-0.02em] text-ink">
                  {b.headline}
                </h3>
                <p className="mt-3 text-[clamp(14px,1.05vw,16.5px)] leading-relaxed text-ink-muted">
                  {b.line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <>
      <Seo
        title="Contineon, industrializing breakthrough science"
        description="Contineon is the frontier lab turning intelligence into matter. We are building the second invention factory: industrialized invention across all matter. Atlas is the wedge."
        path="/"
      />

      <Hero />

      {/* Capability — what we are */}
      <section className="dark relative flex min-h-[78vh] items-center overflow-hidden bg-paper text-ink">
        <AsciiMedia
          src="/images/earth-night.mp4"
          type="video"
          poster="/images/earth-night-poster.jpg"
          cols={170}
          speed={1.5}
          tint="ember"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080B] via-[#06080B]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080B] via-transparent to-[#06080B]/70" />
        <GridField className="opacity-40" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-4xl">
            <Kicker className="text-safety">What we are</Kicker>
            <h2 className="mt-5 text-[clamp(30px,5vw,74px)] font-bold leading-[1.0] tracking-[-0.04em]">
              The frontier lab for turning intelligence into matter.
            </h2>
            <p className="mt-6 max-w-xl text-[clamp(16px,1.4vw,22px)] leading-snug text-white/70">
              Discovery, manufactured. Not waited for.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Manifesto — the thesis */}
      <section id="thesis" className="border-y border-line bg-surface py-[clamp(80px,13vw,180px)]">
        <div className="mx-auto max-w-6xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal>
            <Kicker className="text-safety">The thesis</Kicker>
          </Reveal>
          <div className="mt-8 space-y-3 text-[clamp(26px,4.4vw,60px)] font-bold leading-[1.05] tracking-[-0.035em] text-ink">
            <Reveal>
              <p>Science is the last great craft.</p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-ink-muted">
                Still made by hand. One mind at a time. The way cloth was made before the loom.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>We are not betting the work gets easier.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>
                We are betting it gets <span className="text-safety">industrialized</span>.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mt-12 max-w-2xl">
            <p className="text-[clamp(17px,1.5vw,22px)] leading-snug text-ink">
              Not smarter scientists. An industrializable science. Whoever industrializes it owns the
              fastest curve in the world.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Category — the second invention factory */}
      <section className="dark relative flex min-h-[88vh] items-center overflow-hidden bg-paper text-ink">
        <AsciiMedia
          src="/images/sun-sdo.mp4"
          type="video"
          poster="/images/sun-sdo-poster.jpg"
          cols={150}
          speed={1.2}
          tint="ember"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/85 via-[#06080B]/55 to-[#06080B]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080B] to-transparent" />
        <GridField className="opacity-30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-4xl">
            <Kicker className="text-safety">The category</Kicker>
            <h2 className="mt-5 text-[clamp(32px,5.4vw,82px)] font-bold leading-[0.98] tracking-[-0.04em]">
              The second invention factory.
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-8 grid max-w-5xl gap-x-12 gap-y-5 lg:grid-cols-2">
            <p className="text-[clamp(17px,1.6vw,24px)] font-medium leading-snug text-white">
              The first one took electricity and turned a century of ideas into products.
            </p>
            <p className="text-[clamp(16px,1.3vw,20px)] leading-relaxed text-white/70">
              We are building the one that takes intelligence and turns it into discovery, at
              industrial scale, across all matter: molecules, materials, medicine, machines.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How — the four bets */}
      <BetsSection />

      {/* Wedge — Atlas */}
      <section className="dark relative overflow-hidden bg-paper py-[clamp(80px,12vw,170px)] text-ink">
        <GridField className="opacity-25" />
        <div className="relative z-10 mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <Kicker className="text-safety">The wedge</Kicker>
              <h2 className="mt-5 text-[clamp(30px,4.4vw,62px)] font-bold leading-[1.0] tracking-[-0.04em]">
                Atlas makes the labs that already exist autonomous.
              </h2>
              <p className="mt-6 max-w-xl text-[clamp(17px,1.5vw,23px)] font-medium leading-snug text-white">
                Prompt in. Physical result out. At machine speed.
              </p>
              <p className="mt-4 max-w-xl text-[clamp(15px,1.15vw,18px)] leading-relaxed text-white/65">
                Atlas plans the campaign, runs it on the instruments a lab already owns, and hands
                control back the moment human judgment matters. The first place discovery compounds,
                not the last.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {['Design', 'Run', 'Learn', 'Repeat'].map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-white/75"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-9">
                <Magnetic>
                  <Cta to="/platform" variant="accent">
                    See Atlas <ArrowRight className="h-4 w-4" />
                  </Cta>
                </Magnetic>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <AsciiMedia
                src="/images/earth-night.mp4"
                type="video"
                poster="/images/earth-night-poster.jpg"
                tint="ice"
                cols={150}
                speed={1.5}
                className="aspect-[4/3] w-full rounded-2xl border border-white/10"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing — the dream */}
      <section className="dark relative overflow-hidden bg-paper text-ink">
        <div className="absolute inset-0">
          <img src="/images/sr71-quote-wide.png" alt="" className="h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/85 to-[#06080B]/96" />
        </div>
        <GridField className="opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-[5vw] py-[clamp(96px,14vw,200px)] lg:px-8 xl:px-16">
          <Reveal className="max-w-4xl">
            <Kicker className="text-safety">The frontier</Kicker>
            <h2 className="mt-5 text-[clamp(34px,5.4vw,82px)] font-bold leading-[0.98] tracking-[-0.045em]">
              The frontier was never closed. We just stopped riding out to it.
            </h2>
            <p className="mt-7 max-w-2xl text-[clamp(16px,1.3vw,20px)] leading-relaxed text-white/70">
              Contineon is for the builders, scientists, and contrarians who believe the largest
              problems are the ones worth their years, and that the next century of science should be
              built, not waited for.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Magnetic>
                <Cta to="/contact?topic=partner" variant="accent">
                  Request access <ArrowRight className="h-4 w-4" />
                </Cta>
              </Magnetic>
              <Magnetic>
                <Cta to="/contact?topic=demo" variant="outlineLight">
                  Book a demo
                </Cta>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
