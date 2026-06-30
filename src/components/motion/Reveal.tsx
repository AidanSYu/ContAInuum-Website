import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Render as a different element (e.g. 'section', 'h2'). Defaults to div. */
  as?: ElementType;
  /** Travel distance in px. */
  y?: number;
  delay?: number;
  /** Stagger this element's direct children instead of the element itself. */
  stagger?: boolean;
  id?: string;
};

/* Transform + opacity reveal on scroll into view. GPU-friendly, fires once,
   fully gated behind prefers-reduced-motion (content stays visible if motion is
   off or JS fails, `.reveal` defaults to opacity:1). */
export function Reveal({
  children,
  className,
  as: Tag = 'div',
  y = 26,
  delay = 0,
  stagger = false,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : el;
        gsap.set(targets, { autoAlpha: 0, y });
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          delay,
          stagger: stagger ? 0.08 : 0,
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} id={id} className={cn('reveal', className)}>
      {children}
    </Tag>
  );
}
