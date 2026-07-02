import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Magnetic, ParticleField } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { Beat, ParallaxImage } from '@/components/marketing/Beat';
import { AsciiMedia } from '@/components/marketing/AsciiMedia';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';
import { ConsolePreview } from '@/components/marketing/ConsolePreview';

/* =============================================================================
   Atlas / Platform — the flagship product page. A cinematic obsidian scroll:
   a full-bleed hero, then one idea per beat (retrofit, the loop, specs, the
   console, memory), and a single call. SpaceX vehicle-page discipline, our
   ASCII + ember voice. Hairlines and whitespace, never card soup.
   ============================================================================= */

const FACTS = [
  { label: 'Pause', text: 'A tool call pauses the campaign and notifies a scientist, like a job awaiting approval.' },
  { label: 'Resume', text: 'Return a TLC photo, a CSV, or a note. Atlas picks up from exactly where it stopped.' },
  { label: 'Learn', text: 'Correct a step once, and that correction becomes signal for every campaign after.' },
];

const CAPABILITIES = [
  { h: 'Autonomous planning', p: 'Atlas decomposes an objective into an ordered campaign of concrete experiments.' },
  { h: 'Runs on your bench', p: 'It executes on the instruments, ELN, and integrations you already operate. No rip-and-replace.' },
  { h: 'Human-in-the-loop', p: 'It pauses for the steps that need hands, then resumes from exactly where it stopped.' },
  { h: 'Compounding memory', p: 'Recipes, failure modes, and lab lore accumulate into a private knowledge graph.' },
  { h: 'Honest evaluation', p: 'Results, including the failures, are read back, scored, and explained.' },
  { h: 'Portable & secure', p: 'Your data, graph, and run history export with you. Access is provisioned, never scraped.' },
];

const LOOP = [
  { k: 'Plan', t: 'Atlas decomposes an objective into a campaign of concrete, ordered experiments.' },
  { k: 'Run', t: 'It executes on your instruments, calling for a human only where hands are genuinely needed.' },
  { k: 'Evaluate', t: 'Results, including the failures, are read back, scored, and explained.' },
  { k: 'Learn', t: 'Every outcome updates the lab’s memory so the next campaign starts smarter.' },
];

const SPECS = [
  ['Instruments', 'Runs on the bench, ELN, and integrations you already operate'],
  ['Autonomy', 'Plans and executes multi-step campaigns end to end'],
  ['Hand-back', 'Pauses for the steps that need hands, resumes exactly in place'],
  ['Memory', 'A private knowledge graph that compounds and exports with you'],
];

const GRAPH = [
  ['Compounding', 'Knowledge carries across every campaign'],
  ['Portable', 'Your graph and run history export with you'],
  ['Honest', 'Claims are labelled as targets until benchmarked'],
];

