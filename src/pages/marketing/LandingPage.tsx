import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Magnetic, ParticleField } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { Beat, ParallaxImage } from '@/components/marketing/Beat';
import { AsciiMedia } from '@/components/marketing/AsciiMedia';
import { InteractiveAscii } from '@/components/marketing/InteractiveAscii';
import { useDarkHero } from '@/components/layout/darkHero';
import { gsap, useGSAP, SplitText, ScrollTrigger } from '@/lib/gsap';

/* =============================================================================
   Landing — Contineon. A short cinematic mission piece. The open, the hook,
   what we actually build, the call. Each screen one idea, one distinct medium:
   ISS video, a generative loom, the ASCII sun, a photographic still. The poetry
   hooks; the specifics make it real. One typeface, one accent, all obsidian.
   ============================================================================= */

/* ---------------------------------- Hero ----------------------------------- */
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
          const kenBurns = gsap.fromTo(
            media.current,
            { scale: 1.06 },
            { scale: 1.16, duration: 24, ease: 'sine.inOut', repeat: -1, yoyo: true },
          );
          gsap.to(media.current, {
            yPercent: 16,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          });
          // Once the hero leaves the viewport, stop the video + its infinite scale
          // tween so they don't keep decoding/animating and starving scroll for the
          // rest of the (long) page. Resume when scrolled back up.
          ScrollTrigger.create({
            trigger: root.current,
            start: 'bottom top',
            onEnter: () => {
              media.current?.pause();
              kenBurns.pause();
            },
            onLeaveBack: () => {
              media.current?.play().catch(() => {});
              kenBurns.resume();
            },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="dark relative flex min-h-[100svh] items-end overflow-hidden bg-[#06080B] text-ink">
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
      <ParticleField count={28} className="pointer-events-none absolute inset-0 z-[1]" />
      <GridField className="opacity-[0.5]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-[5vw] pb-20 pt-32 lg:px-8 xl:px-16">
        <div className="max-w-5xl">
          <p data-hero-fade>
            <Kicker>The self-driving lab that remembers</Kicker>
          </p>
          <h1
            data-hero-title
            className="type-display mt-5"
          >
            <span className="block">Industrializing</span>
            <span className="block">Breakthrough</span>
            <span className="block">Science.</span>
          </h1>
          <p
            data-hero-fade
            className="type-lede mt-8 max-w-xl text-white/75"
          >
            Contineon builds Atlas — an autonomous agent that designs experiments, runs them on the
            instruments you already own, and remembers every result.
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3">
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

/* --------------------------------- Page ------------------------------------ */
export function LandingPage() {
  useDarkHero();

  return (
    <>
      <Seo
        title="Contineon, industrializing breakthrough science"
        description="Contineon builds the autonomous laboratory: foundational models that design an experiment, run it on real instruments, learn from the result, and choose what to run next. The first is Atlas."
        path="/"
      />

      <Hero />

      {/* The hook — a bespoke loom, not another Earth video */}
      <Beat
        media={
          <>
            <InteractiveAscii
              src="/images/mill.mp4"
              poster="/images/mill-poster.jpg"
              cols={110}
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#06080B] via-[#06080B]/55 to-[#06080B]/10" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080B]/70 via-transparent to-[#06080B]/40" />
          </>
        }
      >
        <h2
          data-beat-title
          className="type-display max-w-5xl"
        >
          Science never had its industrial revolution.
        </h2>
        <p
          data-beat-fade
          className="type-lede mt-8 max-w-2xl text-white/65"
        >
          It is still done by hand. One result at a time. The way cloth was made before the loom.
        </p>
      </Beat>

      {/* What we build — the specifics, the proof it is real */}
      <Beat
        minH="min-h-[98svh]"
        media={
          <>
            <AsciiMedia
              src="/images/sun-sdo.mp4"
              type="video"
              poster="/images/sun-sdo-poster.jpg"
              cols={120}
              speed={1.2}
              fps={18}
              tint="ember"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#06080B]/45 to-[#06080B]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080B]/92 via-transparent to-transparent" />
            <GridField className="opacity-25" />
          </>
        }
      >
        <h2
          data-beat-title
          className="type-display max-w-5xl"
        >
          We are building the invention factory.
        </h2>
        <p
          data-beat-fade
          className="type-lede mt-8 max-w-5xl text-white/85"
        >
          Foundational model systems that design an experiment, run it on real instruments, learn from
          the result, and choose what to run next. On their own. At machine speed.{' '}
          <span className="text-safety">In every existing lab.</span>
        </p>
      </Beat>

      {/* The call — specific, direct, one CTA */}
      <Beat
        minH="min-h-[90svh]"
        media={
          <>
            <div className="absolute inset-0">
              <ParallaxImage src="/images/sr71-quote-wide.png" fit="contain" className="opacity-[0.62]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080B] via-[#06080B]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/45 via-transparent to-[#06080B]/55" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <h2
          data-beat-title
          className="type-display max-w-4xl"
        >
          Come build it with us.
        </h2>
        <p data-beat-fade className="type-lede mt-8 max-w-2xl text-white/65">
          We are a small team of researchers and engineers. If you build foundational models,
          autonomous systems, or the instruments they run on, we want to talk.
        </p>
        <div data-beat-fade className="mt-10">
          <Magnetic>
            <Cta to="/docs" variant="accent">
              Get started <ArrowRight className="h-4 w-4" />
            </Cta>
          </Magnetic>
        </div>
      </Beat>
    </>
  );
}
