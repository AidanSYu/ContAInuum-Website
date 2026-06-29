/**
 * Shared formatting + status presentation helpers for the escrow UI. Kept local
 * to the escrow pages so it can evolve with the UI without touching the api/types
 * slice. Status enums mirror the escrow_agreements / escrow_milestones tables.
 */
import type { EscrowAgreement, EscrowMilestone } from '@/lib/api';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/** Format integer cents in the agreement's currency (e.g. 125000 -> "$1,250.00"). */
export function formatMoney(cents: number, currency = 'usd'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    // Fall back gracefully on an unknown ISO currency code.
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

const AGREEMENT_BADGE: Record<EscrowAgreement['status'], BadgeVariant> = {
  draft: 'outline',
  pending: 'secondary',
  funded: 'default',
  completed: 'default',
  canceled: 'destructive',
};

const MILESTONE_BADGE: Record<EscrowMilestone['status'], BadgeVariant> = {
  pending: 'outline',
  funded: 'secondary',
  released: 'default',
  refunded: 'destructive',
};

export function agreementBadgeVariant(status: EscrowAgreement['status']): BadgeVariant {
  return AGREEMENT_BADGE[status];
}

export function milestoneBadgeVariant(status: EscrowMilestone['status']): BadgeVariant {
  return MILESTONE_BADGE[status];
}

/** Settled (released or refunded) milestones out of the total — for a progress read. */
export function milestoneProgress(
  milestones: Pick<EscrowMilestone, 'status'>[],
): { done: number; total: number } {
  const total = milestones.length;
  const done = milestones.filter((m) => m.status === 'released' || m.status === 'refunded').length;
  return { done, total };
}

/** Customer-facing next-action copy for an engagement, keyed by agreement status. */
export function engagementStatusCopy(status: EscrowAgreement['status']): string {
  switch (status) {
    case 'draft':
      return 'We’re still scoping this engagement with you — no action needed yet.';
    case 'pending':
      return 'Your engagement is ready to fund. Funding locks in your milestones and starts the work.';
    case 'funded':
      return 'Work is underway. We’ll mark each milestone here as it’s completed.';
    case 'completed':
      return 'All milestones are settled. Thank you for being a design partner.';
    case 'canceled':
      return 'This engagement was canceled. Reach out if you’d like to restart it.';
  }
}
