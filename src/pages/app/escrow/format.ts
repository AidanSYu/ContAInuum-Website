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
