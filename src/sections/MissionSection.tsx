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
        className="absolute font-mono-tech text-micro text-text-secondary/70 tracking-[0.25em] z-10"
        style={{ left: '4vw', top: '8vh' }}
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
          maxWidth: '38vw',
        }}
      >
        {/* Headline - integrated with the cosmic theme */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-text-primary will-change-transform mb-6"
          style={{
            fontSize: 'clamp(28px, 3.5vw, 56px)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 30px rgba(7, 10, 14, 0.9)',
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

        {/* Body copy - The Hook */}
        <p
          ref={bodyRef}
          className="text-body text-text-secondary/90 will-change-transform mb-6"
          style={{
            fontSize: 'clamp(13px, 1.05vw, 16px)',
            lineHeight: 1.7,
            maxWidth: '36vw',
            textShadow: '0 2px 20px rgba(7, 10, 14, 0.8)',
          }}
        >
          Global research and development spending exceeds <strong className="text-text-primary">$800 billion</strong> annually, yet scientific throughput remains fundamentally constrained. Studies show that <strong className="text-text-primary">20–50%</strong> of experimental capacity is lost to manual repetition, protocol errors, poor data management, and disconnected systems, while large fractions of published experiments fail to reproduce. The data already exists at massive scale, but it is fragmented across papers, lab notebooks, instrument logs, and raw spectra, rendering most experimental knowledge inert rather than cumulative.
          <br /><br />
          <strong className="text-text-primary">contAInuum</strong> is built on the belief that discovery is <em>bottlenecked by cognition, not automation</em>. We are building persistent knowledge structures that unify literature, experimental records, and instrument-level data into a single reasoning substrate. Our first step is a horizontal intelligence layer that connects disparate scientific sources and closes the loop through reasoning before any experiment is executed.
        </p>

        {/* Market stats row */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="stat-card">
            <div className="stat-value">$800B+</div>
            <div className="stat-label">Global R&D Market</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">10-100x</div>
            <div className="stat-label">Throughput Increase</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Continuous Operation</div>
          </div>
        </div>

        {/* Why this matters */}
        <p className="text-body text-text-secondary/70 mb-6" style={{
          fontSize: 'clamp(12px, 0.95vw, 15px)',
          lineHeight: 1.6,
          maxWidth: '34vw',
          fontStyle: 'italic',
        }}>
          We did not build this because it was easy. We built it because the hardest problems in climate, disease, energy, and matter demand orders of magnitude more experimentation than human hands alone can execute. The OS is the substrate. The lab is the interface. The science is the outcome.
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          className="btn-outline will-change-transform"
        >
          Request a briefing
        </button>
      </div>

      {/* Stats card styles */}
      <style>{`
        .stat-card {
          background: rgba(7, 10, 14, 0.5);
          border: 1px solid rgba(159, 176, 199, 0.15);
          border-radius: 6px;
          padding: 12px 16px;
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
