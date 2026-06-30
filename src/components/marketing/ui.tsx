import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Quiet uppercase mono micro-label. No brackets, no dots. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('lab-label', className)}>{children}</span>;
}

type CtaVariant = 'accent' | 'ink' | 'light' | 'outline' | 'outlineLight';

const CTA_STYLES: Record<CtaVariant, string> = {
  accent: 'bg-safety text-white hover:bg-safety/90',
  ink: 'bg-ink text-paper hover:opacity-90',
  light: 'bg-white text-[#14171C] hover:bg-white/90',
  outline: 'border border-hairline-strong text-ink hover:bg-panel',
  outlineLight: 'border border-white/25 text-white hover:bg-white/10',
};

export function Cta({
  to,
  children,
  variant = 'accent',
  className,
}: {
  to: string;
  children: ReactNode;
  variant?: CtaVariant;
  className?: string;
}) {
  const isExternal = to.startsWith('http');
  const classes = cn(
    'inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors',
    CTA_STYLES[variant],
    className,
  );
  if (isExternal) {
    return (
      <a href={to} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
}
