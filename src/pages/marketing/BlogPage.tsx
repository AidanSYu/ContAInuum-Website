import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { POSTS, formatDate } from '@/content/posts';

export function BlogPage() {
  return (
    <div className="px-[5vw] pb-28 pt-32 lg:px-8 lg:pt-40">
      <Seo
        title="News, Contineon"
        description="Announcements, research notes, and launch updates from the team building the self-driving lab that remembers."
        path="/news"
      />

      <div className="mx-auto max-w-3xl">
        <div className="border-b border-line pb-8">
          <p className="lab-label text-safety">NEWS</p>
          <h1 className="mt-4 font-display text-[clamp(34px,5vw,56px)] font-bold tracking-tight text-ink">
            Notes from the lab.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-muted">
            How we think about autonomous science, the retrofit thesis, and what we’re learning with
            design partners.
          </p>
        </div>

        <div className="mt-10 divide-y divide-line">
          {POSTS.map((p) => (
            <article key={p.slug} className="py-8">
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                {formatDate(p.date)} · {p.readingMinutes} min read
              </p>
              <h2 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-ink">
                <Link to={`/news/${p.slug}`} className="hover:text-safety">{p.title}</Link>
              </h2>
              <p className="mt-3 leading-relaxed text-ink-muted">{p.excerpt}</p>
              <Link
                to={`/news/${p.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-safety hover:gap-2.5"
              >
                Read <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
