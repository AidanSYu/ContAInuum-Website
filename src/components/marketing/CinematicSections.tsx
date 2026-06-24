import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal, useCountUp } from '@/lib/scroll-fx';
import { cn } from '@/lib/utils';

/* =============================================================================
   CinematicSections — the SpaceX-fused building blocks for the landing page.
   Split into per-file components later if you prefer; kept together here so the
   port is a single drop-in. All veils are inline gradients (1:1 with the mockup).
   ============================================================================= */

/* Dark veil kept for the one remaining cinematic section (StatBand) — a
   deliberate high-contrast "spread" against the surrounding paper. */
const VEIL_STAT = 'linear-gradient(180deg, rgba(11,13,17,.55), rgba(11,13,17,.85))';

/* ---- Cinematic CTA buttons (uppercase, tracked, rectangular) --------------- */
export function CineButton({
  href,
  variant = 'solid',
  children,
}: {
  href: string;
  variant?: 'solid' | 'outline';
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-2 rounded-[2px] border px-7 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.2em] transition-colors',
        variant === 'solid'
          ? 'border-white bg-white text-[#0D0F13] hover:bg-transparent hover:text-white'
          : 'border-white/50 bg-transparent text-white hover:border-white hover:bg-white hover:text-[#0D0F13]',
      )}
    >
      {children}
    </a>
  );
}

/* ---- Ink CTA buttons (for light / paper editorial sections) ---------------- */
export function InkButton({
  href,
  variant = 'solid',
  children,
}: {
  href: string;
  variant?: 'solid' | 'outline';
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-2 rounded-[2px] border px-7 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.2em] transition-colors',
        variant === 'solid'
          ? 'border-ink bg-ink text-paper hover:bg-transparent hover:text-ink'
          : 'border-line-hair bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper',
      )}
    >
      {children}
    </a>
  );
}

