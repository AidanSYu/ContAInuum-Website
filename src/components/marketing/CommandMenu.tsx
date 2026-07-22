import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  LayoutGrid,
  LogIn,
  Mail,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Target,
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
   CommandMenu, ⌘K / Ctrl-K palette for fast navigation. Opens via keyboard or
   a `contineon:command` event. Mounted once in MarketingLayout.
   ============================================================================= */

export const COMMAND_EVENT = 'contineon:command';

export function CommandMenu({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
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
          <CommandItem onSelect={go('/asilia')}>
            <Rocket /> Asilia
          </CommandItem>
          <CommandItem onSelect={go('/technology/foundation-models')}>
            <LayoutGrid /> Foundation Models
          </CommandItem>
          <CommandItem onSelect={go('/mission')}>
            <Target /> Mission
          </CommandItem>
          <CommandItem onSelect={go('/news')}>
            <FileText /> News
          </CommandItem>
          <CommandItem onSelect={go('/docs')}>
            <BookOpen /> Docs
          </CommandItem>
          <CommandItem onSelect={go('/security')}>
            <ShieldCheck /> Security
          </CommandItem>
          <CommandItem onSelect={go('/contact')}>
            <Mail /> Contact
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={go('/contact?topic=partner')}>
            <Rocket /> Request access
          </CommandItem>
          <CommandItem onSelect={go('/contact?topic=demo')}>
            <PlayCircle /> Book a demo
          </CommandItem>
          <CommandItem onSelect={go('/login')}>
            <LogIn /> Sign in
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
