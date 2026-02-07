import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

// Cinematic quote with flowing single-column layout
const quoteLines = [
  { text: "We've always defined ourselves by the ability", style: 'normal' },
  { text: "to overcome the impossible.", style: 'accent' },
  { text: "", style: 'spacer' },
  { text: "We counted these moments", style: 'subtle' },
  { text: "as our proudest achievements.", style: 'subtle' },
  { text: "", style: 'spacer' },
  { text: "But we lost all that.", style: 'whisper' },
  { text: "", style: 'spacer-large' },
  { text: "Perhaps we've just forgotten", style: 'normal' },
  { text: "that we are still pioneers.", style: 'strong' },
  { text: "", style: 'spacer' },
  { text: "That we've barely begun.", style: 'italic-accent' },
  { text: "And our greatest accomplishments", style: 'italic' },
  { text: "cannot be behind us.", style: 'italic' },
];

const finaleLines = [
  { text: "Because our destiny", style: 'finale' },
  { text: "lies above us.", style: 'finale' },
];

export const ThesisSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finaleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const attributionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const lines = lineRefs.current.filter(Boolean);
    const finales = finaleRefs.current.filter(Boolean);
    const attribution = attributionRef.current;

    if (!section || !bg || lines.length === 0 || finales.length === 0 || !attribution) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Background
      scrollTl.fromTo(
        bg,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, ease: 'none' },
        0
      );

      // Attribution
      scrollTl.fromTo(
        attribution,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0.02
      );

      // Quote lines - staggered reveal
      lines.forEach((line, i) => {
        const delay = 0.04 + i * 0.04;
        const style = line?.dataset.style;
        
        if (style === 'whisper') {
          scrollTl.fromTo(
            line,
            { opacity: 0, filter: 'blur(6px)' },
            { opacity: 1, filter: 'blur(0px)', ease: 'power2.out' },
            delay
          );
        } else if (style === 'subtle') {
          scrollTl.fromTo(
            line,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, ease: 'power2.out' },
            delay
          );
        } else {
          scrollTl.fromTo(
            line,
            { opacity: 0, y: 15, filter: 'blur(4px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out' },
            delay
          );
        }
      });

      // Finale - dramatic entrance
      finales.forEach((line, i) => {
        scrollTl.fromTo(
          line,
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, ease: 'power3.out' },
          0.65 + i * 0.05
        );
      });

      // Exit animations
      lines.forEach((line, i) => {
        scrollTl.fromTo(
          line,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -15, ease: 'power2.in' },
          0.85 + i * 0.003
        );
      });

      finales.forEach((line, i) => {
        scrollTl.fromTo(
          line,
          { opacity: 1, scale: 1 },
          { opacity: 0, scale: 0.95, ease: 'power2.in' },
          0.92 + i * 0.02
        );
      });

      scrollTl.fromTo(
        attribution,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.92
      );

      scrollTl.fromTo(
        bg,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.96
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const getLineStyles = (style: string) => {
    const baseStyles = {
      fontFamily: 'Sora, sans-serif',
      textShadow: '0 2px 12px rgba(7, 10, 14, 0.85)',
    };

    switch (style) {
      case 'accent':
        return {
          ...baseStyles,
          fontSize: 'clamp(20px, 2.4vw, 40px)',
          fontWeight: 700,
          color: '#F2F5F9',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          textShadow: 
            '0 0 30px rgba(255, 77, 46, 0.5), ' +
            '0 0 60px rgba(255, 77, 46, 0.3), ' +
            '0 0 90px rgba(255, 77, 46, 0.15), ' +
            '0 2px 12px rgba(7, 10, 14, 0.85)',
        };
      case 'subtle':
        return {
          ...baseStyles,
          fontSize: 'clamp(14px, 1.6vw, 26px)',
          fontWeight: 400,
          color: 'rgba(242, 245, 249, 0.7)',
          letterSpacing: '0.01em',
          lineHeight: 1.4,
        };
      case 'whisper':
        return {
          ...baseStyles,
          fontSize: 'clamp(13px, 1.3vw, 20px)',
          fontWeight: 300,
          color: 'rgba(242, 245, 249, 0.5)',
          fontStyle: 'italic',
          letterSpacing: '0.03em',
          lineHeight: 1.4,
        };
      case 'strong':
        return {
          ...baseStyles,
          fontSize: 'clamp(16px, 1.9vw, 32px)',
          fontWeight: 700,
          color: '#F2F5F9',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
        };
      case 'italic-accent':
        return {
          ...baseStyles,
          fontSize: 'clamp(15px, 1.7vw, 28px)',
          fontWeight: 500,
          fontStyle: 'italic',
          color: '#F2F5F9',
          letterSpacing: '0.01em',
          lineHeight: 1.4,
          textShadow: 
            '0 0 25px rgba(255, 77, 46, 0.4), ' +
            '0 0 50px rgba(255, 77, 46, 0.2), ' +
            '0 2px 12px rgba(7, 10, 14, 0.85)',
        };
      case 'italic':
        return {
          ...baseStyles,
          fontSize: 'clamp(14px, 1.5vw, 26px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'rgba(242, 245, 249, 0.75)',
          letterSpacing: '0.01em',
          lineHeight: 1.4,
        };
      default: // 'normal'
        return {
          ...baseStyles,
          fontSize: 'clamp(16px, 1.9vw, 32px)',
          fontWeight: 500,
          color: '#F2F5F9',
          letterSpacing: '0.01em',
          lineHeight: 1.3,
        };
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-20 overflow-hidden"
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: 'url(/images/sr71-quote-wide.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />

      {/* Gradient overlays for readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(7, 10, 14, 0.5) 0%, rgba(7, 10, 14, 0.3) 30%, rgba(7, 10, 14, 0.2) 100%)',
        }}
      />

      {/* Main content container - single column, centered-left */}
      <div 
        className="absolute inset-0 z-10 flex flex-col"
        style={{ padding: '10vh 5vw 8vh' }}
      >
        {/* Attribution - top */}
        <div 
          ref={attributionRef}
          className="font-mono-tech text-micro tracking-[0.25em] mb-8"
          style={{ 
            color: 'rgba(242, 245, 249, 0.45)',
          }}
        >
          JONATHAN NOLAN — INTERSTELLAR
        </div>

        {/* Quote content - single column flow */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-[50vw]">
            {quoteLines.map((line, i) => {
              if (line.style === 'spacer') {
                return <div key={i} style={{ height: '1.5vh' }} />;
              }
              if (line.style === 'spacer-large') {
                return <div key={i} style={{ height: '3vh' }} />;
              }
              return (
                <div
                  key={i}
                  ref={(el) => { lineRefs.current[i] = el; }}
                  data-style={line.style}
                  className="will-change-transform"
                  style={{
                    ...getLineStyles(line.style),
                    opacity: 0,
                    marginBottom: '0.4vh',
                  }}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* Finale - bottom center */}
        <div className="flex justify-center mt-auto pt-4">
          <div className="text-center">
            {finaleLines.map((line, i) => (
              <div
                key={i}
                ref={(el) => { finaleRefs.current[i] = el; }}
                className="will-change-transform leading-[1.1]"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 'clamp(22px, 3.5vw, 56px)',
                  fontWeight: 700,
                  color: '#F2F5F9',
                  letterSpacing: '-0.02em',
                  textShadow: '0 4px 20px rgba(7, 10, 14, 0.9), 0 0 60px rgba(255, 77, 46, 0.25)',
                  textTransform: 'uppercase' as const,
                  opacity: 0,
                }}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
