import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const layers = [
  {
    number: '01',
    title: 'Cognitive Substrate',
    description:
      'A unified knowledge graph that resolves compounds, protocols, and outcomes into a single, queryable model.',
  },
  {
    number: '02',
    title: 'Agentic Control Plane',
    description:
      'Planning and verification agents that design experiments, validate results, and adapt the next run in real time.',
  },
  {
    number: '03',
    title: 'Physical Perception',
    description:
      'Precision robotics and computer vision that handle materials, measure outcomes, and maintain closed-loop fidelity.',
  },
];

export const AtlasSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current.filter(Boolean);
    const image = imageRef.current;

    if (!section || !label || !headline || cards.length === 0 || !image) return;

    const ctx = gsap.context(() => {
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

      // Image
      gsap.fromTo(
        image,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.05,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="atlas"
      className="section-pinned relative bg-void overflow-hidden"
    >
      {/* Subtle background tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(255, 77, 46, 0.04) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 py-[12vh] px-6 md:px-[5vw]">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <div
            ref={labelRef}
            className="font-mono-tech text-micro text-text-secondary tracking-[0.2em] mb-4"
          >
            ATLAS
          </div>
          <h2
            ref={headlineRef}
            className="font-display font-bold text-text-primary will-change-transform"
            style={{
              fontSize: 'clamp(28px, 4vw, 64px)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              maxWidth: '700px',
            }}
          >
            The Cognitive Operating System
          </h2>
        </div>

        {/* Sticky visualization layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Scrolling layer cards */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            {layers.map((layer, i) => (
              <div
                key={layer.number}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="will-change-transform"
                style={{
                  background: 'rgba(14, 20, 28, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: 'clamp(20px, 3vw, 32px)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Layer number */}
                <div className="font-mono-tech text-micro text-text-secondary tracking-wider mb-3">
                  LAYER {layer.number}
                </div>

                {/* Orange accent rule */}
                <div
                  className="h-[2px] bg-safety mb-4"
                  style={{ width: '40px' }}
                />

                {/* Title */}
                <h3
                  className="font-display font-semibold text-text-primary mb-3"
                  style={{ fontSize: 'clamp(18px, 1.5vw, 24px)' }}
                >
                  {layer.title}
                </h3>

                {/* Description */}
                <p
                  className="text-text-secondary"
                  style={{
                    fontSize: 'clamp(13px, 1vw, 16px)',
                    lineHeight: 1.65,
                  }}
                >
                  {layer.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Sticky knowledge graph visualization */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-[14vh]">
              <div
                ref={imageRef}
                className="rounded-lg overflow-hidden will-change-transform"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div
                  style={{
                    backgroundImage: 'url(/images/atlas-knowledge-graph.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    aspectRatio: '4 / 3',
                    width: '100%',
                  }}
                />
              </div>

              {/* Caption beneath sticky image */}
              <div
                className="font-mono-tech text-micro text-text-secondary/50 tracking-wider mt-4 text-center"
              >
                ATLAS KNOWLEDGE GRAPH — LIVE TOPOLOGY
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
