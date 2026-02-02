import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const layers = [
  {
    number: '01',
    title: 'Cognitive Substrate',
    description: 'A unified knowledge graph that resolves compounds, protocols, and outcomes into a single, queryable model.',
  },
  {
    number: '02',
    title: 'Agentic Control Plane',
    description: 'Planning and verification agents that design experiments, validate results, and adapt the next run in real time.',
  },
  {
    number: '03',
    title: 'Physical Perception',
    description: 'Precision robotics and computer vision that handle materials, measure outcomes, and maintain closed-loop fidelity.',
  },
];

export const AtlasSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rulesRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current.filter(Boolean);
    const rules = rulesRef.current.filter(Boolean);

    if (!section || !bg || !label || !headline || cards.length === 0) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.7,
        },
      });

      // Background
      // ENTRANCE (0% - 22%)
      scrollTl.fromTo(
        bg,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, ease: 'none' },
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

      // Headline
      // ENTRANCE (8% - 30%)
      scrollTl.fromTo(
        headline,
        { y: '-40vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.08
      );

      // Cards with stagger
      // ENTRANCE (18% - 42%)
      cards.forEach((card, i) => {
        scrollTl.fromTo(
          card,
          { y: '60vh', opacity: 0, rotateX: 8 },
          { y: 0, opacity: 1, rotateX: 0, ease: 'power2.out' },
          0.18 + i * 0.04
        );
      });

      // Orange rules
      // ENTRANCE (24% - 40%)
      rules.forEach((rule, i) => {
        scrollTl.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, ease: 'power2.out' },
          0.24 + i * 0.04
        );
      });

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        bg,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.78
      );

      scrollTl.fromTo(
        headline,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.75
      );

      cards.forEach((card, i) => {
        scrollTl.fromTo(
          card,
          { y: 0, opacity: 1 },
          { y: '18vh', opacity: 0, ease: 'power2.in' },
          0.72 + i * 0.02
        );
      });

      rules.forEach((rule, i) => {
        scrollTl.fromTo(
          rule,
          { scaleX: 1 },
          { scaleX: 0, ease: 'power2.in' },
          0.85 + i * 0.02
        );
      });

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
      id="atlas"
      className="section-pinned z-40"
    >
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: 'url(/images/atlas-knowledge-graph.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-void/60" />

      {/* Label */}
      <div
        ref={labelRef}
        className="absolute font-mono-tech text-micro text-text-secondary tracking-[0.2em] z-10"
        style={{ left: '4vw', top: '7vh' }}
      >
        ATLAS
      </div>

      {/* Headline */}
      <h2
        ref={headlineRef}
        className="absolute font-display font-bold text-text-primary text-center z-10 will-change-transform px-4"
        style={{
          top: '10vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '900px',
          fontSize: 'clamp(24px, 4vw, 64px)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
      >
        ATLAS: The Cognitive Operating System
      </h2>

      {/* Layer cards */}
      <div 
        className="absolute z-10 flex flex-col md:flex-row justify-center gap-4 md:gap-[3vw] px-4 md:px-0" 
        style={{ 
          top: 'auto',
          bottom: '8vh',
          left: '0', 
          right: '0' 
        }}
      >
        {layers.map((layer, i) => (
          <div
            key={layer.number}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="will-change-transform w-full md:w-[26vw] max-w-[380px]"
            style={{
              perspective: '900px',
            }}
          >
            <div
              className="p-4 md:p-6 border border-text-secondary/20 bg-void/80"
              style={{ borderRadius: '6px' }}
            >
              {/* Layer number */}
              <div className="font-mono-tech text-micro text-text-secondary tracking-wider mb-2 md:mb-3">
                LAYER {layer.number}
              </div>

              {/* Orange rule */}
              <div
                ref={(el) => { rulesRef.current[i] = el; }}
                className="h-[2px] bg-safety mb-3 md:mb-4 will-change-transform"
                style={{ width: '40px', transformOrigin: 'left' }}
              />

              {/* Title */}
              <h3 className="font-display font-semibold text-text-primary text-base md:text-xl mb-2 md:mb-3">
                {layer.title}
              </h3>

              {/* Description */}
              <p className="text-body text-text-secondary text-sm md:text-base">
                {layer.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
