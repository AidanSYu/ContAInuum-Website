import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/** The Contineon mark, an open "C" built from three offset bars, and wordmark.
    The mark uses currentColor so it inverts cleanly on dark sections. */
export function Logo({
  className,
  to = '/',
  showWordmark = true,
}: {
  className?: string;
  to?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      to={to}
      aria-label="Contineon, home"
      className={cn(
        'inline-flex items-center gap-2.5 font-semibold tracking-tight text-ink',
        'transition-opacity hover:opacity-70',
        className,
      )}
    >
      <svg
        viewBox="0 0 4096 4096"
        className="h-[0.95em] w-[0.95em] shrink-0"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="327.68" y="1311.676" width="489.99" height="1472.647" />
        <rect x="817.67" y="819.009" width="2950.65" height="489.99" />
        <rect x="817.67" y="2787.001" width="2950.65" height="489.99" />
      </svg>
      {showWordmark && <span>Contineon</span>}
    </Link>
  );
}
