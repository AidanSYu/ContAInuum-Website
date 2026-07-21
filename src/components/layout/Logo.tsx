import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/** The Contineon mark, an open "C" built from three offset bars, and wordmark.
    The mark uses currentColor so it inverts cleanly on dark sections.
    With `revealWordmark`, the wordmark stays collapsed and animates out from the
    mark on hover instead of showing statically. */
export function Logo({
  className,
  to = '/',
  showWordmark = true,
  revealWordmark = false,
}: {
  className?: string;
  to?: string;
  showWordmark?: boolean;
  revealWordmark?: boolean;
}) {
  return (
    <Link
      to={to}
      aria-label="Contineon, home"
      className={cn(
        'group inline-flex items-center font-semibold tracking-tight text-ink',
        !revealWordmark && 'gap-2.5 transition-opacity hover:opacity-70',
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
      {showWordmark && !revealWordmark && <span>Contineon</span>}
      {revealWordmark && (
        <span
          className={cn(
            'max-w-0 -translate-x-1 overflow-hidden whitespace-nowrap opacity-0',
            'transition-all duration-500 ease-out',
            'group-hover:ml-2.5 group-hover:max-w-[9rem] group-hover:translate-x-0 group-hover:opacity-100',
          )}
        >
          Contineon
        </span>
      )}
    </Link>
  );
}
