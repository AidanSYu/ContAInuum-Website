import { useState } from 'react';
import { Reveal } from '@/lib/scroll-fx';
import { cn } from '@/lib/utils';

/* =============================================================================
   AnnotatedShowcase — the real ATLAS dashboard with interactive hotspots that
   narrate the product. Each hotspot maps to a region of the screenshot and
   explains the piece of the thesis it embodies. No video asset required; this
   turns a static PNG into a guided product tour.

   Coordinates are percentages of the image box (the screenshot is a fixed
   layout), so they track responsively with the framed image.
   ============================================================================= */

type Hotspot = {
  n: string;
  /** position of the marker, as % of the image box */
  x: number;
  y: number;
  label: string;
  body: string;
};

const HOTSPOTS: Hotspot[] = [
  {
    n: '1',
    x: 24,
    y: 31,
    label: 'The handoff, front and center',
    body: 'When a step needs hands, ATLAS pauses the campaign and surfaces it here. Resolve it — return a TLC read, a CSV, a note — and the run resumes from exactly where it stopped.',
  },
  {
    n: '2',
    x: 49,
    y: 50,
    label: 'Memory that carries over',
    body: 'Each new campaign is seeded from prior runs in your lab. The carry-over coverage tells you how much the next run already knows before it starts.',
  },
  {
    n: '3',
    x: 60,
    y: 75,
    label: 'Every campaign, live',
    body: 'Watch each campaign progress in real time — running, awaiting a handoff, or seeded from earlier work — without chasing logs across tools.',
  },
  {
    n: '4',
    x: 82,
    y: 80,
    label: 'The knowledge graph grows',
    body: 'Recipes, failure modes, and lab lore accumulate into a graph that is yours alone. The more you run, the more the next campaign compounds.',
  },
];

export function AnnotatedShowcase({
  kicker = '[ See it run ]',
  title = 'One console for every campaign.',
  body = 'Watch campaigns progress, resolve a handoff the moment ATLAS needs you, and see the knowledge graph grow — all from a single overview. Tap a marker to see how each piece works.',
  shot = '/images/product-dashboard.png',
  shotAlt = 'ATLAS dashboard — campaign overview',
  addr = 'app.containuum.io / overview',
}: {
  kicker?: string;
  title?: string;
  body?: string;
  shot?: string;
  shotAlt?: string;
  addr?: string;
}) {
  const [active, setActive] = useState(0);
  const cur = HOTSPOTS[active];

  return (
    <section className="relative overflow-hidden border-y border-line bg-paper text-ink">
      <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative z-10 mx-auto px-[5vw] py-[clamp(64px,9vw,120px)] text-center lg:px-8 xl:px-16">
        <Reveal>
          <p className="lab-label text-safety">{kicker}</p>
          <h2 className="cine-head mt-4 text-[clamp(30px,4.4vw,58px)]">{title}</h2>
          <p className="mx-auto mt-5 max-w-[42rem] leading-relaxed text-ink-muted">{body}</p>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-12 max-w-[1080px]">
          <div className="overflow-hidden rounded-[10px] border border-white/15 bg-[#14171D] shadow-lab-lg">
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3.5 font-mono-tech text-[11px] tracking-[0.08em] text-white/40">{addr}</span>
            </div>

            {/* image + hotspots */}
            <div className="relative">
              <img src={shot} alt={shotAlt} className="block w-full" />
              {HOTSPOTS.map((h, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={h.n}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-label={`${h.label}`}
                    aria-pressed={isActive}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    <span className="relative flex h-7 w-7 items-center justify-center">
                      {isActive && (
                        <span className="absolute inset-0 animate-ping rounded-full bg-safety/40 motion-reduce:hidden" />
                      )}
                      <span
                        className={cn(
                          'relative flex h-7 w-7 items-center justify-center rounded-full border font-mono-tech text-[12px] font-semibold shadow-lg transition-colors',
                          isActive
                            ? 'border-white bg-safety text-white'
                            : 'border-white/70 bg-white/90 text-[#0D0F13] hover:bg-white',
                        )}
                      >
                        {h.n}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* legend / caption */}
          <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start sm:text-left">
            <div className="flex justify-center gap-2 sm:flex-col">
              {HOTSPOTS.map((h, i) => (
                <button
                  key={h.n}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border font-mono-tech text-[12px] font-semibold transition-colors',
                    i === active ? 'border-safety bg-safety text-white' : 'border-line text-ink-muted hover:border-line-hair hover:text-ink',
                  )}
                >
                  {h.n}
                </button>
              ))}
            </div>
            <div className="min-h-[84px] rounded-lg border border-line bg-surface p-5 text-left">
              <p className="font-display text-base font-semibold text-ink">{cur.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{cur.body}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