export function AtlasPage() {
  return (
    <DarkPageShell>
      <Seo
        title="Atlas Framework, Contineon"
        description="Atlas is Contineon's autonomous lab agent: it plans, runs campaigns on your existing instruments, hands work back when it needs a human, and remembers everything it learns."
        path="/platform"
      />

      {/* Hero */}
      <Beat
        minH="min-h-[100svh]"
        align="end"
        intro
        media={
          <>
            <AsciiMedia
              src="/images/earth-night.mp4"
              type="video"
              poster="/images/earth-night-poster.jpg"
              cols={128}
              speed={1}
              tint="ember"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/70 via-[#06080B]/40 to-[#06080B]/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080B]/90 via-transparent to-transparent" />
            <ParticleField className="pointer-events-none absolute inset-0 z-[1]" />
            <GridField className="opacity-[0.4]" />
          </>
        }
      >
        <div className="max-w-4xl pb-10">
          <p data-beat-fade>
            <Kicker>Atlas Framework · Our first product</Kicker>
          </p>
          <h1
            data-beat-title
            className="mt-5 type-display"
          >
            One agent that plans, runs, and remembers.
          </h1>
          <p
            data-beat-fade
            className="mt-8 max-w-2xl type-lede text-white/75"
          >
            Atlas is the operating layer for an autonomous lab. It turns an objective into a campaign,
            runs it on the bench you already have, and keeps a durable memory of everything it learns.
          </p>
          <div data-beat-fade className="mt-10">
            <Magnetic>
              <Cta to="/docs" variant="outlineLight">
                Get started <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
          </div>
        </div>
      </Beat>

      {/* Retrofit thesis */}
      <Beat
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <GridField className="opacity-25" />
          </>
        }
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p data-beat-fade>
              <Kicker>The approach</Kicker>
            </p>
            <h2
              data-beat-title
              className="mt-4 type-h2"
            >
              Retrofit, don’t replace.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p data-beat-fade className="type-lede text-white/75">
              Every other self-driving lab asks you to rebuild from scratch. Atlas runs on the
              instruments and people you already have, and when a step needs hands, it pauses and hands
              it to you.
            </p>
            <dl data-beat-fade className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {FACTS.map((f) => (
                <div key={f.label} className="grid grid-cols-[110px_1fr] gap-4 py-4">
                  <dt className="lab-label pt-0.5">{f.label}</dt>
                  <dd className="text-[15px] leading-relaxed text-ink-muted">{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Beat>

      {/* Capabilities */}
      <Beat
        minH="min-h-[88svh]"
        media={
          <>
            <div className="absolute inset-0 bg-[#06080B]" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <div className="max-w-2xl">
          <p data-beat-fade>
            <Kicker>Capabilities</Kicker>
          </p>
          <h2
            data-beat-title
            className="mt-4 type-h2"
          >
            The full loop, on your instruments.
          </h2>
        </div>
        <div className="mt-14 grid gap-x-12 sm:grid-cols-2">
          {CAPABILITIES.map((c) => (
            <div key={c.h} data-beat-fade className="border-t border-white/10 py-6">
              <h3 className="text-lg font-semibold text-ink">{c.h}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{c.p}</p>
            </div>
          ))}
        </div>
      </Beat>

      {/* Campaign loop */}
      <Beat
        minH="min-h-[84svh]"
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <GridField className="opacity-25" />
          </>
        }
      >
        <div className="max-w-2xl">
          <p data-beat-fade>
            <Kicker>The campaign loop</Kicker>
          </p>
          <h2
            data-beat-title
            className="mt-4 type-h2"
          >
            Plan, run, evaluate, learn. Then carry it forward.
          </h2>
        </div>
        <div className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {LOOP.map((s, i) => (
            <div key={s.k} data-beat-fade className="border-t border-white/10 py-6">
              <span className="lab-label text-safety">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-xl font-semibold text-ink">{s.k}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{s.t}</p>
            </div>
          ))}
        </div>
      </Beat>

      {/* Specifications — the lab-instrument voice */}
      <Beat
        minH="min-h-[74svh]"
        media={
          <>
            <div className="absolute inset-0 bg-[#06080B]" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p data-beat-fade>
              <Kicker>Specifications</Kicker>
            </p>
            <h2
              data-beat-title
              className="mt-4 type-h2"
            >
              Built for the bench you run.
            </h2>
          </div>
          <dl data-beat-fade className="lg:col-span-7 lg:col-start-6">
            {SPECS.map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-1 gap-2 border-t border-white/10 py-5 sm:grid-cols-[180px_1fr] sm:gap-8"
              >
                <dt className="lab-label pt-1">{k}</dt>
                <dd className="type-body text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Beat>

      {/* Console */}
      <Beat
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <div className="max-w-2xl">
          <p data-beat-fade>
            <Kicker>The console</Kicker>
          </p>
          <h2
            data-beat-title
            className="mt-4 type-h2"
          >
            Watch every campaign think.
          </h2>
        </div>
        <div data-beat-fade className="mt-12">
          <ConsolePreview />
        </div>
      </Beat>

      {/* Knowledge graph / memory */}
      <Beat
        media={
          <>
            <div className="absolute inset-0">
              <ParallaxImage src="/images/gargantua-blackhole.png" className="opacity-[0.5]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080B] via-[#06080B]/60 to-[#06080B]/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/60 via-transparent to-[#06080B]/70" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p data-beat-fade>
              <Kicker className="text-safety">Knowledge graph</Kicker>
            </p>
            <h2
              data-beat-title
              className="mt-4 type-h2"
            >
              Most labs throw away their hardest-won knowledge.
            </h2>
            <p data-beat-fade className="mt-7 max-w-2xl type-lede text-white/75">
              Every run — recipes, failure modes, and lab lore — accumulates into a private knowledge
              graph. It is yours alone, it exports with you, and it makes each campaign smarter than the
              last.
            </p>
          </div>
          <dl data-beat-fade className="lg:col-span-4 lg:col-start-9">
            {GRAPH.map(([t, d]) => (
              <div key={t} className="border-t border-white/10 py-5">
                <dt className="text-[15px] font-semibold text-ink">{t}</dt>
                <dd className="mt-1 text-sm text-ink-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Beat>

      {/* Close */}
      <Beat
        minH="min-h-[90svh]"
        media={
          <>
            <div className="absolute inset-0">
              <ParallaxImage src="/images/sr71-horse-rider.png" fit="contain" className="opacity-[0.55]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080B] via-[#06080B]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/50 via-transparent to-[#06080B]/60" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <h2
          data-beat-title
          className="max-w-3xl type-h2"
        >
          Run Atlas on the lab you already have.
        </h2>
        <div data-beat-fade className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Cta to="/docs" variant="accent">
              Get started <ArrowRight className="h-4 w-4" />
            </Cta>
          </Magnetic>
          <Cta to="/contact?topic=demo" variant="outlineLight">
            Book a demo
          </Cta>
        </div>
      </Beat>
    </DarkPageShell>
  );
}
