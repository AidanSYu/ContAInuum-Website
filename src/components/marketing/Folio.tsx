import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/* =============================================================================
   Folio — an editorial margin rail. Tracks the section in the viewport center
   and marks it like a running header in a printed journal.

   Renders at xl (>=1280px), where the page reserves a left gutter via the
   shared `xl:px-16` container padding — below that it stays hidden rather than
   overlapping content. The section label is a hover-only chip (absolutely
   positioned) so it never persistently covers content.
   ============================================================================= */

export interface FolioSection {
  id: string;
  n: string;
  label: string;
}

export function Folio({ sections }: { sections: FolioSection[] }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el != null);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // "active" once a section crosses the vertical center band
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <aside
      aria-hidden
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex"
    >
      {sections.map((s) => {
        const on = active === s.id;
        return (
          <a key={s.id} href={`#${s.id}`} className="group relative flex items-center gap-2.5">
            <span
              className={cn(
                'h-px transition-all duration-300',
                on ? 'w-6 bg-safety' : 'w-3 bg-line-hair group-hover:w-5',
              )}
            />
            <span
              className={cn(
                'w-4 font-mono-tech text-[10px] tracking-[0.14em] transition-colors',
                on ? 'text-ink' : 'text-ink-faint group-hover:text-ink-muted',
              )}
            >
              {s.n}
            </span>
            {/* hover-only label chip — absolute, so it overlays transiently and
                never reserves space over the grid */}
            <span
              className={cn(
                'pointer-events-none absolute left-[44px] whitespace-nowrap rounded-[2px] bg-paper/95 px-2 py-1',
                'font-mono-tech text-[10px] uppercase tracking-[0.16em] text-ink-muted shadow-sm backdrop-blur-sm',
                'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
              )}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </aside>
  );
}
