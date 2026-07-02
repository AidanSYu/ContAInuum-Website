import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BookOpen,
  FileText,
  LayoutGrid,
  Mail,
  PlayCircle,
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
   CommandMenu, ⌘K / Ctrl-K palette for fast navigation. Opens via keyboard or
   a `contineon:command` event. Mounted once in MarketingLayout.
   ============================================================================= */

export const COMMAND_EVENT = 'contineon:command';

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
          <CommandItem onSelect={go('/platform')}>
            <LayoutGrid /> Atlas Framework
          </CommandItem>
          <CommandItem onSelect={go('/blog')}>
            <FileText /> Research
          </CommandItem>
          <CommandItem onSelect={go('/docs')}>
            <BookOpen /> Docs
          </CommandItem>
          <CommandItem onSelect={go('/contact')}>
            <Mail /> Contact
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="On the landing page">
          <CommandItem onSelect={go('/#thesis')}>
            <BookOpen /> The thesis
          </CommandItem>
          <CommandItem onSelect={go('/#loop')}>
            <Activity /> Campaign loop
          </CommandItem>
          <CommandItem onSelect={go('/#how')}>
            <LayoutGrid /> How it works
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={go('/docs')}>
            <Rocket /> Get started
          </CommandItem>
          <CommandItem onSelect={go('/contact?topic=demo')}>
            <PlayCircle /> Book a demo
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
