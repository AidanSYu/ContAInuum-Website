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
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[480px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />
        ))}
      </div>
    );
  }

  if (isError || !plans?.length) {
    return (
      <p className="text-center text-sm text-text-secondary">
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
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan, idx) => {
        const featured = idx === highlightIdx;
        const isEnterprise = plan.amount_cents === 0;
        return (
          <div
            key={plan.id}
            className={cn(
              'relative flex flex-col rounded-2xl border p-8 transition-colors',
              featured
                ? 'border-safety/60 bg-safety/[0.04] shadow-[0_0_60px_-20px_rgba(255,77,46,0.5)]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20',
            )}
          >
            {featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-safety px-3 py-1 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-white">
                Most popular
              </span>
            )}

            <h3 className="font-display text-xl font-semibold text-text-primary">{plan.name}</h3>
            <p className="mt-2 min-h-[40px] text-sm text-text-secondary">{plan.description}</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-text-primary">
                {formatPrice(plan)}
              </span>
              {!isEnterprise && (
                <span className="text-sm text-text-secondary">/{plan.interval}</span>
              )}
            </div>
            {!isEnterprise && plan.trial_days > 0 && (
              <p className="mt-1 font-mono-tech text-xs uppercase tracking-wider text-safety">
                {plan.trial_days}-day free trial
              </p>
            )}

            <ul className="mt-6 flex-1 space-y-3">
              {planFeatures(plan).map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-safety" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() =>
                isEnterprise
                  ? navigate('/contact?topic=enterprise')
                  : navigate(`/signup?plan=${plan.id}`)
              }
              className={cn(
                'mt-8 w-full',
                featured
                  ? 'bg-safety text-white hover:bg-safety/90'
                  : 'bg-white/[0.06] text-text-primary hover:bg-white/[0.1]',
              )}
            >
              {isEnterprise ? 'Contact sales' : 'Start free trial'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
