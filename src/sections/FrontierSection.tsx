import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const headlineWords = [
  'We',
  "didn't",
  'come',
  'this',
  'far',
  'to',
  'stop',
  'at',
  'the',
  'possible.',
];

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
      // Background parallax
      gsap.fromTo(
        bg,
        { scale: 1.1 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Label entrance
      gsap.fromTo(
        label,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Headline words stagger
      gsap.fromTo(
        wordElements,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // CTA + micro
      gsap.fromTo(
        cta,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        micro,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned relative flex items-center justify-center overflow-hidden"
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
      <div className="absolute inset-0 bg-void/55" />

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
        className="relative font-display font-bold text-text-primary text-center z-10 px-6 md:px-8"
        style={{
          maxWidth: '1000px',
          fontSize: 'clamp(28px, 5vw, 80px)',
          lineHeight: 1.15,
          letterSpacing: '-0.025em',
        }}
      >
        {headlineWords.map((word, i) => (
          <span
            key={i}
            className="headline-word inline-block mr-[0.25em] will-change-transform"
          >
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
