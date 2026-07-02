import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { formatDate } from '@/content/posts';
import { Magnetic, ParticleField, Reveal } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { Beat } from '@/components/marketing/Beat';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';

/* =============================================================================
   ChangelogPage, product updates, newest first. Add entries to ENTRIES; tag
   each change as new / improved / fixed. Data-driven so a release is one edit.
   ============================================================================= */

type Tag = 'new' | 'improved' | 'fixed';
type Entry = { date: string; title: string; changes: { tag: Tag; text: string }[] };

const ENTRIES: Entry[] = [
  {
    date: '2026-06-23',
    title: 'Launch site',
    changes: [
      { tag: 'new', text: 'Atlas Framework product page, plus FAQ, Security, and About.' },
      { tag: 'new', text: 'Newsletter sign-up and a book-a-demo path.' },
      { tag: 'improved', text: 'Refreshed identity, new Contineon brand, type, and cinematic imagery.' },
      { tag: 'improved', text: 'Atlas is open source, install it from the docs and run your own campaigns.' },
    ],
  },
];

const TAG_STYLE: Record<Tag, string> = {
  new: 'border-safety/40 bg-safety/15 text-safety',
  improved: 'border-white/15 bg-white/[0.04] text-ink',
  fixed: 'border-white/10 bg-white/[0.02] text-ink-muted',
};

export function ChangelogPage() {
  return (
    <DarkPageShell>
      <Seo
        title="Changelog, Contineon"
        description="What’s new in Contineon and the Atlas platform."
        path="/changelog"
      />

      {/* Hero */}
      <Beat
        minH="min-h-[58svh]"
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
            <Kicker className="text-safety">Changelog</Kicker>
          </p>
          <h1
            data-beat-title
            className="type-hero mt-5"
          >
            What’s new.
          </h1>
          <p data-beat-fade className="type-lede mt-7 max-w-2xl text-white/75">
            Product updates as we build Atlas in the open.
          </p>
        </div>
      </Beat>

      {/* Release log */}
      <Beat
        minH="min-h-0"
        media={
          <>
            <div className="absolute inset-0 bg-[#06080B]" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <div className="max-w-2xl">
          <Kicker>Release log</Kicker>
          <h2 className="type-h2 mt-4">
            Every release, newest first.
          </h2>
        </div>

        <Reveal className="mt-14">
          {ENTRIES.map((e) => (
            <section
              key={e.date}
              className="grid grid-cols-1 gap-6 border-t border-white/10 py-8 sm:grid-cols-[160px_1fr] sm:gap-12"
            >
              <div className="font-mono-tech text-[12px] uppercase tracking-[0.16em] text-ink-faint sm:pt-1.5">
                {formatDate(e.date)}
              </div>
              <div className="max-w-2xl">
                <h3 className="type-h3 text-ink">
                  {e.title}
                </h3>
                <ul className="mt-5 space-y-4">
                  {e.changes.map((c, i) => (
                    <li key={i} className="flex items-start gap-4 text-[15px] leading-relaxed text-ink-muted">
                      <span
                        className={`mt-0.5 flex-none border px-2 py-0.5 font-mono-tech text-[9px] uppercase tracking-[0.14em] ${TAG_STYLE[c.tag]}`}
                      >
                        {c.tag}
                      </span>
                      <span>{c.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </Reveal>
      </Beat>

      {/* Close */}
      <Beat
        minH="min-h-[70svh]"
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
          Want the next release on your bench?
        </h2>
        <div data-beat-fade className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Cta to="/contact?topic=demo" variant="accent">
              Book a demo <ArrowRight className="h-4 w-4" />
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
