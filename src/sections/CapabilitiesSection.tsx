import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    title: 'Closed-Loop Optimization',
    description: 'Design, run, measure, and re-design—automatically. ATLAS shortens iteration cycles from weeks to hours.',
    bullets: ['Bayesian search', 'Multi-objective scoring', 'Real-time constraints'],
  },
  {
    title: 'Reproducible Execution',
    description: 'Every liquid transfer, every image, every timestamp is logged and versioned. Results become reusable assets.',
    bullets: ['Full provenance', 'Versioned protocols', 'Audit-ready exports'],
  },
  {
    title: 'Scalable Infrastructure',
    description: 'Deploy a single workcell or a networked lab. ATLAS orchestrates resources across sites.',
    bullets: ['Modular hardware', 'Cloud-native control', 'Remote monitoring'],
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
          { x: '-10vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          bullets,
          { x: '6vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 75%',
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
      className="relative bg-void z-50 py-12 md:py-[10vh] px-4 md:px-[4vw]"
    >
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
          letterSpacing: '-0.02em',
          maxWidth: '90vw',
        }}
      >
        What ATLAS Enables
      </h2>

      {/* Intro */}
      <p
        ref={introRef}
        className="text-body text-text-secondary mb-[6vh]"
        style={{ maxWidth: '90vw' }}
      >
        From assay automation to materials discovery, ATLAS turns high-dimensional problems into repeatable, observable workflows.
      </p>

      {/* Capability rows */}
      <div className="space-y-6 md:space-y-[6vh]">
        {capabilities.map((cap, i) => (
          <div
            key={cap.title}
            ref={(el) => { rowsRef.current[i] = el; }}
            className="flex flex-col md:flex-row justify-between items-start p-4 md:p-[4vh] border border-text-secondary/15 bg-void-lifted/50 will-change-transform"
            style={{ borderRadius: '6px' }}
          >
            {/* Left: title + description */}
            <div className="w-full md:w-[55%] mb-4 md:mb-0">
              <h3 className="font-display font-semibold text-text-primary text-lg md:text-xl mb-2 md:mb-3">
                {cap.title}
              </h3>
              <p className="text-body text-text-secondary text-sm md:text-base">
                {cap.description}
              </p>
            </div>

            {/* Right: bullets */}
            <div className="flex flex-col gap-1 md:gap-2 w-full md:w-[35%]">
              {cap.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="capability-bullet font-mono-tech text-micro text-text-secondary tracking-wider will-change-transform"
                >
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
