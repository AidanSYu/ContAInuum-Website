import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/motion';
import { Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { Beat } from '@/components/marketing/Beat';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';
import { POSTS, formatDate } from '@/content/posts';

/* =============================================================================
   BlogPage — the company "Research" index. A compact obsidian hero, then the
   post index as a hairline-separated reading column. With a single post, the
   latest entry is featured as a larger lead so a thin list still reads
   intentional. Renders entirely from POSTS; routing stays at /blog/:slug.
   ============================================================================= */

export function BlogPage() {
  const [lead, ...rest] = POSTS;

  return (
    <DarkPageShell>
      <Seo
        title="Blog, Contineon"
        description="Notes from the team building the self-driving lab that remembers."
        path="/blog"
      />

      {/* Hero */}
      <Beat
        minH="min-h-[60svh]"
        align="end"
        intro
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <GridField className="opacity-[0.4]" />
          </>
        }
      >
        <div className="max-w-3xl pb-6">
          <p data-beat-fade>
            <Kicker>Research</Kicker>
          </p>
          <h1
            data-beat-title
            className="mt-5 type-hero"
          >
            Notes from the lab.
          </h1>
          <p
            data-beat-fade
            className="mt-7 max-w-2xl type-lede text-white/75"
          >
            How we think about autonomous science, the retrofit thesis, and what we’re learning with
            design partners.
          </p>
        </div>
      </Beat>

      {/* Index */}
      <section className="relative border-t border-white/10">
        <GridField className="opacity-[0.12]" />
        <div className="relative z-10 mx-auto max-w-3xl px-[5vw] py-[clamp(48px,7vw,104px)] lg:px-8">
          <Reveal stagger>
            {/* Lead entry */}
            {lead && (
              <article className="pb-12">
                <p className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                  {formatDate(lead.date)} · {lead.readingMinutes} min read
                </p>
                <h2 className="mt-4 type-h2">
                  <Link to={`/blog/${lead.slug}`} className="transition-colors hover:text-safety">
                    {lead.title}
                  </Link>
                </h2>
                <p className="mt-5 max-w-2xl type-body text-white/75">
                  {lead.excerpt}
                </p>
                <Link
                  to={`/blog/${lead.slug}`}
                  className="group mt-7 inline-flex items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-safety"
                >
                  Read
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            )}

            {/* Remaining entries */}
            {rest.map((p) => (
              <article key={p.slug} className="border-t border-white/10 py-10">
                <p className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                  {formatDate(p.date)} · {p.readingMinutes} min read
                </p>
                <h2 className="mt-3 type-h3">
                  <Link to={`/blog/${p.slug}`} className="transition-colors hover:text-safety">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-2 max-w-2xl leading-relaxed text-ink-muted">
                  {p.excerpt}
                </p>
                <Link
                  to={`/blog/${p.slug}`}
                  className="group mt-5 inline-flex items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-safety"
                >
                  Read
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </DarkPageShell>
  );
}
