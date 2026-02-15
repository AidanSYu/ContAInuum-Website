import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '$2.5T', label: 'Annual R&D', detail: 'Global expenditure (R&D World)' },
  { value: '50%', label: 'Non-reproducible', detail: 'Lost to protocol errors (PLOS Biology)' },
  { value: '40%', label: 'Time wasted', detail: 'On manual orchestration' },
  { value: '$1T', label: 'Innovation tax', detail: 'Fragmented systems cost annually' },
];

export const MissionSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const statCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const cards = statCardsRef.current.filter(Boolean);
    const cta = ctaRef.current;

    if (!section || !bg || !label || !headline || !leftCol || !rightCol || !cta) return;

    const ctx = gsap.context(() => {
      // Background parallax
      gsap.fromTo(
        bg,
        { scale: 1.06 },
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

      // Label
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
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Headline
      gsap.fromTo(
        headline,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Stat cards stagger
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: leftCol,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Right column
      gsap.fromTo(
        rightCol,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: rightCol,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // CTA
      gsap.fromTo(
        cta,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 90%',
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
      id="mission"
      className="section-pinned relative overflow-hidden"
    >
      {/* Background — Gargantua black hole */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: 'url(/images/gargantua-blackhole.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 65% 50%, transparent 10%, rgba(7, 10, 14, 0.55) 35%, rgba(7, 10, 14, 0.88) 65%, rgba(7, 10, 14, 0.95) 100%)',
        }}
      />
      {/* Extra darkening on the right half where text sits */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent 30%, rgba(7, 10, 14, 0.55) 55%, rgba(7, 10, 14, 0.75) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 py-[14vh] px-6 md:px-[5vw]">
        {/* Label */}
        <div
          ref={labelRef}
          className="font-mono-tech text-micro tracking-[0.25em] mb-6"
          style={{ color: 'rgba(242, 245, 249, 0.45)' }}
        >
          MISSION
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-text-primary mb-12 md:mb-16 will-change-transform"
          style={{
            fontSize: 'clamp(28px, 3.6vw, 58px)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            textShadow: '0 4px 30px rgba(7, 10, 14, 0.9)',
            maxWidth: '700px',
          }}
        >
          The Rhetoric of Humanity
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #F2F5F9 0%, #FF4D2E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Confronting the Infinite.
          </span>
        </h2>

        {/* 2-column: Data vs Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: The Data */}
          <div ref={leftColRef}>
            <div className="font-mono-tech text-micro tracking-[0.2em] text-safety mb-6">
              THE DATA
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  ref={(el) => {
                    statCardsRef.current[i] = el;
                  }}
                  className="will-change-transform"
                  style={{
                    background: 'rgba(7, 10, 14, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '16px 18px',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div
                    className="font-display font-bold text-safety"
                    style={{ fontSize: 'clamp(20px, 2vw, 32px)', lineHeight: 1.2 }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-mono-tech text-micro text-text-primary tracking-wider mt-1">
                    {stat.label}
                  </div>
                  <div
                    className="text-text-secondary/60 mt-1"
                    style={{ fontSize: '11px', lineHeight: 1.4 }}
                  >
                    {stat.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The Vision */}
          <div
            ref={rightColRef}
            className="will-change-transform"
            style={{
              background: 'rgba(7, 10, 14, 0.45)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              borderRadius: '12px',
              padding: 'clamp(20px, 2.5vw, 32px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div className="font-mono-tech text-micro tracking-[0.2em] text-safety mb-6">
              THE VISION
            </div>
            <p
              className="text-text-primary/90 mb-6"
              style={{
                fontSize: 'clamp(13px, 1vw, 16px)',
                lineHeight: 1.7,
                textShadow: '0 2px 12px rgba(7, 10, 14, 1), 0 0 40px rgba(7, 10, 14, 0.7)',
              }}
            >
              <strong className="text-text-primary">ContAInuum</strong> is building{' '}
              <strong className="text-text-primary">Atlas</strong> to reclaim this
              potential — unifying literature, experimental records, and
              instrument-level data into a single autonomous reasoning substrate.
            </p>
            <p
              className="text-text-secondary mb-8"
              style={{
                fontSize: 'clamp(12px, 0.9vw, 15px)',
                lineHeight: 1.65,
                textShadow: '0 2px 12px rgba(7, 10, 14, 1), 0 0 40px rgba(7, 10, 14, 0.7)',
              }}
            >
              By closing the loop with intelligence before execution, we
              transition science from disconnected trials to{' '}
              <em>continuous, cumulative intelligence</em>. We are building{' '}
              <strong className="text-text-primary">
                the operating system for the next century of discovery
              </strong>
              .
            </p>

            {/* Highlight line */}
            <div
              className="font-display text-text-secondary/70 italic mb-8"
              style={{
                fontSize: 'clamp(12px, 0.85vw, 14px)',
                lineHeight: 1.55,
                borderLeft: '2px solid rgba(255, 77, 46, 0.4)',
                paddingLeft: '16px',
                textShadow: '0 2px 12px rgba(7, 10, 14, 1)',
              }}
            >
              The hardest problems in climate, disease, and energy demand more
              experimentation than human hands alone can execute. The OS is the
              substrate. The lab is the interface.
            </div>

            <button
              ref={ctaRef}
              className="btn-filled will-change-transform"
            >
              Request a briefing
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute z-10 hidden lg:block font-mono-tech text-micro tracking-[0.2em]"
        style={{
          right: '4vw',
          top: '14vh',
          color: 'rgba(242, 245, 249, 0.25)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}
      >
        AUTONOMOUS // CONTINUOUS // PRECISE
      </div>

      <div
        className="absolute font-mono-tech text-micro z-10"
        style={{
          right: '4vw',
          bottom: '4vh',
          color: 'rgba(242, 245, 249, 0.25)',
          letterSpacing: '0.15em',
        }}
      >
        BEYOND THE EVENT HORIZON
      </div>
    </section>
  );
};
