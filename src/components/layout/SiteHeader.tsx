import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { DarkHeroContext } from './darkHero';

type NavLink = { label: string; to: string; desc?: string };
type NavEntry = { label: string; to?: string; items?: NavLink[] };

const PRODUCT: NavLink[] = [
  { label: 'Atlas Framework', desc: 'Our first product', to: '/platform' },
  { label: 'Demo', desc: 'Coming soon', to: '/contact?topic=demo' },
];

const COMPANY: NavLink[] = [
  { label: 'About', desc: 'Who we are', to: '/about' },
  { label: 'Security', desc: 'Trust & infrastructure', to: '/security' },
  { label: 'Changelog', desc: "What's shipped", to: '/changelog' },
  { label: 'Contact', desc: 'Talk to us', to: '/contact' },
];

const NAV: NavEntry[] = [
  { label: 'Product', items: PRODUCT },
  { label: 'Research', to: '/blog' },
  { label: 'Company', items: COMPANY },
  { label: 'Docs', to: '/docs' },
];

export function SiteHeader() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { darkHero } = useContext(DarkHeroContext);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  // Escape closes any open menu (dropdown or mobile).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(null);
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const darkTop = !scrolled && darkHero;

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 120);
  };

  const linkBase = cn(
    'text-[15px] transition-colors',
    darkTop ? 'text-white/80 hover:text-white' : 'text-ink-muted hover:text-ink',
  );

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[100] transition-colors duration-300',
        scrolled
          ? 'border-b border-line bg-[hsl(var(--background)/0.85)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
      onMouseLeave={scheduleClose}
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-safety px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[200]"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-[5vw] lg:px-8">
        <Logo className={cn('text-[19px]', darkTop && 'text-white')} />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) =>
            item.items ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={menu === item.label}
                  onClick={() => setMenu((m) => (m === item.label ? null : item.label))}
                  className={cn('flex items-center gap-1 rounded-md px-3 py-2', linkBase)}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform',
                      menu === item.label && 'rotate-180',
                    )}
                  />
                </button>
                {menu === item.label && (
                  <div
                    className="absolute left-0 top-[calc(100%+6px)] w-64 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lab"
                    onMouseEnter={() => openMenu(item.label)}
                  >
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-panel"
                      >
                        <span className="block text-[14px] font-medium text-ink">{sub.label}</span>
                        {sub.desc && (
                          <span className="mt-0.5 block text-[12.5px] text-ink-faint">{sub.desc}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.label} to={item.to!} className={cn('rounded-md px-3 py-2', linkBase)}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          {user ? (
            <Button asChild size="sm" className="bg-safety text-white hover:bg-safety/90">
              <Link to="/app">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  darkTop
                    ? 'text-white/80 hover:bg-white/10 hover:text-white'
                    : 'text-ink-muted hover:text-ink',
                )}
              >
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-safety text-white hover:bg-safety/90">
                <Link to="/contact?topic=partner">Request access</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className={cn('md:hidden', darkTop ? 'text-white' : 'text-ink')}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-[hsl(var(--background)/0.97)] px-[5vw] py-6 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) =>
              item.items ? (
                <div key={item.label} className="py-2">
                  <span className="lab-label">{item.label}</span>
                  <div className="mt-2 flex flex-col gap-1">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        className="rounded-lg px-2 py-2 text-[15px] text-ink-muted hover:bg-panel hover:text-ink"
                      >
                        {sub.label}
                        {sub.desc && <span className="ml-2 text-[12.5px] text-ink-faint">{sub.desc}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.to!}
                  className="rounded-lg px-2 py-2.5 text-[15px] text-ink-muted hover:bg-panel hover:text-ink"
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              {user ? (
                <Button asChild className="bg-safety text-white hover:bg-safety/90">
                  <Link to="/app">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="bg-safety text-white hover:bg-safety/90">
                    <Link to="/contact?topic=partner">Request access</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
