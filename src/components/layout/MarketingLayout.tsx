import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GrainOverlay } from '@/components/effects';
import { CommandMenu } from '@/components/marketing/CommandMenu';
import { SmoothScroll } from '@/components/motion';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

/** Public marketing shell: paper grain, header, page content, footer. */
export function MarketingLayout() {
  const { pathname, hash } = useLocation();

  // Scroll to top on navigation, or to a #section when a hash is present.
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <SmoothScroll />
      <GrainOverlay />
      <CommandMenu />
      <SiteHeader />
      <main className="relative">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
