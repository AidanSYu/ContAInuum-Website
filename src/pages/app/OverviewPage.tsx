import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowRight, FolderKanban, CreditCard, Landmark, Sparkles } from 'lucide-react';
import {
  getMyProfile,
  getMySubscription,
  listProjects,
  listMyAgreements,
  trialDaysLeft,
  hasAccess,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { SubscriptionBadge } from '@/components/app/SubscriptionBadge';
import { HandoffAlert, StatCards, CampaignsEmptyState } from '@/components/app/OverviewExtras';
import { flags } from '@/lib/flags';

export function OverviewPage() {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getMyProfile });
  const { data: sub } = useQuery({ queryKey: ['subscription'], queryFn: getMySubscription });
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: listProjects });
  const { data: agreements } = useQuery({ queryKey: ['agreements'], queryFn: listMyAgreements });

  const name = profile?.full_name?.split(' ')[0] ?? 'there';
  const access = hasAccess(sub ?? null);
  const trialLeft = trialDaysLeft(sub ?? null);

  // Design-partner phase: surface the pilot engagement instead of self-serve billing.
  const primaryAgreement = agreements?.[0] ?? null;
  const pendingAgreement = agreements?.find((a) => a.status === 'pending') ?? null;
  const selfServe = flags.selfServeBilling;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="lab-label text-safety">OVERVIEW</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">Welcome back, {name}</h1>
          <p className="mt-1 text-ink-muted">Here’s what’s happening in your lab.</p>
        </div>
        {(sub || selfServe) && <SubscriptionBadge sub={sub ?? null} />}
      </div>

      {/* Self-serve activation prompt (only when self-serve billing is on). */}
      {!access && selfServe && (
        <div className="border border-safety/40 bg-safety/[0.05] p-6">
          <div className="flex flex-wrap items-start gap-4">
            <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-safety" strokeWidth={1.5} />
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold text-ink">
                Activate your ASILIA access
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Start your free trial to spin up projects and run autonomous agents.
              </p>
            </div>
            <Button asChild className="bg-safety text-white hover:bg-safety/90">
              <Link to="/app/billing">Choose a plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      )}

      {/* Design-partner pilot engagement state. */}
      {!access && !selfServe && (
        <div className="border border-safety/40 bg-safety/[0.05] p-6">
          <div className="flex flex-wrap items-start gap-4">
            <Landmark className="mt-0.5 h-6 w-6 shrink-0 text-safety" strokeWidth={1.5} />
            <div className="flex-1">
              {pendingAgreement ? (
                <>
                  <h2 className="font-display text-lg font-semibold text-ink">Your engagement is ready to fund</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Funding your pilot locks in your milestones and starts the work.
                  </p>
                </>
              ) : primaryAgreement ? (
                <>
                  <h2 className="font-display text-lg font-semibold text-ink">Your pilot is set up</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Track your engagement and milestone status under Your Engagement.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-lg font-semibold text-ink">Your design-partner pilot</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Your engagement and milestones will appear here once our team completes your onboarding.
                  </p>
                </>
              )}
            </div>
            <Button asChild className="bg-safety text-white hover:bg-safety/90">
              <Link to={primaryAgreement ? `/app/escrow/${primaryAgreement.id}` : '/app/escrow'}>
                {pendingAgreement ? 'Fund engagement' : 'View your engagement'} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {access && trialLeft > 0 && (
        <div className="border border-line bg-surface p-6">
          <p className="text-sm text-ink-muted">
            You’re on a free trial, <span className="font-medium text-ink">{trialLeft} day{trialLeft === 1 ? '' : 's'} left</span>.
            Manage your plan anytime in{' '}
            <Link to="/app/billing" className="text-safety hover:underline">Billing</Link>.
          </p>
        </div>
      )}

      {/* Campaign handoff + headline metrics.
          The numbers are demo data (no ASILIA campaign backend yet), so they only
          render behind the showDemoMetrics flag. Otherwise: an honest empty state. */}
      {access && (
        <div>
          {flags.showDemoMetrics ? (
            <>
              <HandoffAlert onResolve={() => toast.success('Handoff resolved, ASILIA is resuming the campaign.')} />
              <StatCards />
            </>
          ) : (
            <CampaignsEmptyState />
          )}
        </div>
      )}

      {/* Quick links */}
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
        <Link
          to="/app/projects"
          className="group bg-surface p-6 transition-colors hover:bg-panel"
        >
          <div className="flex items-center justify-between">
            <span className="lab-label">PROJECTS</span>
            <ArrowRight className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-1" />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <FolderKanban className="h-6 w-6 text-ink" strokeWidth={1.5} />
            <span className="font-display text-4xl font-bold text-ink">
              {projects?.length ?? '—'}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">Active projects</p>
        </Link>

        {selfServe ? (
          <Link
            to="/app/billing"
            className="group bg-surface p-6 transition-colors hover:bg-panel"
          >
            <div className="flex items-center justify-between">
              <span className="lab-label">SUBSCRIPTION</span>
              <ArrowRight className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-ink" strokeWidth={1.5} />
              <span className="font-display text-2xl font-bold capitalize text-ink">
                {sub?.plan_id ?? 'No plan'}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">Current subscription</p>
          </Link>
        ) : (
          <Link
            to={primaryAgreement ? `/app/escrow/${primaryAgreement.id}` : '/app/escrow'}
            className="group bg-surface p-6 transition-colors hover:bg-panel"
          >
            <div className="flex items-center justify-between">
              <span className="lab-label">ENGAGEMENT</span>
              <ArrowRight className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Landmark className="h-6 w-6 text-ink" strokeWidth={1.5} />
              <span className="font-display text-2xl font-bold capitalize text-ink">
                {primaryAgreement?.status ?? 'Not set up'}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">Pilot engagement</p>
          </Link>
        )}
      </div>
    </div>
  );
}
