import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Platform', to: '/#platform' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Security', to: '/security' },
  { label: 'Contact', to: '/contact' },
];

/** Routes that lead with a full-bleed dark hero under the transparent header.
    The home hero is now a light editorial layout, so it uses ink nav at the top. */
const DARK_HERO_ROUTES = new Set(['/pricing']);

/** Persistent marketing-site header. Hairline-on-scroll, responsive, auth-aware. */
export function SiteHeader() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // White nav while transparent over a dark hero; dark nav once the bar is solid.
  const darkTop = !scrolled && DARK_HERO_ROUTES.has(pathname);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[100] transition-all duration-300',
        scrolled
          ? 'border-b border-line bg-paper/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-[5vw] lg:px-8">
        <div className="flex items-center gap-3">
          <Logo className={cn('text-lg', darkTop && 'text-white')} />
          <span
            className={cn(
              'hidden font-mono-tech text-[10px] uppercase tracking-[0.2em] sm:inline',
              darkTop ? 'text-white/50' : 'text-ink-faint',
            )}
          >
            / ATLAS
          </span>
        </div>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <a
              key={item.to}
              href={item.to}
              className={cn(
                'font-mono-tech text-[11px] uppercase tracking-[0.18em] transition-colors',
                darkTop ? 'text-white/80 hover:text-white' : 'text-ink-muted hover:text-ink',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('containuum:command'))}
            aria-label="Open command menu"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-mono-tech text-[10px] uppercase tracking-[0.14em] transition-colors',
              darkTop
                ? 'border-white/30 bg-white/5 text-white/70 hover:border-white/60 hover:text-white'
                : 'border-line bg-surface text-ink-faint hover:border-line-hair hover:text-ink',
            )}
          >
            <span className="text-[11px] leading-none">⌘</span>K
          </button>
          <ThemeToggle
            className={cn(
              darkTop &&
                'border-white/30 bg-white/5 text-white/80 hover:border-white/60 hover:text-white',
            )}
          />
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
                <Link to="/signup">Start free trial</Link>
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
        <div className="border-t border-line bg-paper/95 px-[5vw] py-6 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-5">
            {NAV.map((item) => (
              <a
                key={item.to}
                href={item.to}
                onClick={() => setOpen(false)}
                className="font-mono-tech text-sm uppercase tracking-[0.15em] text-ink-muted"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              {user ? (
                <Button asChild className="bg-safety text-white hover:bg-safety/90">
                  <Link to="/app" onClick={() => setOpen(false)}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="bg-safety text-white hover:bg-safety/90" onClick={() => setOpen(false)}>
                    <Link to="/signup">Start free trial</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="mt-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
