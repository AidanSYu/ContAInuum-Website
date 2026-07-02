import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, SplitText, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/* =============================================================================
   Beat — the site-wide cinematic section primitive. A full-bleed obsidian band:
   media behind, one statement in front. The headline ([data-beat-title]) reveals
   word by word; supporting lines ([data-beat-fade]) fade up after.

   `intro` animates on load instead of on scroll — use it for an above-the-fold
   page hero. `align` controls vertical placement of the content block. All motion
   is gated behind prefers-reduced-motion; content is visible if motion is off.
   Lifted out of LandingPage so every page shares one behavior, not a copy.
   ============================================================================= */

/** Cinematic still with a gentle scroll parallax. */
export function ParallaxImage({
  src,
  className,
  fit = 'cover',
}: {
  src: string;
  className?: string;
  fit?: 'cover' | 'contain';
}) {
  const ref = useRef<HTMLImageElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (ref.current) {
          gsap.to(ref.current, {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <img
      ref={ref}
      src={src}
      alt=""
      className={cn('h-full w-full object-center', fit === 'contain' ? 'object-contain' : 'object-cover', className)}
    />
  );
}

type BeatProps = {
  media?: ReactNode;
  children: ReactNode;
  minH?: string;
  align?: 'center' | 'end';
  /** Animate on load (for an above-the-fold hero) instead of on scroll. */
  intro?: boolean;
  className?: string;
};

export function Beat({
  media,
  children,
  minH = 'min-h-[92svh]',
  align = 'center',
  intro = false,
  className,
}: BeatProps) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = root.current?.querySelector('[data-beat-title]');
        if (title) {
          const split = new SplitText(title, { type: 'lines,words', linesClass: 'overflow-hidden pb-[0.1em]' });
          gsap.from(split.words, {
            yPercent: intro ? 115 : 118,
            duration: intro ? 1.05 : 1,
            ease: 'power4.out',
            stagger: 0.045,
            ...(intro
              ? { delay: 0.15 }
              : { scrollTrigger: { trigger: title, start: 'top 88%' } }),
          });
        }
        const fades = root.current?.querySelectorAll('[data-beat-fade]');
        if (fades?.length) {
          if (intro) {
            // Above-the-fold hero: reveal on load.
            gsap.from(fades, { opacity: 0, y: 18, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.5 });
          } else {
            // Reveal each element as IT enters (not the whole section at once), so
            // items low in a tall beat don't animate off-screen before you arrive.
            gsap.set(fades, { opacity: 0, y: 22 });
            ScrollTrigger.batch(fades, {
              start: 'top 85%',
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: true }),
            });
          }
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Heroes fill the viewport at every width. Content beats keep their tall
  // min-height only from md up; on mobile they size to content + padding so short
  // sections don't float in a tall empty void.
  const heightClass = intro ? minH : minH.replace(/(^|\s)min-h-/g, '$1md:min-h-');

  return (
    <section
      ref={root}
      className={cn(
        'dark relative flex overflow-hidden bg-[#06080B] text-ink',
        align === 'end' ? 'items-end' : 'items-center',
        heightClass,
        className,
      )}
    >
      {media}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-[5vw] py-[clamp(80px,12vw,170px)] lg:px-8 xl:px-16">
        {children}
      </div>
    </section>
  );
}
