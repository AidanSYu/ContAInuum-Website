import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const headlineWords = ["We", "didn't", "come", "this", "far", "to", "stop", "at", "the", "possible."];

export const FrontierSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const microRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const cta = ctaRef.current;
    const micro = microRef.current;

    if (!section || !bg || !label || !headline || !cta || !micro) return;

    const wordElements = headline.querySelectorAll('.headline-word');

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.7,
        },
      });

      // Background
      // ENTRANCE (0% - 22%)
      scrollTl.fromTo(
        bg,
        { scale: 1.14, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Label
      // ENTRANCE (5% - 18%)
      scrollTl.fromTo(
        label,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.05
      );

      // Headline words
      // ENTRANCE (10% - 30%)
      wordElements.forEach((word, i) => {
        scrollTl.fromTo(
          word,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.10 + i * 0.018
        );
      });

      // CTA + micro
      // ENTRANCE (18% - 30%)
      scrollTl.fromTo(
        cta,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.18
      );

      scrollTl.fromTo(
        micro,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.20
      );

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        bg,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

      wordElements.forEach((word, i) => {
        scrollTl.fromTo(
          word,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.78 + i * 0.01
        );
      });

      scrollTl.fromTo(
        cta,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.85
      );

      scrollTl.fromTo(
        micro,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.85
      );

      scrollTl.fromTo(
        label,
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
      className="section-pinned z-[60]"
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: 'url(/images/frontier-industrial-space.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-void/50" />

      {/* Label */}
      <div
        ref={labelRef}
        className="absolute font-mono-tech text-micro text-text-secondary tracking-[0.2em] z-10"
        style={{ left: '4vw', top: '7vh' }}
      >
        THE FRONTIER
      </div>

      {/* Headline */}
      <h2
        ref={headlineRef}
        className="absolute font-display font-bold text-text-primary text-center z-10 px-4"
        style={{
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '1000px',
          fontSize: 'clamp(28px, 5vw, 80px)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        {headlineWords.map((word, i) => (
          <span key={i} className="headline-word inline-block mr-[0.25em] will-change-transform">
            {word}
          </span>
        ))}
      </h2>

      {/* CTA */}
      <button
        ref={ctaRef}
        className="absolute btn-filled z-10 will-change-transform"
        style={{ 
          right: '4vw', 
          bottom: '8vh',
        }}
      >
        Join the team
      </button>

      {/* Micro line */}
      <div
        ref={microRef}
        className="absolute font-mono-tech text-micro text-text-secondary tracking-wider z-10 will-change-transform"
        style={{ 
          left: '4vw', 
          bottom: '8vh',
          maxWidth: '50vw',
        }}
      >
        BUILDING THE NEXT MODEL OF SCIENCE
      </div>
    </section>
  );
};
