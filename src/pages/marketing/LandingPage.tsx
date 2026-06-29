import {
  CinematicHero,
  MissionPanel,
  Interstitial,
  FrontierGrid,
  CampaignLoop,
  StatBand,
  InkButton,
} from '@/components/marketing/CinematicSections';
import { AnnotatedShowcase } from '@/components/marketing/AnnotatedShowcase';
import { DesignPartners } from '@/components/marketing/DesignPartners';
import { KnowledgeGraphShowcase } from '@/components/marketing/KnowledgeGraph';
import { Seo } from '@/components/Seo';
import { Folio, type FolioSection } from '@/components/marketing/Folio';

const FOLIO_SECTIONS: FolioSection[] = [
  { id: 'thesis', n: '01', label: 'The thesis' },
  { id: 'platform', n: '02', label: 'The platform' },
  { id: 'loop', n: '03', label: 'Campaign loop' },
  { id: 'memory', n: '04', label: 'Knowledge graph' },
  { id: 'how', n: '05', label: 'How it works' },
];

/* =============================================================================
   LandingPage — SpaceX-fused cinematic marketing home.
   Renders inside MarketingLayout (fixed SiteHeader + SiteFooter). The layout's
   <main> has no top padding so the hero sits full-bleed under the transparent
   header.
   ============================================================================= */

export function LandingPage() {
  return (
    <>
      <Seo
        title="contAInuum — the self-driving lab that remembers"
        description="contAInuum retrofits the lab you already run with ATLAS — an autonomous agent that plans, executes, hands work back to your scientists, and remembers every campaign it touches."
        path="/"
      />

      <Folio sections={FOLIO_SECTIONS} />

      <CinematicHero />

      {/* trust strip — honest framing, no fabricated customer logos */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-[5vw] py-6 lg:px-8 xl:px-16">
          <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono-tech text-[10px] uppercase tracking-[0.18em] text-safety">
            <span className="h-1.5 w-1.5 rounded-full bg-safety" />
            Now in private trial
          </span>
          <span className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Built with working chemistry, materials &amp; bio labs — partner names at launch
          </span>
        </div>
      </section>

      <MissionPanel
        id="thesis"
        image="/images/mission-robotic-arm.jpg"
        caption="Fig. 02 — Robotic arm, mid-handoff"
        dropcap
        kicker="[ 01 ] The thesis"
        title="Retrofit, don't replace."
        body="Every other self-driving lab asks you to rebuild from scratch. ATLAS runs on the instruments and people you already have — and when a step needs hands, it pauses and hands it to you."
        facts={[
          { label: 'Pause', text: 'Tool calls pause a campaign and notify a scientist — like a job awaiting approval.' },
          { label: 'Resume', text: 'Return a TLC photo, a CSV, or a note. ATLAS resumes from exactly where it stopped.' },
          { label: 'Learn', text: 'Correct a tool call once and that correction becomes training signal.' },
        ]}
      />

      <FrontierGrid />

      <AnnotatedShowcase />

      <CampaignLoop />

      <StatBand />

      <KnowledgeGraphShowcase figNo="04" />

      {/* how it works */}
      <section id="how" className="py-[clamp(64px,9vw,120px)]">
        <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <p className="lab-label text-safety">[ 05 ] How it works</p>
          <h2 className="mt-3.5 max-w-[20ch] font-display text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-ink">
            From your existing workcell to a learning lab in three moves.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
            {[
              { n: '01', h: 'Connect your workcell', p: 'Point ATLAS at the instruments, ELN, and data you already run. No rip-and-replace — it speaks to your stack over open integrations.' },
              { n: '02', h: 'Run a campaign', p: 'Define an objective. ATLAS plans, executes autonomously, and pauses to hand you the steps that still need a human.' },
              { n: '03', h: 'Watch it compound', p: 'Each campaign seeds the next. Failure modes, recipes, and lab lore accumulate into a memory that’s yours alone.' },
            ].map((s) => (
              <div key={s.n} className="bg-surface px-[30px] pb-[38px] pt-[34px]">
                <div className="flex items-baseline gap-3.5">
                  <span className="font-display text-[46px] font-extrabold tracking-tight text-safety">{s.n}</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <h3 className="mt-4.5 text-lg font-semibold text-ink">{s.h}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DesignPartners />

      <Interstitial
        kicker="[ The retrofit ]"
        title={
          <>
            Built for the lab
            <br />
            you already run.
          </>
        }
        body="No rip-and-replace. No new instruments. Just the campaigns you run today — with a memory."
      />

      {/* closing CTA — editorial back-page */}
      <section className="relative overflow-hidden bg-paper py-[clamp(80px,12vw,164px)] text-ink">
        <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative z-10 mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
          <div className="border-t-2 border-ink pt-10">
            <p className="lab-label text-safety">[ Get started ]</p>
            <div className="mt-6 grid items-end gap-x-12 gap-y-9 lg:grid-cols-12">
              <h2 className="cine-head text-[clamp(36px,5.4vw,78px)] lg:col-span-8">
                The next campaign starts{' '}
                <span className="font-editorial-italic text-safety">where the last one left off.</span>
              </h2>
              <div className="lg:col-span-4 lg:pb-3">
                <p className="max-w-[40ch] text-[clamp(15px,1.1vw,18px)] leading-relaxed text-ink-muted">
                  We work with a small cohort of design-partner labs — no rip-and-replace, no
                  amnesia. Apply to run ATLAS on the instruments you already have.
                </p>
                <div className="mt-7 flex flex-wrap gap-3.5">
                  <InkButton href="/contact?topic=partner" variant="solid">
                    Apply for access →
                  </InkButton>
                  <InkButton href="/contact?topic=demo" variant="outline">
                    Book a demo
                  </InkButton>
                </div>
                <p className="mt-4 text-sm text-ink-faint">
                  Or <a href="/pricing" className="text-ink-muted underline-offset-2 hover:text-ink hover:underline">view pricing</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
