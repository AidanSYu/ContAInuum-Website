import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, ExternalLink } from 'lucide-react';
import {
  listPlans,
  planFeatures,
  getMySubscription,
  hasAccess,
  startCheckout,
  openBillingPortal,
  trialDaysLeft,
  type Plan,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { SubscriptionBadge } from '@/components/app/SubscriptionBadge';
import { PENDING_PLAN_KEY } from '@/pages/auth/SignupPage';
import { cn } from '@/lib/utils';

function priceLabel(plan: Plan) {
  if (plan.amount_cents === 0) return 'Custom';
  const amt = plan.amount_cents / 100;
  return `$${Number.isInteger(amt) ? amt : amt.toFixed(2)}/${plan.interval}`;
}

export function BillingPage() {
  const [params, setParams] = useSearchParams();
  const [pendingPlan] = useState<string | null>(() => localStorage.getItem(PENDING_PLAN_KEY));
  const [busy, setBusy] = useState<string | null>(null);

  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: listPlans });
  const { data: sub, refetch } = useQuery({ queryKey: ['subscription'], queryFn: getMySubscription });

  // Handle Stripe redirect outcomes.
  useEffect(() => {
    const checkout = params.get('checkout');
    if (!checkout) return;

    const next = new URLSearchParams(params);
    next.delete('checkout');

    if (checkout === 'success') {
      toast.success('Subscription started! It may take a moment to appear.');
      // Give the webhook a beat, then refetch.
      const t = setTimeout(() => refetch(), 1500);
      setParams(next, { replace: true });
      return () => clearTimeout(t);
    }
    if (checkout === 'cancel') {
      toast('Checkout canceled — no charge was made.');
      setParams(next, { replace: true });
    }
  }, [params, setParams, refetch]);

  const access = hasAccess(sub ?? null);

  const handleStart = async (plan: Plan) => {
    if (plan.amount_cents === 0) {
      window.location.assign('/contact?topic=enterprise');
      return;
    }
    setBusy(plan.id);
    try {
      const url = await startCheckout(plan.id);
      localStorage.removeItem(PENDING_PLAN_KEY);
      window.location.assign(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start checkout.');
      setBusy(null);
    }
  };

  const handlePortal = async () => {
    setBusy('portal');
    try {
      const url = await openBillingPortal();
      window.location.assign(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not open billing portal.');
      setBusy(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="lab-label text-safety">BILLING</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">Billing</h1>
          <p className="mt-1 text-ink-muted">Manage your subscription and payment details.</p>
        </div>
        <SubscriptionBadge sub={sub ?? null} />
      </div>

      {/* Current subscription summary */}
      {access && sub ? (
        <div className="border border-line bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="lab-label">Current plan</p>
              <p className="mt-1 font-display text-2xl font-bold capitalize text-ink">
                {sub.plan_id ?? 'Subscription'}
              </p>
              {sub.status === 'trialing' && trialDaysLeft(sub) > 0 && (
                <p className="mt-1 text-sm text-safety">{trialDaysLeft(sub)} days left in trial</p>
              )}
              {sub.cancel_at_period_end && sub.current_period_end && (
                <p className="mt-1 text-sm text-amber-600">
                  Cancels on {new Date(sub.current_period_end).toLocaleDateString()}
                </p>
              )}
              {!sub.cancel_at_period_end && sub.current_period_end && (
                <p className="mt-1 text-sm text-ink-muted">
                  Renews {new Date(sub.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button onClick={handlePortal} disabled={busy === 'portal'} className="bg-safety text-white hover:bg-safety/90">
              {busy === 'portal' ? 'Opening…' : (<>Manage billing <ExternalLink className="ml-2 h-4 w-4" /></>)}
            </Button>
          </div>
          <p className="mt-4 font-mono-tech text-[11px] text-ink-faint">
            Payment methods, invoices, and cancellation are handled securely in the Stripe billing portal.
          </p>
        </div>
      ) : (
        <p className="text-ink-muted">
          {sub ? 'Your subscription is inactive.' : 'You don’t have an active subscription yet.'} Choose a plan
          to start your free trial.
        </p>
      )}

      {/* Plan selection (shown when no active access, or to switch via checkout) */}
      {!access && (
        <div className="grid gap-px border border-line bg-line md:grid-cols-3">
          {plans?.map((plan) => {
            const suggested = pendingPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={cn(
                  'flex flex-col bg-surface p-6',
                  suggested && 'ring-1 ring-inset ring-safety',
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink">{plan.name}</h3>
                  {suggested && (
                    <span className="bg-safety px-2 py-0.5 font-mono-tech text-[10px] uppercase tracking-wider text-white">
                      Your pick
                    </span>
                  )}
                </div>
                <p className="mt-3 font-display text-2xl font-bold text-ink">{priceLabel(plan)}</p>
                {plan.trial_days > 0 && plan.amount_cents > 0 && (
                  <p className="mt-1 lab-label text-safety">
                    {plan.trial_days}-DAY FREE TRIAL
                  </p>
                )}
                <ul className="mt-5 flex-1 space-y-2">
                  {planFeatures(plan).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-safety" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleStart(plan)}
                  disabled={busy === plan.id}
                  className={cn('mt-6 w-full', suggested ? 'bg-safety text-white hover:bg-safety/90' : 'bg-ink text-paper hover:bg-ink/90')}
                >
                  {busy === plan.id
                    ? 'Redirecting…'
                    : plan.amount_cents === 0
                      ? 'Contact sales'
                      : 'Start free trial'}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
