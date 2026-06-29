import type { Subscription } from '@/lib/api';
import { trialDaysLeft } from '@/lib/api';
import { cn } from '@/lib/utils';

const LABELS: Record<Subscription['status'], string> = {
  trialing: 'Trial',
  active: 'Active',
  past_due: 'Past due',
  canceled: 'Canceled',
  incomplete: 'Incomplete',
  incomplete_expired: 'Expired',
  unpaid: 'Unpaid',
  paused: 'Paused',
};

const TONES: Record<Subscription['status'], string> = {
  trialing: 'border-safety/40 bg-safety/10 text-safety',
  active: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700',
  past_due: 'border-amber-600/30 bg-amber-500/10 text-amber-700',
  unpaid: 'border-amber-600/30 bg-amber-500/10 text-amber-700',
  paused: 'border-line bg-panel text-ink-muted',
  canceled: 'border-line bg-panel text-ink-muted',
  incomplete: 'border-line bg-panel text-ink-muted',
  incomplete_expired: 'border-line bg-panel text-ink-muted',
};

export function SubscriptionBadge({ sub }: { sub: Subscription | null }) {
  if (!sub) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono-tech text-xs uppercase tracking-wider text-ink-muted">
        No subscription
      </span>
    );
  }

  const left = trialDaysLeft(sub);
  const label = LABELS[sub.status] + (sub.status === 'trialing' && left > 0 ? ` · ${left}d left` : '');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono-tech text-xs uppercase tracking-wider',
        TONES[sub.status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
