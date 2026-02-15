import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Distilled to the most powerful lines
const thesisLines = [
  { text: "We've always defined ourselves by the ability", weight: 500, size: 'md' as const },
  { text: "to overcome the impossible.", weight: 700, size: 'lg' as const },
  { text: "Perhaps we've just forgotten", weight: 400, size: 'md' as const },
  { text: "that we are still pioneers.", weight: 700, size: 'lg' as const },
];

const finaleLine = { text: "Our destiny lies above us.", weight: 700 };

export const ThesisSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const attributionRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const finaleRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const attribution = attributionRef.current;
    const lines = lineRefs.current.filter(Boolean);
    const finale = finaleRef.current;

    if (!section || !bg || !attribution || lines.length === 0 || !finale) return;

    const ctx = gsap.context(() => {
      // Master timeline scrubbed to the section's scroll progress
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // Background image fades in subtly
      tl.fromTo(bg, { opacity: 0 }, { opacity: 0.35, duration: 0.12, ease: 'none' }, 0);

      // Attribution
      tl.fromTo(
        attribution,
        { opacity: 0, y: -8 },
        { opacity: 0.6, y: 0, duration: 0.08, ease: 'power2.out' },
        0.03
      );

      // Each line highlights in sequence then dims
      const totalLines = lines.length;
      const lineWindow = 0.65 / totalLines;

      lines.forEach((line, i) => {
        const startAt = 0.08 + i * lineWindow;

        // Fade in + rise
        tl.fromTo(
          line,
          { opacity: 0.08, y: 12, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: lineWindow * 0.5, ease: 'power2.out' },
          startAt
        );

        // Dim back (except last main line stays slightly visible)
        if (i < totalLines - 1) {
          tl.to(
            line,
            { opacity: 0.2, duration: lineWindow * 0.4, ease: 'power2.in' },
            startAt + lineWindow * 0.6
          );
        }
      });

      // Finale line — dramatic entrance
      tl.fromTo(
        finale,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: 'power3.out' },
        0.72
      );

      // Exit: everything fades out
      tl.to(attribution, { opacity: 0, duration: 0.06 }, 0.88);
      lines.forEach((line, i) => {
        tl.to(line, { opacity: 0, duration: 0.06 }, 0.88 + i * 0.008);
      });
      tl.to(finale, { opacity: 0, y: -10, duration: 0.08 }, 0.90);
      tl.to(bg, { opacity: 0, duration: 0.08 }, 0.92);
    }, section);

    return () => ctx.revert();
  }, []);

  const getSizeStyles = (size: 'md' | 'lg') => {
    if (size === 'lg') {
      return {
        fontSize: 'clamp(22px, 2.8vw, 46px)',
        textShadow:
          '0 0 30px rgba(255, 77, 46, 0.25), 0 2px 12px rgba(7, 10, 14, 0.85)',
      };
    }
    return {
      fontSize: 'clamp(17px, 2vw, 34px)',
      textShadow: '0 2px 12px rgba(7, 10, 14, 0.85)',
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '260vh' }}
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: 'url(/images/sr71-quote-wide.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            opacity: 0,
          }}
        />

        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(7, 10, 14, 0.6) 0%, rgba(7, 10, 14, 0.45) 40%, rgba(7, 10, 14, 0.6) 100%)',
          }}
        />

        {/* Text content */}
        <div className="relative z-10 max-w-4xl text-center px-6 md:px-12">
          {/* Attribution */}
          <div
            ref={attributionRef}
            className="font-mono-tech text-micro tracking-[0.25em] mb-10 md:mb-14"
            style={{ color: 'rgba(242, 245, 249, 0.35)', opacity: 0 }}
          >
            JONATHAN NOLAN — INTERSTELLAR
          </div>

          {/* Main lines */}
          <div className="space-y-2 md:space-y-3">
            {thesisLines.map((line, i) => (
              <p
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="font-display will-change-transform"
                style={{
                  fontWeight: line.weight,
                  color: '#F2F5F9',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.35,
                  opacity: 0.08,
                  ...getSizeStyles(line.size),
                }}
              >
                {line.text}
              </p>
            ))}
          </div>

          {/* Finale */}
          <p
            ref={finaleRef}
            className="font-display will-change-transform mt-8 md:mt-12"
            style={{
              fontSize: 'clamp(26px, 3.8vw, 62px)',
              fontWeight: 700,
              color: '#F2F5F9',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              textTransform: 'uppercase' as const,
              textShadow:
                '0 4px 20px rgba(7, 10, 14, 0.9), 0 0 60px rgba(255, 77, 46, 0.2)',
              opacity: 0,
            }}
          >
            {finaleLine.text}
          </p>
        </div>
      </div>
    </section>
  );
};
