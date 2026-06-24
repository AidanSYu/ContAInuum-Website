import { Reveal } from '@/lib/scroll-fx';

/* =============================================================================
   DesignPartners — honest "social proof" for a pre-launch product.

   We do not fabricate logos or testimonials. Today this renders the real
   design-partner program (private trial with working labs) and an invitation
   that turns the absence of logos into a CTA. The moment you have real,
   attributable quotes, add them to TESTIMONIALS and the component switches to a
   quote wall automatically — no layout work needed.
   ============================================================================= */

type Testimonial = { quote: string; name: string; role: string; org: string };

/** ⬇️ Add real, attributable quotes here when you have them (with permission). */
const TESTIMONIALS: Testimonial[] = [];

export function DesignPartners() {
  return (
    <section className="border-y border-line bg-surface py-[clamp(56px,8vw,104px)]">
      <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
        <Reveal className="flex flex-col items-start justify-between gap-6 border-b border-line pb-7 md:flex-row md:items-end">
          <div>
            <p className="lab-label text-safety">[ Built with the bench ]</p>
            <h2 className="mt-3.5 max-w-[20ch] font-display text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.06] tracking-tight text-ink">
              In private trial with working labs.
            </h2>
          </div>
          <p className="max-w-[24rem] text-ink-muted">
            We build alongside chemistry, materials, and biology labs — not for an imagined user.
            Partner names and independent benchmarks go public at launch.
          </p>
        </Reveal>

        {TESTIMONIALS.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex flex-col bg-surface p-7">
                <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-line pt-4">
                  <div className="font-display text-sm font-semibold text-ink">{t.name}</div>
                  <div className="font-mono-tech text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                    {t.role} · {t.org}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex h-24 items-center justify-center bg-surface">
                <span className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-ink-faint/60">
                  Partner at launch
                </span>
              </div>
            ))}
            <a
              href="/contact?topic=demo"
              className="group flex h-24 flex-col items-center justify-center gap-1 bg-paper transition-colors hover:bg-panel"
            >
              <span className="font-display text-sm font-semibold text-ink">Your lab here?</span>
              <span className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-safety">
                Become a design partner →
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
