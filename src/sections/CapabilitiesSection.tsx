import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    title: 'Closed-Loop Optimization',
    description:
      'Design, run, measure, and re-design—automatically. ATLAS shortens iteration cycles from weeks to hours.',
    bullets: ['Bayesian search', 'Multi-objective scoring', 'Real-time constraints'],
  },
  {
    title: 'Reproducible Execution',
    description:
      'Every liquid transfer, every image, every timestamp is logged and versioned. Results become reusable assets.',
    bullets: ['Full provenance', 'Versioned protocols', 'Audit-ready exports'],
  },
  {
    title: 'Local-First Infrastructure',
    description:
      'Deploy autonomous labs with local computation and data sovereignty. ATLAS operates independently or connects to larger networks as needed.',
    bullets: ['Edge-first architecture', 'On-device intelligence', 'Optional cloud sync'],
  },
];

export const CapabilitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const intro = introRef.current;
    const rows = rowsRef.current.filter(Boolean);

    if (!section || !label || !headline || !intro) return;

    const ctx = gsap.context(() => {
      // Label
      gsap.fromTo(
        label,
        { y: 24, opacity: 0 },
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
        { y: 24, opacity: 0 },
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

      // Intro
      gsap.fromTo(
        intro,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Rows
      rows.forEach((row) => {
        if (!row) return;
        const bullets = row.querySelectorAll('.capability-bullet');

        gsap.fromTo(
          row,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          bullets,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-void py-16 md:py-[12vh] px-6 md:px-[5vw] overflow-hidden"
    >
      {/* Radial glow accents for depth */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          right: '-10%',
          width: '60%',
          height: '60%',
          background:
            'radial-gradient(ellipse at center, rgba(255, 77, 46, 0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-15%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(159, 176, 199, 0.04) 0%, transparent 70%)',
        }}
      />

      {/* Label */}
      <div
        ref={labelRef}
        className="font-mono-tech text-micro text-text-secondary tracking-[0.2em] mb-6"
      >
        CAPABILITIES
      </div>

      {/* Headline */}
      <h2
        ref={headlineRef}
        className="font-display font-bold text-text-primary mb-6"
        style={{
          fontSize: 'clamp(28px, 4vw, 64px)',
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          maxWidth: '700px',
        }}
      >
        What ATLAS Enables
      </h2>

      {/* Intro */}
      <p
        ref={introRef}
        className="text-body text-text-secondary mb-10 md:mb-[6vh]"
        style={{ maxWidth: '700px' }}
      >
        From assay automation to materials discovery, ATLAS turns
        high-dimensional problems into repeatable, observable workflows.
      </p>

      {/* Capability rows */}
      <div className="space-y-5 md:space-y-6">
        {capabilities.map((cap, i) => (
          <div
            key={cap.title}
            ref={(el) => {
              rowsRef.current[i] = el;
            }}
            className="flex flex-col md:flex-row justify-between items-start will-change-transform"
            style={{
              padding: 'clamp(20px, 3vw, 32px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              background: 'rgba(14, 20, 28, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {/* Left: title + description */}
            <div className="w-full md:w-[55%] mb-4 md:mb-0">
              <h3
                className="font-display font-semibold text-text-primary mb-2 md:mb-3"
                style={{ fontSize: 'clamp(17px, 1.4vw, 22px)' }}
              >
                {cap.title}
              </h3>
              <p
                className="text-text-secondary"
                style={{
                  fontSize: 'clamp(13px, 1vw, 16px)',
                  lineHeight: 1.65,
                }}
              >
                {cap.description}
              </p>
            </div>

            {/* Right: bullets */}
            <div className="flex flex-col gap-2 w-full md:w-[35%]">
              {cap.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="capability-bullet font-mono-tech text-micro text-text-secondary/70 tracking-wider will-change-transform flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-safety/60 flex-shrink-0" />
                  {bullet}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
