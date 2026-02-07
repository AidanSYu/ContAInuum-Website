import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const MissionSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const orbitTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const body = bodyRef.current;
    const cta = ctaRef.current;
    const orbitText = orbitTextRef.current;

    if (!section || !bg || !label || !headline || !body || !cta || !orbitText) return;

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

      // Background - subtle parallax
      scrollTl.fromTo(
        bg,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Label
      scrollTl.fromTo(
        label,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.05
      );

      // Headline - appears from the black hole center
      scrollTl.fromTo(
        headline,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, ease: 'power2.out' },
        0.08
      );

      // Body text
      scrollTl.fromTo(
        body,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.15
      );

      // CTA
      scrollTl.fromTo(
        cta,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'power2.out' },
        0.22
      );

      // Orbiting text - fades in
      scrollTl.fromTo(
        orbitText,
        { opacity: 0, rotate: -10 },
        { opacity: 1, rotate: 0, ease: 'power2.out' },
        0.18
      );

      // EXIT phase
      scrollTl.fromTo(
        bg,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(
        headline,
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.9, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        body,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(
        cta,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.78
      );

      scrollTl.fromTo(
        orbitText,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.76
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
      id="mission"
      className="section-pinned z-30 overflow-hidden"
    >
      {/* Background - Gargantua black hole */}
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
          background: 'radial-gradient(ellipse at 65% 50%, transparent 20%, rgba(7, 10, 14, 0.6) 60%, rgba(7, 10, 14, 0.9) 100%)',
        }}
      />

      {/* Label - top left, below nav */}
      <div
        ref={labelRef}
        className="absolute font-mono-tech text-micro tracking-[0.25em] z-10"
        style={{ 
          left: '4vw', 
          top: '10vh',
          color: 'rgba(242, 245, 249, 0.5)',
          textShadow: '0 2px 8px rgba(7, 10, 14, 0.8)',
        }}
      >
        MISSION
      </div>

      {/* Main content - positioned on left side, away from black hole */}
      <div 
        className="absolute z-10"
        style={{ 
          left: '6vw', 
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: '50vw',
        }}
      >
        {/* Headline - integrated with the cosmic theme */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-text-primary will-change-transform mb-6"
          style={{
            fontSize: 'clamp(24px, 3.2vw, 52px)',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 30px rgba(7, 10, 14, 0.9)',
            whiteSpace: 'nowrap',
          }}
        >
          The Rhetoric of Humanity
          <br />
          <span style={{ 
            background: 'linear-gradient(135deg, #F2F5F9 0%, #FF4D2E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Confronting the Infinite.
          </span>
        </h2>

        {/* Body copy - The Hook - Compact version */}
        <p
          ref={bodyRef}
          className="text-body text-text-secondary/90 will-change-transform mb-5"
          style={{
            fontSize: 'clamp(11px, 0.9vw, 14px)',
            lineHeight: 1.6,
            maxWidth: '38vw',
            textShadow: '0 2px 20px rgba(7, 10, 14, 0.8)',
          }}
        >
          Global R&D expenditure has reached <strong className="text-text-primary">$2.5 trillion</strong> annually (<em>R&D World</em>), yet <em>PLOS Biology</em> reports that up to <strong className="text-text-primary">50%</strong> of this output is non-reproducible due to protocol errors and disconnected systems. Fragmented data and manual orchestration currently consume <strong className="text-text-primary">40%</strong> of researcher time, creating a <strong className="text-text-primary">$1 trillion</strong> annual "innovation tax" that leaves most scientific knowledge inert rather than cumulative.
          <br /><br />
          <strong className="text-text-primary">ContAInuum</strong> is building <strong className="text-text-primary">Atlas</strong> to reclaim this potential by unifying literature, experimental records, and instrument-level data into a single autonomous reasoning substrate. By closing the loop with intelligence before execution, we transition science from a sequence of disconnected trials to a <em>continuous, cumulative intelligence</em>. We are building <strong className="text-text-primary">the operating system for the next century of discovery</strong>.
        </p>

        {/* Market stats row - Compact */}
        <div className="flex flex-wrap gap-4 mb-5">
          <div className="stat-card">
            <div className="stat-value">$800B+</div>
            <div className="stat-label">Global R&D</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">10-100x</div>
            <div className="stat-label">Throughput</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Continuous</div>
          </div>
        </div>

        {/* Why this matters - Compact */}
        <p className="text-body text-text-secondary/70 mb-5" style={{
          fontSize: 'clamp(11px, 0.85vw, 14px)',
          lineHeight: 1.55,
          maxWidth: '32vw',
          fontStyle: 'italic',
        }}>
          The hardest problems in climate, disease, and energy demand more experimentation than human hands alone can execute. The OS is the substrate. The lab is the interface.
        </p>

      </div>

      {/* CTA - Centered at bottom of page */}
      <button
        ref={ctaRef}
        className="absolute z-10 will-change-transform px-6 py-3 font-mono-tech text-sm tracking-wider rounded border transition-all duration-300"
        style={{
          left: '50%',
          bottom: '6vh',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(242, 245, 249, 0.95)',
          color: '#070A0E',
          borderColor: 'rgba(242, 245, 249, 0.95)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#FF4D2E';
          e.currentTarget.style.borderColor = '#FF4D2E';
          e.currentTarget.style.color = '#F2F5F9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(242, 245, 249, 0.95)';
          e.currentTarget.style.borderColor = 'rgba(242, 245, 249, 0.95)';
          e.currentTarget.style.color = '#070A0E';
        }}
      >
        Request a briefing
      </button>

      {/* Stats card styles */}
      <style>{`
        .stat-card {
          background: rgba(7, 10, 14, 0.5);
          border: 1px solid rgba(159, 176, 199, 0.15);
          border-radius: 6px;
          padding: 10px 14px;
          backdrop-filter: blur(8px);
        }
        .stat-value {
          font-family: 'Sora', sans-serif;
          font-size: clamp(16px, 1.4vw, 22px);
          font-weight: 700;
          color: #FF4D2E;
          line-height: 1.2;
        }
        .stat-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: clamp(9px, 0.75vw, 11px);
          color: rgba(242, 245, 249, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }
      `}</style>

      {/* Orbiting text - curved around the black hole area */}
      <div
        ref={orbitTextRef}
        className="absolute z-10 will-change-transform hidden lg:block"
        style={{
          right: '8vw',
          top: '15vh',
          transform: 'rotate(5deg)',
          transformOrigin: 'left center',
        }}
      >
        <div 
          className="font-mono-tech text-micro tracking-[0.2em]"
          style={{
            color: 'rgba(242, 245, 249, 0.4)',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}
        >
          AUTONOMOUS // CONTINUOUS // PRECISE
        </div>
      </div>

      {/* Bottom right accent text */}
      <div
        className="absolute font-mono-tech text-micro z-10"
        style={{ 
          right: '4vw', 
          bottom: '5vh',
          color: 'rgba(242, 245, 249, 0.35)',
          letterSpacing: '0.15em',
        }}
      >
        BEYOND THE EVENT HORIZON
      </div>
    </section>
  );
};
