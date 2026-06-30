import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { ConsolePreview } from '@/components/marketing/ConsolePreview';

const CAPABILITIES = [
  { h: 'Autonomous planning', p: 'Atlas decomposes an objective into an ordered campaign of concrete experiments.' },
  { h: 'Runs on your bench', p: 'It executes on the instruments, ELN, and integrations you already operate — no rip-and-replace.' },
  { h: 'Human-in-the-loop', p: 'It pauses for the steps that need hands, then resumes from exactly where it stopped.' },
  { h: 'Compounding memory', p: 'Recipes, failure modes, and lab lore accumulate into a private knowledge graph.' },
  { h: 'Honest evaluation', p: 'Results — including the failures — are read back, scored, and explained.' },
  { h: 'Portable & secure', p: 'Your data, graph, and run history export with you. Access is provisioned, never scraped.' },
];

export function AtlasPage() {
  return (
    <>
      <Seo
        title="Atlas Framework — Contineon"
        description="Atlas is Contineon's autonomous lab agent: it plans, runs campaigns on your existing instruments, hands work back when it needs a human, and remembers everything it learns."
        path="/platform"
      />

      {/* Hero */}
      <section className="border-b border-line pt-32">
        <div className="mx-auto max-w-7xl px-[5vw] pb-[clamp(48px,7vw,96px)] lg:px-8 xl:px-16">
          <Reveal className="max-w-4xl">
            <Kicker>Atlas Framework · Our first product</Kicker>
            <h1 className="mt-5 text-[clamp(40px,6vw,86px)] font-bold leading-[0.98] tracking-[-0.04em] text-ink">
              One agent that plans, runs, and remembers.
            </h1>
            <p className="mt-7 max-w-2xl text-[clamp(17px,1.4vw,21px)] leading-relaxed text-ink-muted">
              Atlas is the operating layer for an autonomous lab. It turns an objective
              into a campaign, runs it on the bench you already have, and keeps a durable
              memory of everything it learns.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Cta to="/contact?topic=partner" variant="accent">
                Request access <ArrowRight className="h-4 w-4" />
              </Cta>
              <Cta to="/contact?topic=demo" variant="outline">
                Book a demo
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-line bg-surface py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-2xl">
            <Kicker>Capabilities</Kicker>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.04] tracking-[-0.03em] text-ink">
              The full loop, on your instruments.
            </h2>
          </Reveal>
          <Reveal className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3" stagger>
            {CAPABILITIES.map((c) => (
              <div key={c.h} className="bg-surface p-7">
                <h3 className="text-lg font-semibold text-ink">{c.h}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{c.p}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Console preview */}
      <section className="border-b border-line py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-2xl">
            <Kicker>The console</Kicker>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.04] tracking-[-0.03em] text-ink">
              Watch every campaign think.
            </h2>
          </Reveal>
          <Reveal className="mt-12" delay={0.05}>
            <ConsolePreview />
          </Reveal>
        </div>
      </section>

      {/* Demo — honest placeholder */}
      <section className="dark bg-paper py-[clamp(64px,9vw,120px)] text-ink">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-line bg-surface p-[clamp(28px,4vw,56px)] lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <Kicker className="text-safety">Live demo · Coming soon</Kicker>
              <h2 className="mt-4 text-[clamp(26px,3.2vw,40px)] font-bold leading-[1.05] tracking-[-0.03em]">
                An interactive Atlas demo is on the way.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                We are putting the finishing touches on an interactive walkthrough. Until
                then, book a live session and we will run Atlas against a campaign close
                to your own.
              </p>
            </div>
            <Cta to="/contact?topic=demo" variant="accent" className="shrink-0">
              Book a walkthrough <ArrowRight className="h-4 w-4" />
            </Cta>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <Reveal className="max-w-3xl">
            <h2 className="text-[clamp(28px,4vw,52px)] font-bold leading-[1.02] tracking-[-0.03em] text-ink">
              Run Atlas on the lab you already have.
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <Cta to="/contact?topic=partner" variant="ink">
                Request access <ArrowRight className="h-4 w-4" />
              </Cta>
              <Cta to="/docs" variant="outline">
                Read the docs
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
