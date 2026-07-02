import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { getPost, formatDate } from '@/content/posts';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Cta } from '@/components/marketing/ui';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';

export function BlogPostPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <NotFoundPage />;

  return (
    <DarkPageShell>
      <Seo title={`${post.title}, Contineon`} description={post.excerpt} path={`/blog/${post.slug}`} type="article" />

      <article className="mx-auto max-w-3xl px-[5vw] pb-28 pt-32 lg:px-8 lg:pt-40">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All posts
        </Link>

        <header className="mt-8 border-b border-white/10 pb-8">
          <p className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-ink-faint">
            {formatDate(post.date)} · {post.readingMinutes} min read
          </p>
          <h1 className="type-h2 mt-4 text-ink">
            {post.title}
          </h1>
        </header>

        <div className="legal-prose mt-10 space-y-6">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <p className="type-h3 max-w-xl text-ink">
            See it on your bench.
          </p>
          <div className="mt-6">
            <Cta to="/docs" variant="accent">
              Get started <ArrowRight className="h-4 w-4" />
            </Cta>
          </div>
        </div>
      </article>
    </DarkPageShell>
  );
}
