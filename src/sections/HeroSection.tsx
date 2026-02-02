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
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }
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

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset to visible when scrolling back to top
            gsap.set(wordmark, { opacity: 1, scale: 1 });
            gsap.set(micro, { opacity: 1, y: 0 });
            gsap.set([bottomLeft, bottomRight], { opacity: 1, y: 0 });
          },
        },
      });

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        wordmark,
        { scale: 1, opacity: 1 },
        { scale: 1.35, opacity: 0, ease: 'power2.in' },
        0.70
      );

      scrollTl.fromTo(
        micro,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(
        [bottomLeft, bottomRight],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.80
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-void z-10"
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Wordmark */}
        <h1
          ref={wordmarkRef}
          className="font-display font-extrabold text-text-primary tracking-tight"
          style={{
            fontSize: 'clamp(72px, 10vw, 160px)',
            letterSpacing: '-0.02em',
          }}
        >
          contAInuum
        </h1>

        {/* Micro tagline */}
        <div
          ref={microRef}
          className="font-mono-tech text-micro text-text-secondary mt-6 tracking-[0.15em]"
        >
          AUTONOMOUS LABS
        </div>

        {/* Bottom left system text */}
        <div
          ref={bottomLeftRef}
          className="absolute font-mono-tech text-micro text-text-secondary tracking-wider"
          style={{ left: '4vw', bottom: '4vh' }}
        >
          SYS.VER.4.2.0 // STANDBY
        </div>

        {/* Bottom right scroll cue */}
        <div
          ref={bottomRightRef}
          className="absolute font-mono-tech text-micro text-text-secondary tracking-wider"
          style={{ right: '4vw', bottom: '4vh' }}
        >
          SCROLL TO INITIATE
        </div>
      </div>
    </section>
  );
};
