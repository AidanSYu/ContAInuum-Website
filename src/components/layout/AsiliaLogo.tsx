import { cn } from '@/lib/utils';

/* The Asilia mark: a caret "Λ" peak with a deep triangular notch. Traced from the
   source asset. The peak uses currentColor so it inverts cleanly (black on light,
   white on the obsidian header). viewBox is tightened to the mark's bounds. */
export function AsiliaLogo({
  className,
  title = 'Asilia',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 40 1400 940"
      className={cn('h-[1em] w-auto shrink-0', className)}
      role="img"
      aria-label={title}
    >
      {/* Peak — caret "Λ" with a triangular counter */}
      <path
        fill="currentColor"
        d="M540 100 L15 960 L285 960 L540 560 L800 960 L1050 960 Z"
      />
    </svg>
  );
}
