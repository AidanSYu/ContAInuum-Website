import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { listPlans, planFeatures, type Plan } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function formatPrice(plan: Plan): string {
  if (plan.amount_cents === 0) return 'Custom';
  const amount = plan.amount_cents / 100;
  const display = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return `$${display}`;
}

/** The middle plan (by sort order) is highlighted as the recommended tier. */
export function PricingCards() {
  const navigate = useNavigate();
  const { data: plans, isLoading, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: listPlans,
  });

  if (isLoading) {
    return (
      <div className="grid gap-px border border-line bg-line md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[480px] animate-pulse bg-panel" />
        ))}
      </div>
    );
  }

  if (isError || !plans?.length) {
    return (
      <p className="text-center text-sm text-ink-muted">
        Pricing is loading shortly — please check back, or{' '}
        <button onClick={() => navigate('/contact')} className="text-safety underline">
          contact us
        </button>
        .
      </p>
    );
  }

  const highlightIdx = Math.min(1, plans.length - 1);

  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-3">
      {plans.map((plan, idx) => {
        const featured = idx === highlightIdx;
        const isEnterprise = plan.amount_cents === 0;
        return (
          <div
            key={plan.id}
            className={cn(
              'relative flex flex-col p-8 transition-colors',
              featured ? 'bg-surface ring-1 ring-inset ring-safety' : 'bg-surface hover:bg-panel',
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">{plan.name}</h3>
              {featured && (
                <span className="bg-safety px-2 py-0.5 font-mono-tech text-[10px] uppercase tracking-[0.14em] text-white">
                  Most popular
                </span>
              )}
            </div>
            <p className="mt-2 min-h-[40px] text-sm text-ink-muted">{plan.description}</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-ink">{formatPrice(plan)}</span>
              {!isEnterprise && <span className="text-sm text-ink-muted">/{plan.interval}</span>}
            </div>
            {!isEnterprise && (
              <p className="mt-1 lab-label text-ink-faint">Indicative — pilots scoped</p>
            )}

            <div className="my-6 h-px bg-line" />

            <ul className="flex-1 space-y-3">
              {planFeatures(plan).map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-ink-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-safety" strokeWidth={2} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() =>
                navigate(isEnterprise ? '/contact?topic=enterprise' : '/contact?topic=partner')
              }
              className={cn(
                'mt-8 w-full',
                featured
                  ? 'bg-safety text-white hover:bg-safety/90'
                  : 'bg-ink text-paper hover:bg-ink/90',
              )}
            >
              {isEnterprise ? 'Talk to us' : 'Apply for access'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
