import type { ReactNode } from 'react';
import { useDarkHero } from '@/components/layout/darkHero';
import { cn } from '@/lib/utils';

/* =============================================================================
   DarkPageShell — the obsidian surface for a marketing subpage. Applies the dark
   token scope + near-black canvas once, and signals the header to invert over the
   page's dark hero. Pages fill it with Beats (cinematic) or a dark reading column
   (calm/legal). Do this once here rather than per page.
   ============================================================================= */

export function DarkPageShell({ children, className }: { children: ReactNode; className?: string }) {
  useDarkHero();
  return <div className={cn('dark min-h-screen bg-[#06080B] text-ink', className)}>{children}</div>;
}
