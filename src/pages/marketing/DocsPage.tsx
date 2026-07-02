import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Magnetic, ParticleField, Reveal } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { Beat } from '@/components/marketing/Beat';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';

/* =============================================================================
   DocsPage, a single integration guide (not a full docs system). Answers the
   "how would this actually plug into my lab?" question for an evaluator. Expand
   into a proper docs site later; for now it gives prospects concrete footing.
   ============================================================================= */

const STEPS = [
  {
    n: '01',
    h: 'Connect your workcell',
    p: 'Point Atlas at the instruments, ELN, and data stores you already run. Integration is over open interfaces, if a step can be scripted or its output exported, Atlas can read it. No rip-and-replace and no new instruments.',
    items: ['Liquid handlers & automation', 'Plate readers & analytical instruments (e.g. LC/MS)', 'Electronic lab notebooks', 'Existing execution traces & CSV/data exports'],
  },
  {
    n: '02',
    h: 'Define a campaign',
    p: 'Describe an objective, a yield to optimize, a screen to run. Atlas plans the campaign, seeding it from prior runs in your lab so it doesn’t start cold, and proposes the steps it will execute autonomously.',
    items: ['Set an objective & constraints', 'Review the seeded plan', 'Approve autonomous execution'],
  },
  {
    n: '03',
    h: 'Resolve handoffs',
    p: 'When a step needs hands, the campaign pauses and notifies a scientist, by email, Slack, or mobile depending on your plan. You return a result and the run resumes from exactly where it stopped. Corrections become training signal.',
    items: ['Get notified on the channel you use', 'Return a reading, file, or note', 'Run resumes with full state preserved'],
  },
  {
    n: '04',
    h: 'Watch memory compound',
    p: 'Every campaign feeds a knowledge graph that is yours alone, recipes, failure modes, supplier quirks, lab lore. The next campaign starts smarter, and your graph and run history export with you anytime.',
    items: ['Cross-campaign carry-over', 'Recipe & failure-mode library', 'Full lineage & one-click export'],
  },
];

export function DocsPage() {
  return (
    <DarkPageShell>
      <Seo
        title="Integration guide, Contineon"
        description="How Atlas connects to the instruments, ELN, and data you already run, and how a campaign goes from objective to compounding memory."
        path="/docs"
      />

      {/* Hero */}
      <Beat
        minH="min-h-[60svh]"
        align="end"
        intro
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <ParticleField className="pointer-events-none absolute inset-0 z-[1]" />
            <GridField className="opacity-[0.4]" />
          </>
        }
      >
        <div className="max-w-3xl pb-6">
          <p data-beat-fade>
            <Kicker>Docs · Integration guide</Kicker>
          </p>
          <h1
            data-beat-title
            className="type-hero mt-5"
          >
            From your workcell to a learning lab.
          </h1>
          <p data-beat-fade className="type-lede mt-7 max-w-2xl text-white/75">
            A practical overview of how Atlas plugs into the lab you already run. Need specifics for
            your stack?{' '}
            <a href="/contact?topic=demo" className="text-safety underline-offset-4 hover:underline">
              Ask us.
            </a>
          </p>
          <div data-beat-fade className="mt-10">
            <Magnetic>
              <Cta to="/contact?topic=demo" variant="outlineLight">
                Book a walkthrough <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
          </div>
        </div>
      </Beat>

      {/* Steps */}
      <section className="relative border-t border-white/10">
        <GridField className="opacity-[0.12]" />
        <div className="relative z-10 mx-auto max-w-4xl px-[5vw] py-[clamp(48px,7vw,96px)] lg:px-8">
          {STEPS.map((s) => (
            <Reveal
              key={s.n}
              className="grid grid-cols-1 gap-4 border-t border-white/10 py-8 sm:grid-cols-[80px_1fr] sm:gap-10"
            >
              <span className="lab-label pt-1.5 text-safety">{s.n}</span>
              <div>
                <h2 className="type-h3 text-ink">
                  {s.h}
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">{s.p}</p>
                <div className="mt-6 grid gap-x-10 sm:grid-cols-2">
                  {s.items.map((it) => (
                    <div
                      key={it}
                      className="border-t border-white/10 py-2.5 font-mono-tech text-[13px] tracking-[0.02em] text-ink-muted"
                    >
                      {it}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Close */}
      <section className="relative border-t border-white/10">
        <GridField className="opacity-20" />
        <div className="relative z-10 mx-auto max-w-4xl px-[5vw] py-[clamp(56px,8vw,112px)] lg:px-8">
          <Reveal>
            <h2 className="type-h2 max-w-3xl">
              Want the technical detail?
            </h2>
            <p className="type-lede mt-6 max-w-xl text-white/75">
              We’ll walk through integration for your specific instruments and data, and share security
              and deployment specifics for your evaluation.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Cta to="/contact?topic=demo" variant="accent">
                Book a technical walkthrough <ArrowRight className="h-4 w-4" />
              </Cta>
              <Cta to="/security" variant="outlineLight">
                Read about security
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </DarkPageShell>
  );
}
