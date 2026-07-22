import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/* Physics-based smooth scroll (Lenis) driving GSAP's ScrollTrigger update loop.
   This is the foundation of the "expensive" eased-scroll feel. Disabled when the
   user prefers reduced motion. Renders nothing. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // `lerp` (not `duration`) for a premium, hand-tracking glide: the page eases a
    // fixed fraction toward the target each frame, so it stays glued to your input
    // instead of coasting for a fixed duration. 0.16 preserves the glide but reaches
    // the target in roughly half the time of the old 0.1 setting, removing input lag.
    const lenis = new Lenis({ lerp: 0.16, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // Re-measure trigger positions once webfonts settle.
    let active = true;
    document.fonts?.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });

    return () => {
      active = false;
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
