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
          end: '+=150%',
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

        {/* Body copy */}
        <p
          ref={bodyRef}
          className="text-body text-text-secondary/90 will-change-transform mb-8"
          style={{
            fontSize: 'clamp(14px, 1.1vw, 17px)',
            lineHeight: 1.7,
            maxWidth: '32vw',
            textShadow: '0 2px 20px rgba(7, 10, 14, 0.8)',
          }}
        >
          We're building the infrastructure for a new kind of science: autonomous, continuous, and precise. Our platforms combine advanced robotics, machine learning, and closed-loop control to run experiments at scales—and speeds—impossible for human teams alone.
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          className="btn-outline will-change-transform"
        >
          Request a briefing
        </button>
      </div>

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
