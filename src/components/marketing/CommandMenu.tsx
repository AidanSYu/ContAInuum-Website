import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BookOpen,
  CreditCard,
  LayoutGrid,
  LogIn,
  Mail,
  MoonStar,
  Network,
  Rocket,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

/* =============================================================================
   CommandMenu — ⌘K / Ctrl-K palette for fast navigation. Reinforces the
   "lab instrument" persona. Opens via keyboard or a `containuum:command` event
   (dispatched by the header affordance). Mounted once in MarketingLayout.
   ============================================================================= */

const THEME_KEY = 'containuum-theme';

function toggleTheme() {
  const root = document.documentElement;
  const dark = root.classList.toggle('dark');
  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  } catch {
    /* ignore */
  }
}

export const COMMAND_EVENT = 'containuum:command';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onEvent = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener(COMMAND_EVENT, onEvent);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener(COMMAND_EVENT, onEvent);
    };
  }, []);

  const go = (to: string) => () => {
    setOpen(false);
    navigate(to);
  };
  const act = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command menu"
      description="Jump to a page, section, or action"
    >
      <CommandInput placeholder="Search pages, sections, actions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={go('/#platform')}>
            <LayoutGrid /> Platform
          </CommandItem>
          <CommandItem onSelect={go('/pricing')}>
            <CreditCard /> Pricing
          </CommandItem>
          <CommandItem onSelect={go('/contact')}>
            <Mail /> Contact
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="On the landing page">
          <CommandItem onSelect={go('/#loop')}>
            <Activity /> Campaign loop
          </CommandItem>
          <CommandItem onSelect={go('/#memory')}>
            <Network /> Knowledge graph
          </CommandItem>
          <CommandItem onSelect={go('/#how')}>
            <BookOpen /> How it works
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={go('/signup')}>
            <Rocket /> Start free trial
          </CommandItem>
          <CommandItem onSelect={go('/login')}>
            <LogIn /> Sign in
          </CommandItem>
          <CommandItem onSelect={act(toggleTheme)}>
            <MoonStar /> Toggle light / dark theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
