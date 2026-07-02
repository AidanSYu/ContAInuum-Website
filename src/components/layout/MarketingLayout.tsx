import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GrainOverlay } from '@/components/effects';
import { CommandMenu } from '@/components/marketing/CommandMenu';
import { SmoothScroll } from '@/components/motion';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { DarkHeroContext } from './darkHero';

/** Public marketing shell: paper grain, header, page content, footer. */
export function MarketingLayout() {
  const { pathname, hash } = useLocation();
  const [darkHero, setDarkHero] = useState(false);
  const darkHeroValue = useMemo(() => ({ darkHero, setDarkHero }), [darkHero]);

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
    <DarkHeroContext.Provider value={darkHeroValue}>
      <div className="relative min-h-screen bg-paper text-ink">
        <SmoothScroll />
        <GrainOverlay />
        <CommandMenu />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="relative outline-none">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </DarkHeroContext.Provider>
  );
}
