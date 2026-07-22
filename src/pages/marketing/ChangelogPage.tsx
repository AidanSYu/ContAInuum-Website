import { Seo } from '@/components/Seo';
import { formatDate } from '@/content/posts';

/* =============================================================================
   ChangelogPage, product updates, newest first. Add entries to ENTRIES; tag
   each change as new / improved / fixed. Data-driven so a release is one edit.
   ============================================================================= */

type Tag = 'new' | 'improved' | 'fixed';
type Entry = { date: string; title: string; changes: { tag: Tag; text: string }[] };

const ENTRIES: Entry[] = [
  {
    date: '2026-06-23',
    title: 'Private trial site',
    changes: [
      { tag: 'new', text: 'Asilia Framework product page, plus FAQ, Security, and About.' },
      { tag: 'new', text: 'Newsletter sign-up and a book-a-demo path.' },
      { tag: 'improved', text: 'Refreshed identity, new Contineon brand, type, and cinematic imagery.' },
      { tag: 'improved', text: 'Access is now request-based for design-partner labs.' },
    ],
  },
];

const TAG_STYLE: Record<Tag, string> = {
  new: 'border-safety/50 text-safety',
  improved: 'border-line-hair text-ink',
  fixed: 'border-line text-ink-muted',
};

export function ChangelogPage() {
  return (
    <div className="px-[5vw] pb-28 pt-32 lg:px-8 lg:pt-40">
      <Seo
        title="Changelog, Contineon"
        description="What’s new in Contineon and the Asilia platform."
        path="/changelog"
      />

      <div className="mx-auto max-w-3xl">
        <div className="border-b border-line pb-8">
          <p className="lab-label text-safety">CHANGELOG</p>
          <h1 className="mt-4 font-display text-[clamp(34px,5vw,56px)] font-bold tracking-tight text-ink">
            What’s new.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-muted">
            Product updates as we move from private trial toward launch.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {ENTRIES.map((e) => (
            <section key={e.date} className="grid gap-4 sm:grid-cols-[140px_1fr]">
              <div className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-ink-faint sm:pt-1">
                {formatDate(e.date)}
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{e.title}</h2>
                <ul className="mt-3 space-y-2.5">
                  {e.changes.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink-muted">
                      <span className={`mt-0.5 flex-none border px-1.5 py-0.5 font-mono-tech text-[9px] uppercase tracking-[0.12em] ${TAG_STYLE[c.tag]}`}>
                        {c.tag}
                      </span>
                      <span className="leading-relaxed">{c.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
