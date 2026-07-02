import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Magnetic, ParticleField } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { Beat, ParallaxImage } from '@/components/marketing/Beat';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';

/* =============================================================================
   AboutPage — who is behind Contineon and why. A cinematic obsidian mission
   piece: the thesis, the beliefs that shape the product, where we work, and a
   call to meet the team. Deliberately avoids fabricated bios/headshots. Swap in
   real leadership once ready.
   ============================================================================= */

const BELIEFS = [
  {
    n: '01',
    h: 'Retrofit beats greenfield',
    p: 'The lab you already run is the asset. Progress comes from giving it a memory and an autonomy layer, not from asking scientists to rebuild from scratch.',
  },
  {
    n: '02',
    h: 'Humans stay in the loop',
    p: 'Autonomy that ignores the bench is a demo. Atlas pauses for the steps that need hands, and treats a scientist’s correction as the most valuable signal it gets.',
  },
  {
    n: '03',
    h: 'Memory should compound',
    p: 'Most labs throw away their hardest-won knowledge at the end of a campaign. We think every run, including the failures, should make the next one smarter.',
  },
  {
    n: '04',
    h: 'Earn trust, don’t assume it',
    p: 'Your data exports with you. Our claims are labeled as targets until they’re benchmarked. We would rather under-promise to a scientist than over-sell to a buyer.',
  },
];

const HUBS = ['Shanghai', 'San Francisco', 'Salt Lake City', 'Boston'];

export function AboutPage() {
  return (
    <DarkPageShell>
      <Seo
        title="About, Contineon"
        description="Contineon builds the self-driving lab that remembers, retrofitting the labs scientists already run with an autonomous agent and a compounding memory."
        path="/about"
      />

      {/* Hero */}
      <Beat
        minH="min-h-[94svh]"
        align="end"
        intro
        media={
          <>
            <div className="absolute inset-0">
              <ParallaxImage src="/images/airglow.jpg" className="opacity-[0.6]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/75 via-[#06080B]/45 to-[#06080B]/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080B]/90 via-transparent to-transparent" />
            <ParticleField className="pointer-events-none absolute inset-0 z-[1]" />
            <GridField className="opacity-[0.4]" />
          </>
        }
      >
        <div className="max-w-4xl pb-8">
          <p data-beat-fade>
            <Kicker>About</Kicker>
          </p>
          <h1
            data-beat-title
            className="type-hero mt-5"
          >
            The self-driving lab that remembers.
          </h1>
          <p
            data-beat-fade
            className="type-lede mt-8 max-w-2xl text-white/75"
          >
            Contineon exists to make autonomous science practical for the labs that already exist.
            Instead of a sealed robotic box that only works greenfield, we retrofit the instruments and
            people you run today with Atlas — an agent that plans, executes, hands work back when it
            needs a human, and remembers every campaign it touches.
          </p>
          <div data-beat-fade className="mt-10">
            <Magnetic>
              <Cta to="/contact" variant="outlineLight">
                Talk to the team <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
          </div>
        </div>
      </Beat>

      {/* Beliefs */}
      <Beat
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <GridField className="opacity-25" />
          </>
        }
      >
        <div className="max-w-2xl">
          <p data-beat-fade>
            <Kicker>What we believe</Kicker>
          </p>
          <h2
            data-beat-title
            className="type-h2 mt-4"
          >
            Four convictions behind the product.
          </h2>
        </div>
        <div className="mt-14">
          {BELIEFS.map((b) => (
            <div
              key={b.n}
              data-beat-fade
              className="grid grid-cols-1 gap-3 border-t border-white/10 py-8 sm:grid-cols-[80px_1fr] sm:gap-10"
            >
              <span className="lab-label pt-1.5 text-safety">{b.n}</span>
              <div className="max-w-2xl">
                <h3 className="type-h3 text-ink">{b.h}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{b.p}</p>
              </div>
            </div>
          ))}
        </div>
      </Beat>

      {/* Presence */}
      <Beat
        minH="min-h-[80svh]"
        media={
          <>
            <div className="absolute inset-0 bg-[#06080B]" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p data-beat-fade>
              <Kicker>Where we work</Kicker>
            </p>
            <h2
              data-beat-title
              className="type-h2 mt-4"
            >
              A distributed team, close to the bench.
            </h2>
            <p data-beat-fade className="type-lede mt-6 max-w-xl text-white/75">
              We work alongside chemistry, materials, and biology labs across four hubs, building with
              practitioners rather than for an imagined user. Partner names will be shared at launch.
            </p>
          </div>
          <dl data-beat-fade className="lg:col-span-5 lg:col-start-8">
            {HUBS.map((c) => (
              <div key={c} className="flex items-baseline justify-between border-t border-white/10 py-4">
                <dt className="font-mono-tech text-[13px] uppercase tracking-[0.16em] text-ink">{c}</dt>
                <dd className="lab-label">Hub</dd>
              </div>
            ))}
          </dl>
        </div>
      </Beat>

      {/* Close */}
      <Beat
        minH="min-h-[80svh]"
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <GridField className="opacity-25" />
          </>
        }
      >
        <h2
          data-beat-title
          className="type-h2 max-w-3xl"
        >
          Want to meet the people building it?
        </h2>
        <div data-beat-fade className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Cta to="/contact" variant="accent">
              Talk to the team <ArrowRight className="h-4 w-4" />
            </Cta>
          </Magnetic>
          <Cta to="/platform" variant="outlineLight">
            See the platform
          </Cta>
        </div>
      </Beat>
    </DarkPageShell>
  );
}
