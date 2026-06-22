import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Platform', to: '/#platform' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
];

/** Persistent marketing-site header. Hairline-on-scroll, responsive, auth-aware. */
export function SiteHeader() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          <Logo className="text-lg" />
          <span className="hidden font-mono-tech text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:inline">
            / ATLAS
          </span>
        </div>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <a
              key={item.to}
              href={item.to}
              className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button asChild size="sm" className="bg-safety text-white hover:bg-safety/90">
              <Link to="/app">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-ink-muted hover:text-ink">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-safety text-white hover:bg-safety/90">
                <Link to="/signup">Start free trial</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="text-ink md:hidden"
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
          </nav>
        </div>
      )}
    </header>
  );
}
