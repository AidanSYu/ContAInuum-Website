import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Magnetic } from '@/components/motion';
import { Cta } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { MediaCredit } from '@/components/marketing/MediaCredit';
import type { MediaCreditInfo } from '@/lib/mediaCredits';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/* =============================================================================
   Mission,Contineon. Short and image-driven, in the Varda register: a hero,
   one block that says the whole thing, one full-bleed frame, a close. Every
   visual is real footage (cut from the space montage) with the homepage's
   instrument-feed treatment layered in CSS/GSAP: a punchy grade, an ember
   key-light, a slow scan-sweep, legibility scrims, kept at native resolution so
   it stays crisp. No drawn figures. One argument, one human line, no more.
   ============================================================================= */

/* Full-bleed cinematic media (video or still) with the instrument-feed grade,
   ember key-light, optional scan-sweep, and scrims. Video pauses off-screen. */
function Cinematic({
  video,
  poster,
  image,
  grade = 'saturate(1.12) contrast(1.07) brightness(0.98)',
  scan = false,
  frame = false,
  eager = false,
  credit,
}: {
  video?: string;
  poster?: string;
  image?: string;
  grade?: string;
  scan?: boolean;
  frame?: boolean;
  /** Reserve eager loading for media visible in the first viewport. */
  eager?: boolean;
  /** Attribution overlay — pass only when the media's license requires it. */
  credit?: MediaCreditInfo;
}) {
  const root = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const ambientAnimations = useRef<ReturnType<typeof gsap.to>[]>([]);
  const isVisible = useRef(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const shouldLoad = eager || isNearViewport;

  useEffect(() => {
    if (eager || isNearViewport) return;

    const el = root.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      const frameId = window.requestAnimationFrame(() => setIsNearViewport(true));
      return () => window.cancelAnimationFrame(frameId);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearViewport(true);
        io.disconnect();
      },
      { rootMargin: '75% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, isNearViewport]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const setActive = (active: boolean) => {
      isVisible.current = active;

      const mediaElement = media.current;
      if (mediaElement) mediaElement.style.willChange = active ? 'transform' : 'auto';
      if (mediaElement instanceof HTMLVideoElement) {
        if (active) mediaElement.play().catch(() => {});
        else mediaElement.pause();
      }

      ambientAnimations.current.forEach((animation) => animation.paused(!active));
    };

    if (typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return () => setActive(false);
    }

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setActive(false);
    };
  }, []);

  useEffect(() => {
    const el = media.current;
    if (!shouldLoad || !(el instanceof HTMLVideoElement)) return;

    if (isVisible.current) el.play().catch(() => {});
  }, [eager, shouldLoad, video]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const animations: ReturnType<typeof gsap.to>[] = [];
      if (media.current) {
        animations.push(
          gsap.fromTo(
            media.current,
            { scale: 1.05 },
            { scale: 1.14, duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true },
          ),
        );
      }
      if (scan && scanRef.current) {
        animations.push(
          gsap.fromTo(
            scanRef.current,
            { yPercent: -120 },
            { yPercent: 520, duration: 7, ease: 'none', repeat: -1, repeatDelay: 3.5, paused: true },
          ),
        );
      }
      ambientAnimations.current = animations;
      if (isVisible.current) animations.forEach((animation) => animation.resume());

      return () => {
        if (ambientAnimations.current === animations) ambientAnimations.current = [];
      };
    });
    return () => {
      ambientAnimations.current = [];
      mm.revert();
    };
  });

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden">
      {video ? (
        <video
          ref={media as RefObject<HTMLVideoElement>}
          className="h-full w-full object-cover will-change-transform"
          style={{ filter: grade }}
          autoPlay={eager}
          muted
          loop
          playsInline
          src={shouldLoad ? video : undefined}
          poster={shouldLoad ? poster : undefined}
          preload={shouldLoad ? 'auto' : 'none'}
        />
      ) : (
        <img
          ref={media as RefObject<HTMLImageElement>}
          src={shouldLoad ? image : undefined}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          className="h-full w-full object-cover will-change-transform"
          style={{ filter: grade }}
        />
      )}

      {/* ember key-light from the upper right,warms the frame toward the accent */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen bg-[radial-gradient(120%_90%_at_85%_12%,rgba(242,97,58,0.13),transparent_55%)]" />
      {scan && (
        <div
          ref={scanRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-[24%] mix-blend-screen bg-gradient-to-b from-transparent via-[#F2613A]/[0.09] to-transparent"
        />
      )}
      {/* legibility scrims */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#06080B]/45 via-[#06080B]/20 to-[#06080B]/92" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#06080B]/70 via-[#06080B]/10 to-transparent" />
      {frame && (
        <div className="pointer-events-none absolute inset-[20px] z-[3] hidden md:block">
          <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-white/20" />
          <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-white/20" />
          <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-white/20" />
          <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-white/20" />
        </div>
      )}
      {credit && <MediaCredit credit={credit} />}
    </div>
  );
}

/* A section that reveals its [data-title] word-by-word and fades [data-fade] up. */
function Section({ media, children, minH = 'min-h-[92svh]', className }: { media?: ReactNode; children: ReactNode; minH?: string; className?: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = root.current?.querySelector('[data-title]');
        if (title) {
          const split = new SplitText(title, { type: 'lines,words', linesClass: 'overflow-hidden pb-[0.1em]' });
          gsap.from(split.words, { yPercent: 122, duration: 0.85, ease: 'power4.out', stagger: 0.025, scrollTrigger: { trigger: title, start: 'top 86%' } });
        }
        const fades = root.current?.querySelectorAll('[data-fade]');
        if (fades?.length) {
          gsap.from(fades, { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 60%' } });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className={cn('dark relative flex items-center overflow-hidden bg-[#06080B] text-ink', minH, className)}>
      {media}
      <div className="site-shell relative z-10 py-[clamp(80px,11vw,150px)]">{children}</div>
    </section>
  );
}

export function MissionPage() {
  return (
    <>
      <Seo
        title="Mission, Contineon"
        description="Discovery runs at the speed of the people doing it. Contineon builds the system that lets a lab run and learn on its own, so the answers we need stop having to wait."
        path="/mission"
      />

      {/* HERO */}
      <Section
        minH="min-h-[100svh]"
        className="items-end"
        media={<Cinematic video="/images/mission-night.mp4" poster="/images/mission-night.jpg" grade="saturate(1.12) contrast(1.08) brightness(0.92)" scan frame eager />}
      >
        <div className="max-w-4xl pb-6 2xl:max-w-[70rem]">
          <p data-fade className="lab-label mb-7 text-white/55">
            Our mission
          </p>
          <h1 data-title className="text-[clamp(40px,6.4vw,138px)] font-bold leading-[0.95] tracking-[-0.05em]">
            Discovery runs at the speed of the people doing it.
          </h1>
          <p data-fade className="mt-8 max-w-2xl text-[clamp(17px,1.6vw,28px)] font-medium leading-snug text-white/70 2xl:max-w-3xl">
            We build the system that lets a lab run and learn on its own, so the answers we need stop having
            to wait on the few people who can find them.
          </p>
          <div data-fade className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Cta to="/contact?topic=partner" variant="accent">
                Request access <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
            <Magnetic>
              <Cta to="/contact?topic=careers" variant="outlineLight">
                Careers
              </Cta>
            </Magnetic>
          </div>
        </div>
      </Section>

      {/* IN BRIEF,the whole thing, once */}
      <Section media={<GridField className="opacity-20" />}>
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <p data-fade className="lab-label mb-5 text-white/45">
              In brief
            </p>
            <h2 data-title className="text-[clamp(30px,4vw,80px)] font-bold leading-[1.02] tracking-[-0.04em]">
              We&apos;re industrializing discovery.
            </h2>
          </div>
          <div className="space-y-6 text-[clamp(16px,1.35vw,24px)] leading-relaxed text-white/70">
            <p data-fade>
              For all of history, science has been done by hand. One experiment at a time, one lab at a time,
              limited by how many people could run the work and how many hours they had. Most of what we call
              impossible was never actually tried.
            </p>
            <p data-fade>
              The race in AI right now is to build a model that knows everything. Knowing was never the hard
              part. Discovery is a loop: try something, run it for real, measure what happened, and carry what
              you learned into the next try. We build the system that closes that loop and runs it on its own,
              checked against the physical world at every step.
            </p>
            <p data-fade className="text-[clamp(17px,1.5vw,27px)] font-semibold text-white/90">
              We turn working labs into autonomous ones, on the instruments they already have.
            </p>
          </div>
        </div>
      </Section>

      {/* ONE FULL-BLEED FRAME */}
      <Section
        minH="min-h-[86svh]"
        media={
          <Cinematic
            video="/images/mission-fire.mp4"
            poster="/images/mission-fire.jpg"
            grade="saturate(1.18) contrast(1.08) brightness(0.95)"
          />
        }
      >
        <div className="max-w-3xl 2xl:max-w-[60rem]">
          <h2 data-title className="text-[clamp(30px,4.6vw,96px)] font-bold leading-[1.0] tracking-[-0.05em]">
            A result only counts when the physical world backs it up.
          </h2>
          <p data-fade className="mt-7 max-w-xl text-[clamp(16px,1.4vw,25px)] leading-relaxed text-white/70 2xl:max-w-2xl">
            The system proposes. Reality decides. Nothing is called true until a real instrument has measured it.
          </p>
        </div>
      </Section>

      {/* CLOSE */}
      <Section
        minH="min-h-[92svh]"
        className="items-center"
        media={
          <>
            <Cinematic video="/images/mission-earth.mp4" poster="/images/mission-earth.jpg" grade="saturate(1.18) contrast(1.05) brightness(1.02)" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_118%,rgba(242,97,58,0.22),transparent_66%)]" />
          </>
        }
      >
        <div className="mx-auto max-w-3xl text-center 2xl:max-w-[64rem]">
          <h2 data-title className="text-[clamp(34px,5vw,108px)] font-bold leading-[0.98] tracking-[-0.05em]">
            The answers shouldn’t have to wait.
          </h2>
          <p data-fade className="mx-auto mt-7 max-w-xl text-[clamp(16px,1.5vw,27px)] leading-relaxed text-white/70 2xl:max-w-2xl">
            If this is the problem you want to spend your life on, come find us.
          </p>
          <div data-fade className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Cta to="/contact?topic=partner" variant="accent">
                Request access <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
            <Magnetic>
              <Cta to="/contact?topic=careers" variant="outlineLight">
                Careers
              </Cta>
            </Magnetic>
          </div>
        </div>
      </Section>
    </>
  );
}
