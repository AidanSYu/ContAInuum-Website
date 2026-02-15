import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const microRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    const micro = microRef.current;
    const bottomLeft = bottomLeftRef.current;
    const bottomRight = bottomRightRef.current;

    if (!section || !wordmark || !micro || !bottomLeft || !bottomRight) return;

    const ctx = gsap.context(() => {
      // Load animation (auto-play on mount)
      const loadTl = gsap.timeline({ delay: 0.2 });

      loadTl.fromTo(
        wordmark,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
      );

      loadTl.fromTo(
        micro,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.5'
      );

      loadTl.fromTo(
        [bottomLeft, bottomRight],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        '-=0.3'
      );

      // Scroll-driven parallax fade (no pin)
      // Use fromTo so the "from" values are explicit — scrubbing
      // back to progress 0 always restores full visibility.
      gsap.fromTo(
        wordmark,
        { y: 0, opacity: 1, scale: 1 },
        {
          y: -100,
          opacity: 0,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        micro,
        { y: 0, opacity: 1 },
        {
          y: -50,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '70% top',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [bottomLeft, bottomRight],
        { opacity: 1 },
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '50% top',
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-void flex items-center justify-center"
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Wordmark — architectural, dominant */}
        <h1
          ref={wordmarkRef}
          className="font-display font-extrabold text-text-primary will-change-transform"
          style={{
            fontSize: 'clamp(80px, 13vw, 220px)',
            letterSpacing: '-0.05em',
            lineHeight: 0.9,
          }}
        >
          contAInuum
        </h1>

        {/* Micro tagline */}
        <div
          ref={microRef}
          className="font-mono-tech text-micro text-text-secondary mt-8 tracking-[0.25em]"
        >
          AUTONOMOUS LABS
        </div>

        {/* Bottom left system text */}
        <div
          ref={bottomLeftRef}
          className="absolute font-mono-tech text-micro text-text-secondary/60 tracking-wider"
          style={{ left: '4vw', bottom: '4vh' }}
        >
          SYS.VER.4.2.0 // STANDBY
        </div>

        {/* Bottom right scroll cue */}
        <div
          ref={bottomRightRef}
          className="absolute font-mono-tech text-micro text-text-secondary/60 tracking-wider"
          style={{ right: '4vw', bottom: '4vh' }}
        >
          SCROLL TO INITIATE
        </div>
      </div>
    </section>
  );
};
