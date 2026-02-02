import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const quoteLines = [
  { text: "We've always defined ourselves by the ability to overcome the impossible.", bold: true },
  { text: "We counted these moments as our proudest achievements.", bold: false },
  { text: "But we lost all that.", italic: true },
  { text: "Perhaps we've just forgotten that we are still pioneers.", bold: true },
  { text: "That we've barely begun. And our greatest accomplishments cannot be behind us.", bold: false },
  { text: "Because our destiny lies above us.", bold: true, italic: true, large: true }
];

export const ThesisSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const lines = lineRefs.current.filter(Boolean);

    if (!section || !bg || lines.length === 0) return;

    const ctx = gsap.context(() => {
      // Create pinned timeline for the section
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.5,
        },
      });

      // Background fades in at start
      scrollTl.fromTo(
        bg,
        { opacity: 0 },
        { opacity: 1, ease: 'none' },
        0
      );

      // Line-by-line reveal - each line appears at specific scroll positions
      // The section stays pinned while text populates
      lines.forEach((line, i) => {
        // Entrance: line fades in
        scrollTl.fromTo(
          line,
          { opacity: 0, x: -40, filter: 'blur(6px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', ease: 'power2.out' },
          0.05 + i * 0.075 // Staggered entrance
        );
      });

      // Hold phase - all lines visible
      // Lines stay visible from ~90% to ~95% of scroll

      // Exit phase - fade out all lines together at the end
      lines.forEach((line, i) => {
        scrollTl.fromTo(
          line,
          { opacity: 1 },
          { opacity: 0, y: -20, ease: 'power2.in' },
          0.92 + i * 0.01
        );
      });

      // Background fades out at very end
      scrollTl.fromTo(
        bg,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.95
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-20 overflow-hidden"
    >
      {/* Background image - wide version, fills viewport */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: 'url(/images/sr71-quote-wide.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient overlay for text readability on left side */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(7, 10, 14, 0.7) 0%, rgba(7, 10, 14, 0.3) 40%, transparent 65%)',
        }}
      />

      {/* Quote content - positioned on left */}
      <div 
        className="absolute z-10"
        style={{ 
          left: '5vw', 
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: '45vw',
        }}
      >
        {/* Attribution */}
        <div 
          className="font-mono-tech text-micro text-text-secondary/60 tracking-[0.25em] mb-6"
        >
          JONATHAN NOLAN — INTERSTELLAR
        </div>

        {/* Quote lines */}
        <div className="space-y-2">
          {quoteLines.map((lineObj, i) => (
            <div
              key={i}
              ref={(el) => { lineRefs.current[i] = el; }}
              className="will-change-transform"
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: lineObj.large ? 'clamp(18px, 2.8vw, 42px)' : 'clamp(16px, 2.2vw, 32px)',
                fontWeight: lineObj.bold ? 700 : 400,
                fontStyle: lineObj.italic ? 'italic' : 'normal',
                color: '#F2F5F9',
                lineHeight: 1.45,
                letterSpacing: '0.01em',
                textShadow: '0 2px 12px rgba(7, 10, 14, 0.85)',
                opacity: 0, // Start hidden
              }}
            >
              {lineObj.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
