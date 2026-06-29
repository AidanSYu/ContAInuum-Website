import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  hasAccess,
  trialDaysLeft,
  pastDueGraceDaysLeft,
  PAST_DUE_GRACE_DAYS,
  type Subscription,
} from './subscriptions';

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
    past_due_since: null,
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

describe('hasAccess — bounded past_due grace window', () => {
  const NOW = new Date('2026-06-22T12:00:00.000Z');
  const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('grants access while inside the window (entered past_due 3 days ago)', () => {
    expect(hasAccess(makeSub({ status: 'past_due', past_due_since: daysAgo(3) }))).toBe(true);
  });

  it(`denies access once the ${PAST_DUE_GRACE_DAYS}-day window has closed`, () => {
    expect(hasAccess(makeSub({ status: 'past_due', past_due_since: daysAgo(PAST_DUE_GRACE_DAYS + 1) }))).toBe(false);
  });

  it('falls back to current_period_end when past_due_since is missing', () => {
    expect(
      hasAccess(makeSub({ status: 'past_due', past_due_since: null, current_period_end: daysAgo(2) })),
    ).toBe(true);
    expect(
      hasAccess(makeSub({ status: 'past_due', past_due_since: null, current_period_end: daysAgo(10) })),
    ).toBe(false);
  });

  it('prefers past_due_since over current_period_end', () => {
    // Recently renewed period, but went past_due long ago → denied.
    expect(
      hasAccess(makeSub({ status: 'past_due', past_due_since: daysAgo(9), current_period_end: daysAgo(1) })),
    ).toBe(false);
  });

  it('stays unbounded (grants access) when neither timestamp is known', () => {
    expect(
      hasAccess(makeSub({ status: 'past_due', past_due_since: null, current_period_end: null })),
    ).toBe(true);
  });
});

describe('pastDueGraceDaysLeft', () => {
  const NOW = new Date('2026-06-22T12:00:00.000Z');
  const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 for no subscription', () => {
    expect(pastDueGraceDaysLeft(null)).toBe(0);
  });

  it('returns 0 when not past_due', () => {
    expect(pastDueGraceDaysLeft(makeSub({ status: 'active' }))).toBe(0);
  });

  it('counts whole days remaining from past_due_since', () => {
    // Entered past_due 2 days ago → 5 days left of a 7-day window.
    expect(pastDueGraceDaysLeft(makeSub({ status: 'past_due', past_due_since: daysAgo(2) }))).toBe(
      PAST_DUE_GRACE_DAYS - 2,
    );
  });

  it('returns 0 once the window has closed', () => {
    expect(pastDueGraceDaysLeft(makeSub({ status: 'past_due', past_due_since: daysAgo(9) }))).toBe(0);
  });

  it('returns null when the window is unbounded (no timestamps)', () => {
    expect(
      pastDueGraceDaysLeft(makeSub({ status: 'past_due', past_due_since: null, current_period_end: null })),
    ).toBe(null);
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
