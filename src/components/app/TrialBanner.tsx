import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { getMySubscription, hasAccess, trialDaysLeft } from '@/lib/api';
import { cn } from '@/lib/utils';

/* =============================================================================
   TrialBanner — converts the dormant "N days left" number into action. Shown at
   the top of the dashboard:
     • no subscription      → prompt to start the free trial
     • trialing             → days remaining (emphasized in the last 3 days)
     • past_due             → payment problem, send to billing
     • inactive/expired     → prompt to pick a plan
     • active (paid)        → nothing
   ============================================================================= */

type Tone = 'info' | 'warn';

function Banner({ tone, icon: Icon, children, cta }: { tone: Tone; icon: typeof Clock; children: React.ReactNode; cta: { to: string; label: string } }) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-4 py-3 text-sm',
        tone === 'warn'
          ? 'border-amber-500/40 bg-amber-500/[0.08] text-ink'
          : 'border-safety/40 bg-safety/[0.06] text-ink',
      )}
    >
      <Icon className={cn('h-4 w-4 flex-none', tone === 'warn' ? 'text-amber-600' : 'text-safety')} strokeWidth={1.75} />
      <span className="flex-1">{children}</span>
      <Link
        to={cta.to}
        className={cn(
          'inline-flex items-center justify-center rounded px-3 py-1.5 text-xs font-medium transition-colors',
          tone === 'warn' ? 'bg-amber-600 text-white hover:bg-amber-600/90' : 'bg-safety text-white hover:bg-safety/90',
        )}
      >
        {cta.label}
      </Link>
    </div>
  );
}

export function TrialBanner() {
  const { data: sub, isLoading } = useQuery({ queryKey: ['subscription'], queryFn: getMySubscription });
  if (isLoading) return null;

  // No subscription at all → invite to start the trial.
  if (!sub) {
    return (
      <Banner tone="info" icon={Sparkles} cta={{ to: '/app/billing', label: 'Choose a plan' }}>
        Start your free trial to run your first campaign — 14 days, cancel anytime.
      </Banner>
    );
  }

  if (sub.status === 'past_due') {
    return (
      <Banner tone="warn" icon={AlertTriangle} cta={{ to: '/app/billing', label: 'Fix billing' }}>
        There’s a problem with your last payment. Update your billing details to keep ATLAS running.
      </Banner>
    );
  }

  if (sub.status === 'trialing') {
    const days = trialDaysLeft(sub);
    const ending = days <= 3;
    return (
      <Banner
        tone={ending ? 'warn' : 'info'}
        icon={Clock}
        cta={{ to: '/app/billing', label: 'Manage billing' }}
      >
        {days > 0 ? (
          <>
            <strong className="font-semibold">{days} day{days === 1 ? '' : 's'} left</strong> in your free trial
            {sub.cancel_at_period_end
              ? ' — your trial is set to cancel and won’t convert.'
              : ' — your plan begins automatically when it ends.'}
          </>
        ) : (
          <>Your trial ends today — your plan begins automatically unless you cancel.</>
        )}
      </Banner>
    );
  }

  // Any non-access status that isn't trialing (canceled, expired, unpaid, paused).
  if (!hasAccess(sub)) {
    return (
      <Banner tone="warn" icon={AlertTriangle} cta={{ to: '/app/billing', label: 'Choose a plan' }}>
        Your subscription is inactive. Pick a plan to resume running campaigns with ATLAS.
      </Banner>
    );
  }

  // Active, paid subscription → no nudge needed.
  return null;
}
