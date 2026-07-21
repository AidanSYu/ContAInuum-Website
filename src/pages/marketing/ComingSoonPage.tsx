import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';

/* =============================================================================
   ComingSoonPage, a placeholder for pages whose content isn't written yet
   (currently the Technology pillars). Keeps the URL real and shareable, states
   what's coming, and routes intent to the contact form. Swap for the real page
   when the section is built out.
   ============================================================================= */

export function ComingSoonPage({
  title,
  kicker = 'TECHNOLOGY',
  description,
}: {
  title: string;
  kicker?: string;
  description: string;
}) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-[78svh] items-center px-[5vw] pb-28 pt-40 lg:px-8">
      <Seo title={`${title}, Contineon`} description={description} path={pathname} />

      <div className="mx-auto max-w-2xl text-center">
        <p className="lab-label text-safety">{kicker}</p>
        <h1 className="mt-5 font-display text-[clamp(38px,6.4vw,110px)] font-bold leading-[1.02] tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted">{description}</p>

        <div className="mx-auto mt-9 flex items-center justify-center gap-2.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safety" />
          <span className="lab-label text-ink-faint">Coming soon</span>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/contact?topic=partner"
            className="inline-flex items-center gap-1.5 rounded-full bg-safety px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-safety/90"
          >
            Request access <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline-strong px-5 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-panel"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