/* ---- 1. Editorial hero — paper masthead, serif headline, captioned plate --- */
export function CinematicHero() {
  return (
    <section className="relative overflow-hidden bg-paper text-ink">
      <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative z-10 mx-auto max-w-7xl px-[5vw] pb-[clamp(56px,8vw,104px)] pt-[clamp(112px,17vh,184px)] lg:px-8 xl:px-16">
        {/* masthead rule */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-line pb-4 lab-label">
          <span className="inline-flex items-center gap-2.5 text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-safety" />
            Self-driving labs — now in trial
          </span>
          <span className="text-ink-faint">Vol. 01 — The retrofit thesis</span>
        </div>

        {/* asymmetric headline / lede */}
        <div className="grid items-end gap-x-10 gap-y-9 pt-[clamp(36px,5vw,64px)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="cine-head text-[clamp(46px,7.2vw,98px)]">
              The lab that{' '}
              <span className="font-editorial-italic text-safety">remembers.</span>
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <p className="lab-label text-safety">[ The premise ]</p>
            <p className="mt-4 max-w-[44ch] text-[clamp(16px,1.25vw,19px)] leading-relaxed text-ink-muted">
              contAInuum retrofits the lab you already run with ATLAS — an autonomous agent that
              plans, executes, hands work back to your scientists, and remembers every campaign it
              touches.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <InkButton href="/signup" variant="solid">
                Start free trial <ArrowRight className="h-4 w-4" />
              </InkButton>
              <InkButton href="#platform" variant="outline">
                See the platform
              </InkButton>
            </div>
          </div>
        </div>

        {/* photographic plate — demoted from full-bleed to a captioned figure */}
        <figure className="mt-[clamp(40px,5vw,72px)] border border-line bg-surface p-2 shadow-lab">
          <div className="relative overflow-hidden">
            <img
              src="/images/frontier-industrial-space.jpg"
              alt="An autonomous workcell on the lab frontier"
              className="hero-zoom block h-[clamp(260px,42vw,560px)] w-full object-cover"
              style={{ animation: 'slowzoom 24s ease-out forwards', transform: 'scale(1.04)' }}
            />
          </div>
          <figcaption className="flex items-center justify-between gap-4 px-1.5 pb-0.5 pt-3">
            <span className="lab-label">Fig. 01 — Frontier workcell, retrofitted</span>
            <a href="#thesis" className="lab-label text-ink-muted transition-colors hover:text-ink">
              Read the thesis ↓
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---- 2. Editorial mission panel (serif title + lede + photo plate + facts) -- */
export function MissionPanel({
  id,
  image,
  kicker,
  title,
  body,
  facts,
  caption,
  dropcap = false,
}: {
  id?: string;
  image: string;
  kicker: string;
  title: ReactNode;
  body: string;
  facts?: { label: string; text: string }[];
  caption?: string;
  dropcap?: boolean;
}) {
  return (
    <section id={id} className="relative overflow-hidden bg-paper py-[clamp(72px,10vw,140px)] text-ink">
      <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
        <div className="grid items-start gap-x-12 gap-y-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="lab-label text-safety">{kicker}</p>
            <h2 className="cine-head mt-4 text-[clamp(34px,5vw,68px)]">{title}</h2>
            <p
              className={cn(
                'mt-6 max-w-[46ch] text-[clamp(16px,1.2vw,19px)] leading-relaxed text-ink-muted',
                dropcap && 'dropcap',
              )}
            >
              {body}
            </p>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-6">
            <figure className="border border-line bg-surface p-2 shadow-lab">
              <img
                src={image}
                alt={caption ?? ''}
                className="block h-[clamp(240px,32vw,440px)] w-full object-cover"
              />
              <figcaption className="px-1.5 pb-0.5 pt-3">
                <span className="lab-label">{caption ?? 'Fig. — ATLAS in the lab'}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {facts && (
          <div className="mt-12 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface px-7 py-6">
                <div className="lab-label text-safety">{f.label}</div>
                <div className="mt-2.5 text-[14px] leading-relaxed text-ink-muted">{f.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---- 3. Product showcase (bright UI in a window frame, on dark) ------------ */
export function ProductShowcase({
  id,
  kicker,
  title,
  body,
  shot,
  shotAlt,
  addr,
  video,
}: {
  id?: string;
  bgImage?: string;
  kicker: string;
  title: string;
  body: string;
  shot: string;
  shotAlt: string;
  addr: string;
  /** Optional looping screen-capture; falls back to the still `shot` as poster. */
  video?: string;
}) {
  return (
    <section id={id} className="relative overflow-hidden border-y border-line bg-paper text-ink">
      <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative z-10 mx-auto px-[5vw] py-[clamp(64px,9vw,120px)] text-center lg:px-8 xl:px-16">
        <Reveal>
          <p className="lab-label text-safety">{kicker}</p>
          <h2 className="cine-head mt-4 text-[clamp(30px,4.4vw,58px)]">{title}</h2>
          <p className="mx-auto mt-5 max-w-[42rem] leading-relaxed text-ink-muted">{body}</p>
        </Reveal>
        <Reveal delay={120} className="mx-auto mt-12 max-w-[1080px]">
          <div className="overflow-hidden rounded-[10px] border border-white/15 bg-[#14171D] shadow-lab-lg">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3.5 font-mono-tech text-[11px] tracking-[0.08em] text-white/40">{addr}</span>
            </div>
            {video ? (
              <video
                className="block w-full"
                autoPlay
                muted
                loop
                playsInline
                poster={shot}
                aria-label={shotAlt}
              >
                <source src={video} type="video/mp4" />
              </video>
            ) : (
              <img src={shot} alt={shotAlt} className="block w-full" />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---- 4. Editorial interstitial — typographic pull-quote band -------------- */
export function Interstitial({
  kicker,
  title,
  body,
}: {
  image?: string;
  kicker: string;
  title: ReactNode;
  body: string;
}) {
  return (
    <section className="border-y border-line bg-panel py-[clamp(72px,11vw,148px)] text-ink">
      <Reveal className="mx-auto max-w-[1100px] px-[5vw] text-center lg:px-8 xl:px-16">
        <p className="lab-label text-safety">{kicker}</p>
        <blockquote className="cine-head mx-auto mt-6 max-w-[20ch] text-[clamp(30px,4.6vw,60px)]">
          {title}
        </blockquote>
        <p className="mx-auto mt-6 max-w-[50ch] text-[clamp(15px,1.2vw,18px)] leading-relaxed text-ink-muted">
          {body}
        </p>
      </Reveal>
    </section>
  );
}

/* ---- 5. Frontiers grid (with faint atmospheric image) --------------------- */
const FRONTIERS = [
  { n: '01', ic: '◈', accent: true, h: 'Cross-campaign memory', p: 'Posterior carry-over seeds each new campaign from prior runs in the same lab. Recipe templates learn their own success rates. The next campaign never starts cold.' },
  { n: '02', ic: '⇄', h: 'Human-as-actuator handoff', p: 'When a step needs hands, ATLAS pauses, notifies, and waits — then resumes with full state preserved. Workflow software, not a robot SDK.' },
  { n: '03', ic: '⌗', h: 'Tacit knowledge capture', p: '"We don’t use that supplier anymore." "The third-floor rotovap leaks." ATLAS captures lab lore from corrections and notes, and surfaces it at planning time.' },
  { n: '04', ic: '◎', h: 'Drift detection', p: 'Calibrated confidence, contradiction checks over the run trace, and surrogate-divergence alerts catch a bad tool call before it pollutes your data.' },
  { n: '05', ic: '⊞', soon: true, h: 'Federated learning', p: "One lab’s failure mode warns another’s scientist — without either seeing the other’s targets. Differentially-private trace aggregation across labs." },
  { n: '06', ic: '↗', panel: true, h: 'Built on what you have', p: 'SQLite, Qdrant, and a Rustworkx graph already sit under your runs. ATLAS finally consumes the traces you’re already writing.' },
];

export function FrontierGrid() {
  return (
    <section id="platform" className="relative overflow-hidden py-[clamp(64px,9vw,120px)]">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-[0.07] dark:opacity-[0.14]"
        style={{
          backgroundImage: "url('/images/atlas-vision-overlay.jpg')",
          WebkitMaskImage: 'radial-gradient(125% 85% at 82% -10%, #000, transparent 68%)',
          maskImage: 'radial-gradient(125% 85% at 82% -10%, #000, transparent 68%)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
        <Reveal className="flex flex-col items-start justify-between gap-7 border-b border-line pb-7 md:flex-row md:items-end">
          <div>
            <p className="lab-label text-safety">[ 02 ] The platform</p>
            <h2 className="mt-3.5 max-w-[18ch] font-display text-[clamp(30px,4vw,50px)] font-bold leading-[1.04] tracking-tight text-ink">
              Five frontiers no greenfield lab can copy.
            </h2>
          </div>
          <p className="max-w-[22rem] text-ink-muted">
            ATLAS is built on a substrate that already exists — execution traces, a knowledge graph, a
            campaign store. The moat is what it does with them.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 border-l border-line sm:grid-cols-2 lg:grid-cols-3">
          {FRONTIERS.map((f, i) => (
            <Reveal
              key={f.n}
              delay={(i % 3) * 80}
              className={cn(
                'relative border-b border-r border-line p-8 transition-colors hover:bg-panel',
                f.panel ? 'bg-panel' : 'bg-surface',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-[11px] tracking-[0.12em] text-ink-faint">{f.n}</span>
                <div
                  className={cn(
                    'flex h-[34px] w-[34px] items-center justify-center border font-mono-tech',
                    f.accent || f.panel ? 'border-safety text-safety' : 'border-line-hair text-ink',
                  )}
                >
                  {f.ic}
                </div>
              </div>
              {f.soon && (
                <span className="absolute right-8 top-8 border border-line px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-[0.14em] text-ink-faint">
                  Roadmap
                </span>
              )}
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{f.h}</h3>
              <p className="mt-2.5 leading-relaxed text-ink-muted">{f.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- 6. Campaign-loop console (animated) ---------------------------------- */
const LOOP_NODES = [
  { n: '01', cap: 'Objective' },
  { n: '02', cap: 'Plan' },
  { n: '03', cap: 'Run', run: true },
  { n: '04', cap: 'Evaluate' },
  { n: '05', cap: 'Learn' },
];
const FEED = [
  { t: '09:41', m: 'Suzuki coupling · Pd cat. screen', tag: 'running', ok: true },
  { t: '09:44', m: 'Seeded from 3 prior Pd campaigns', tag: 'memory' },
  { t: '09:52', m: 'TLC plate — needs a human read', tag: 'handoff', human: true },
  { t: '10:03', m: 'Aidan confirmed · yield 78%', tag: 'logged', ok: true },
];

/* Stepping script: the loop advances through these states. The handoff state
   (paused) dwells longer — that pause is the whole thesis, shown live. */
const LOOP_SCRIPT: { active: number; paused?: boolean; status: string; feed: number; ms: number }[] = [
  { active: 0, status: 'Objective set — optimise Suzuki yield', feed: 0, ms: 1500 },
  { active: 1, status: 'Planning — seeded from 3 prior Pd campaigns', feed: 2, ms: 1800 },
  { active: 2, status: 'Running — Pd catalyst screen', feed: 2, ms: 1700 },
  { active: 2, paused: true, status: 'Paused — TLC plate needs a human read', feed: 3, ms: 3000 },
  { active: 2, status: 'Resumed — confirmed · yield 78%', feed: 4, ms: 1600 },
  { active: 3, status: 'Evaluating outcomes', feed: 4, ms: 1500 },
  { active: 4, status: 'Learning — posterior updated', feed: 4, ms: 1800 },
];

export function CampaignLoop() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  // Reduced motion → freeze on the handoff frame (the most telling one).
  const [i, setI] = useState(reduce ? 3 : 0);

  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setI((p) => (p + 1) % LOOP_SCRIPT.length), LOOP_SCRIPT[i].ms);
    return () => clearTimeout(id);
  }, [i, reduce]);

  const cur = LOOP_SCRIPT[i];

  return (
    <section id="loop" className="border-y border-line bg-panel py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto max-w-7xl px-[5vw] text-center lg:px-8 xl:px-16">
        <p className="lab-label text-safety">[ 03 ] The campaign loop</p>
        <h2 className="mx-auto mt-3.5 max-w-[22ch] font-display text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-ink">
          Plan, run, evaluate, learn — then carry it forward.
        </h2>

        <Reveal className="mx-auto mt-11 max-w-[880px] border border-line bg-surface shadow-lab">
          <div className="flex items-center justify-between border-b border-line px-[18px] py-3">
            <span className="lab-label">Fig. 03 — ATLAS campaign loop</span>
            <span className="inline-flex items-center gap-2 lab-label text-ink-muted">
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  cur.paused ? 'bg-ink-faint' : 'bg-safety',
                )}
                style={cur.paused ? undefined : { animation: 'pulse-tick 1.6s ease-in-out infinite' }}
              />
              {cur.paused ? 'PAUSED' : 'LIVE'}
            </span>
          </div>

          <div className="px-3 pb-3 pt-7 sm:px-6">
            <div className="flex items-start justify-between">
              {LOOP_NODES.map((node, idx) => {
                const isActive = idx === cur.active;
                const done = idx < cur.active;
                const handoff = isActive && cur.paused;
                return (
                  <div key={node.n} className="contents">
                    <div className="flex flex-col items-center gap-2.5">
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center border font-mono-tech text-[11px] transition-colors duration-500 sm:h-[52px] sm:w-[52px] sm:text-[13px]',
                          handoff
                            ? 'border-ink bg-ink/[0.06] text-ink'
                            : isActive
                              ? 'border-safety bg-safety/[0.12] text-safety'
                              : done
                                ? 'border-safety/40 bg-surface text-ink-muted'
                                : 'border-line-hair bg-surface text-ink-faint',
                        )}
                        style={
                          isActive && !cur.paused
                            ? { animation: 'pulse-tick 1.6s ease-in-out infinite' }
                            : undefined
                        }
                      >
                        {handoff ? '⏸' : node.n}
                      </div>
                      <div
                        className={cn(
                          'font-mono-tech text-[9.5px] uppercase tracking-[0.12em] transition-colors',
                          isActive ? 'text-ink' : 'text-ink-muted',
                        )}
                      >
                        {handoff ? 'Handoff' : node.cap}
                      </div>
                    </div>
                    {idx < LOOP_NODES.length - 1 && (
                      <div className="relative mx-1 mt-[18px] h-px flex-1 bg-line-hair sm:mx-2 sm:mt-[25px]">
                        <span
                          className="absolute inset-0 origin-left bg-safety transition-transform duration-500"
                          style={{ transform: `scaleX(${idx < cur.active ? 1 : 0})` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* live status line */}
            <div className="mt-6 flex items-center gap-2.5 border-t border-dashed border-line pt-4 text-left">
              <span
                className={cn('h-1.5 w-1.5 flex-none rounded-full', cur.paused ? 'bg-ink' : 'bg-safety')}
              />
              <span className="font-mono-tech text-[11px] tracking-[0.04em] text-ink-muted">
                {cur.status}
              </span>
              <span className="ml-auto lab-label text-ink-faint">
                {cur.active === 4 ? '↺ carries forward' : ''}
              </span>
            </div>
          </div>

          <div className="border-t border-line text-left">
            {FEED.map((l, idx) => {
              const shown = idx < cur.feed;
              return (
                <div
                  key={l.t}
                  className={cn(
                    'flex items-baseline gap-3 border-b border-line px-[18px] py-2.5 font-mono-tech text-[11.5px] transition-opacity duration-500 last:border-b-0',
                    shown ? 'opacity-100' : 'opacity-30',
                  )}
                >
                  <span className="w-[52px] flex-none text-ink-faint">{l.t}</span>
                  <span className="text-ink-muted">{l.m}</span>
                  <span
                    className={cn(
                      'ml-auto border px-1.5 py-0.5 text-[9.5px] uppercase tracking-[0.1em]',
                      l.ok
                        ? 'border-safety/45 text-safety'
                        : l.human
                          ? 'border-ink/40 text-ink'
                          : 'border-line text-ink-muted',
                    )}
                  >
                    {l.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---- 7. Stat band (count-up over dark image) ------------------------------ */
function Stat({ value, decimals, suffix, unit, label }: { value: number; decimals?: number; suffix?: string; unit?: string; label: string }) {
  const { ref, val } = useCountUp(value, { decimals });
  return (
    <Reveal className="border-r border-white/[0.14] px-6 pb-1.5 pt-7 last:border-r-0">
      <div className="font-display text-[clamp(40px,4.6vw,60px)] font-extrabold leading-none tracking-tight text-white">
        <span ref={ref}>{val}</span>
        {suffix}
        {unit && <span className="text-[0.6em] text-safety"> {unit}</span>}
      </div>
      <div className="mt-3.5 leading-snug text-white/[0.66]">{label}</div>
    </Reveal>
  );
}

export function StatBand() {
  return (
    // Pinned to a literal graphite (not the `ink` token) so this deliberate dark
    // "spread" stays dark in both light and dark themes instead of inverting.
    <section className="relative overflow-hidden bg-[#0D0F13]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.22]"
        style={{ backgroundImage: "url('/images/atlas-vision-overlay.jpg')" }}
      />
      <div className="absolute inset-0" style={{ background: VEIL_STAT }} />
      <div className="relative z-10 mx-auto max-w-7xl px-[5vw] py-[clamp(60px,8vw,96px)] lg:px-8 xl:px-16">
        <p className="font-mono-tech text-[11px] uppercase tracking-[0.22em] text-white/50">
          [ Why it compounds ]
        </p>
        <div className="mt-10 grid grid-cols-2 border-t border-white/[0.14] md:grid-cols-4">
          <Stat value={100} suffix="%" label="of execution traces consumed — negative results included, not write-only" />
          <Stat value={17} suffix="d" label="memory that used to vanish at the end of a campaign, now carried forward" />
          <Stat value={78} suffix="%" label="protocol success rates learned per-reagent, per-supplier, per-scientist" />
          <Stat value={0} unit="rebuild" label="instruments to replace — ATLAS retrofits the workcell you run today" />
        </div>
        <p className="mt-6 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/40">
          Illustrative design targets — not yet independently benchmarked.
        </p>
      </div>
    </section>
  );
}
