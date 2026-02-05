import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PinnedSection {
  start: number;
  end: number;
  settleRatio: number;
}

export const useScrollSnap = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Wait for all ScrollTriggers to be created
    const setupSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      // Build pinned ranges with settle ratios
      const pinnedSections: PinnedSection[] = pinned.map((st, index) => {
        // Default settle ratio is 0.5, but ATLAS section (index 3) uses 0.52
        const settleRatio = index === 3 ? 0.52 : 0.50;
        return {
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          settleRatio,
        };
      });

      // Create global snap
      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned section (with larger buffer for easier snapping)
            const inPinned = pinnedSections.some(
              (s) => value >= s.start - 0.03 && value <= s.end + 0.03
            );

            // If not in a pinned section, allow free scroll
            if (!inPinned) return value;

            // Find nearest pinned center
            let nearestCenter: number | null = null;
            let minDistance = Infinity;

            pinnedSections.forEach((s) => {
              const center = s.start + (s.end - s.start) * s.settleRatio;
              const distance = Math.abs(value - center);
              if (distance < minDistance) {
                minDistance = distance;
                nearestCenter = center;
              }
            });

            return nearestCenter ?? value;
          },
          duration: { min: 0.12, max: 0.25 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    // Delay to ensure all section ScrollTriggers are created
    const timer = setTimeout(setupSnap, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);
};
