import { Seo } from '@/components/Seo';

/* =============================================================================
   AboutPage, who is behind Contineon and why. Deliberately avoids fabricated
   bios/headshots; states the mission, the beliefs that shape the product, and
   how to meet the team (a call). Swap in real leadership once ready.
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
    p: 'Autonomy that ignores the bench is a demo. Asilia pauses for the steps that need hands, and treats a scientist’s correction as the most valuable signal it gets.',
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

export function AboutPage() {
  return (
    <div className="px-[5vw] pb-28 pt-32 lg:px-8 lg:pt-40">
      <Seo
        title="Mission, Contineon"
        description="Contineon builds the self-driving lab that remembers, retrofitting the labs scientists already run with an autonomous agent and a compounding memory."
        path="/mission"
      />

      <div className="mx-auto max-w-5xl">
        {/* masthead */}
        <div className="border-b border-line pb-10">
          <p className="lab-label text-safety">ABOUT</p>
          <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(34px,5.4vw,64px)] font-bold leading-[1.05] tracking-tight text-ink">
            The self-driving lab that remembers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Contineon exists to make autonomous science practical for the labs that already exist.
            Instead of a sealed robotic box that only works greenfield, we retrofit the instruments and
            people you run today with Asilia, an agent that plans, executes, hands work back when it
            needs a human, and remembers every campaign it touches.
          </p>
        </div>

        {/* beliefs */}
        <div className="mt-12">
          <h2 className="lab-label text-ink-faint">What we believe</h2>
          <div className="mt-5 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
            {BELIEFS.map((b) => (
              <div key={b.n} className="bg-surface p-7">
                <span className="font-display text-3xl font-extrabold tracking-tight text-safety">{b.n}</span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{b.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{b.p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* presence */}
        <div className="mt-14 grid gap-8 rounded-xl border border-line bg-surface p-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">A distributed team, close to the bench.</h2>
            <p className="mt-3 leading-relaxed text-ink-muted">
              We work alongside chemistry, materials, and biology labs across four hubs, building with
              practitioners rather than for an imagined user. Partner names will be shared at launch.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 font-mono-tech text-[12px] uppercase tracking-[0.12em] text-ink-muted">
            {['Shanghai', 'San Francisco', 'Salt Lake City', 'Boston'].map((c) => (
              <li key={c} className="flex items-center gap-2 border border-line bg-paper px-4 py-3">
                <span className="h-1.5 w-1.5 rounded-full bg-safety" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <p className="max-w-lg font-display text-xl font-semibold text-ink">
            Want to meet the people building it?
          </p>
          <div className="flex gap-3">
            <a href="/contact" className="inline-flex items-center justify-center gap-2 rounded bg-safety px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-safety/90">
              Talk to the team
            </a>
            <a href="/" className="inline-flex items-center justify-center gap-2 rounded border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-hair">
              See the platform
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
