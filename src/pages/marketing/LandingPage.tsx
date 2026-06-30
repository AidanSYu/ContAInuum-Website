import { useRef, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Magnetic, ParticleField } from '@/components/motion';
import { Cta } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { AsciiMedia } from '@/components/marketing/AsciiMedia';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/* =============================================================================
   Landing — Contineon. A short cinematic mission piece. Four screens, one idea
   each: the open, the hook, the vision, the frontier. The media carries it; the
   words stay sparse. One typeface, one accent, one motion register. All obsidian.
   ============================================================================= */

/* Slow Ken Burns push on a muted autoplay video, graded to the obsidian mood. */
function KenBurnsVideo({ src, poster, speed = 1.8 }: { src: string; poster: string; speed?: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (ref.current) {
          gsap.fromTo(ref.current, { scale: 1.05 }, { scale: 1.15, duration: 26, ease: 'sine.inOut', repeat: -1, yoyo: true });
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      onLoadedData={(e) => {
        e.currentTarget.playbackRate = speed;
      }}
      className="h-full w-full object-cover will-change-transform [filter:saturate(0.82)_contrast(1.05)_brightness(0.82)]"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

/* Cinematic still with a gentle scroll parallax. */
function ParallaxImage({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (ref.current) {
          gsap.to(ref.current, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return <img ref={ref} src={src} alt="" className={cn('h-[118%] w-full object-cover', className)} />;
}

/* A full-bleed cinematic beat: media behind, one statement in front. The
   headline reveals word by word on scroll; supporting lines fade up after. */
function Beat({
  media,
  children,
  minH = 'min-h-[92svh]',
}: {
  media: ReactNode;
  children: ReactNode;
  minH?: string;
}) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = root.current?.querySelector('[data-beat-title]');
        if (title) {
          const split = new SplitText(title, { type: 'lines,words', linesClass: 'overflow-hidden pb-[0.1em]' });
          gsap.from(split.words, {
            yPercent: 118,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.045,
            scrollTrigger: { trigger: title, start: 'top 88%' },
          });
        }
        const fades = root.current?.querySelectorAll('[data-beat-fade]');
        if (fades?.length) {
          gsap.from(fades, {
            opacity: 0,
            y: 22,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: root.current, start: 'top 64%' },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={cn('dark relative flex items-center overflow-hidden bg-[#06080B] text-ink', minH)}>
      {media}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-[5vw] py-[clamp(80px,12vw,170px)] lg:px-8 xl:px-16">
        {children}
      </div>
    </section>
  );
}

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
          gsap.fromTo(media.current, { scale: 1.06 }, { scale: 1.16, duration: 24, ease: 'sine.inOut', repeat: -1, yoyo: true });
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

/* --------------------------------- Page ------------------------------------ */
export function LandingPage() {
  return (
    <>
      <Seo
        title="Contineon, industrializing breakthrough science"
        description="Contineon is the frontier lab turning intelligence into matter. Science never had its industrial revolution. We are building the second invention factory."
        path="/"
      />

      <Hero />

      {/* The hook */}
      <Beat
        media={
          <>
            <div className="absolute inset-0">
              <KenBurnsVideo src="/images/earth-night.mp4" poster="/images/earth-night-poster.jpg" speed={1.6} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080B] via-[#06080B]/75 to-[#06080B]/25" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#06080B_0%,#06080B_22%,rgba(6,8,11,0.12)_54%,#06080B_100%)]" />
            <GridField className="opacity-25" />
          </>
        }
      >
        <h2
          data-beat-title
          className="max-w-5xl text-[clamp(36px,6.6vw,100px)] font-bold leading-[0.96] tracking-[-0.045em]"
        >
          Science never had its industrial revolution.
        </h2>
        <p
          data-beat-fade
          className="mt-8 max-w-2xl text-[clamp(17px,1.7vw,26px)] font-medium leading-snug text-white/65"
        >
          It is still made by hand. One mind at a time. The way cloth was made before the loom.
        </p>
      </Beat>

      {/* The vision, the boom */}
      <Beat
        minH="min-h-[98svh]"
        media={
          <>
            <AsciiMedia
              src="/images/sun-sdo.mp4"
              type="video"
              poster="/images/sun-sdo-poster.jpg"
              cols={160}
              speed={1.2}
              tint="ember"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#06080B]/40 to-[#06080B]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080B]/90 via-transparent to-transparent" />
            <GridField className="opacity-25" />
          </>
        }
      >
        <p data-beat-fade className="max-w-2xl text-[clamp(17px,1.7vw,24px)] font-medium leading-snug text-white/75">
          We are not betting it gets easier. We are betting it gets industrialized.
        </p>
        <h2
          data-beat-title
          className="mt-6 max-w-6xl text-[clamp(44px,8.6vw,150px)] font-bold leading-[0.92] tracking-[-0.05em]"
        >
          The second invention factory.
        </h2>
        <p data-beat-fade className="mt-8 max-w-2xl text-[clamp(16px,1.5vw,22px)] leading-relaxed text-white/65">
          Intelligence turned into matter, at industrial scale. Whoever industrializes science owns
          the fastest curve in the world.
        </p>
      </Beat>

      {/* The frontier, the close */}
      <Beat
        minH="min-h-[92svh]"
        media={
          <>
            <div className="absolute inset-0">
              <ParallaxImage src="/images/sr71-quote-wide.png" className="opacity-50" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/80 via-[#06080B]/70 to-[#06080B]/96" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <h2
          data-beat-title
          className="max-w-5xl text-[clamp(34px,5.6vw,90px)] font-bold leading-[0.98] tracking-[-0.045em]"
        >
          The frontier was never closed. We just stopped riding out to it.
        </h2>
        <p data-beat-fade className="mt-8 max-w-2xl text-[clamp(16px,1.4vw,21px)] leading-relaxed text-white/65">
          Contineon is for the builders, scientists, and contrarians who find that unbearable, and
          who believe the next century of science should be built, not waited for.
        </p>
        <div data-beat-fade className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Cta to="/contact?topic=partner" variant="accent">
              Request access <ArrowRight className="h-4 w-4" />
            </Cta>
          </Magnetic>
          <Magnetic>
            <Cta to="/platform" variant="outlineLight">
              See Atlas
            </Cta>
          </Magnetic>
        </div>
      </Beat>
    </>
  );
}
