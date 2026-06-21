import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/** The contAInuum wordmark — the capital AI is the brand's signature. */
export function Logo({ className, to = '/' }: { className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn(
        'font-display font-bold tracking-tight text-text-primary',
        'transition-opacity hover:opacity-80',
        className,
      )}
    >
      cont<span className="text-safety">AI</span>nuum
    </Link>
  );
}
