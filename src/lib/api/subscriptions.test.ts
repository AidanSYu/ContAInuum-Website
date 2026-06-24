import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hasAccess, trialDaysLeft, type Subscription } from './subscriptions';

/** Build a full subscription row; override only what a test cares about. */
function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 'sub-row-1',
    user_id: 'user-1',
    plan_id: 'pro',
    stripe_subscription_id: 'sub_123',
    stripe_customer_id: 'cus_123',
    status: 'active',
    current_period_end: null,
    trial_end: null,
    cancel_at_period_end: false,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  } as Subscription;
}

describe('hasAccess', () => {
  it('denies when there is no subscription', () => {
    expect(hasAccess(null)).toBe(false);
  });

  it.each(['trialing', 'active', 'past_due'] as const)('grants access for status "%s"', (status) => {
    expect(hasAccess(makeSub({ status }))).toBe(true);
  });

  it.each(['canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused'] as const)(
    'denies access for status "%s"',
    (status) => {
      expect(hasAccess(makeSub({ status }))).toBe(false);
    },
  );

  it('still grants access to a sub set to cancel at period end (until it actually ends)', () => {
    expect(hasAccess(makeSub({ status: 'active', cancel_at_period_end: true }))).toBe(true);
  });
});

describe('trialDaysLeft', () => {
  const NOW = new Date('2026-06-22T12:00:00.000Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 for no subscription', () => {
    expect(trialDaysLeft(null)).toBe(0);
  });

  it('returns 0 when not trialing', () => {
    const future = new Date(NOW.getTime() + 5 * 86_400_000).toISOString();
    expect(trialDaysLeft(makeSub({ status: 'active', trial_end: future }))).toBe(0);
  });

  it('returns 0 when trialing but trial_end is missing', () => {
    expect(trialDaysLeft(makeSub({ status: 'trialing', trial_end: null }))).toBe(0);
  });

  it('rounds remaining days up while trialing', () => {
    const end = new Date(NOW.getTime() + 3.2 * 86_400_000).toISOString();
    expect(trialDaysLeft(makeSub({ status: 'trialing', trial_end: end }))).toBe(4);
  });

  it('never returns a negative number for an expired trial', () => {
    const past = new Date(NOW.getTime() - 2 * 86_400_000).toISOString();
    expect(trialDaysLeft(makeSub({ status: 'trialing', trial_end: past }))).toBe(0);
  });
});
