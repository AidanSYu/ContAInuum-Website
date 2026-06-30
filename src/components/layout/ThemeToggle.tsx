import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/* =============================================================================
   ThemeToggle, light/dark switch for the Lab palette.
   Rendered in SiteHeader, the dashboard topbar, and the auth pages.

   The FOUC guard in index.html applies the saved theme before first paint, so
   the toggle just keeps `.dark` on <html> in sync with localStorage.
   ============================================================================= */

const KEY = 'contineon-theme';

function getInitial(): 'light' | 'dark' {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  try {
    if (localStorage.getItem(KEY) === 'dark') return 'dark';
  } catch {
    /* ignore */
  }
  return 'light';
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5',
        'font-mono-tech text-[10px] uppercase tracking-[0.14em] text-ink-muted transition-colors',
        'hover:border-line-hair hover:text-ink',
        className,
      )}
    >
      {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      <span>{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
