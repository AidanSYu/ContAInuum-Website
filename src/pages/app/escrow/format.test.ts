import { describe, it, expect } from 'vitest';
import {
  formatMoney,
  milestoneProgress,
  engagementStatusCopy,
  agreementBadgeVariant,
  milestoneBadgeVariant,
} from './format';

describe('formatMoney', () => {
  it('formats integer cents as USD', () => {
    expect(formatMoney(125000, 'usd')).toBe('$1,250.00');
  });

  it('defaults to USD when no currency is given', () => {
    expect(formatMoney(5900)).toBe('$59.00');
  });

  it('falls back gracefully on a malformed currency code', () => {
    // 'xx' is not a valid ISO 4217 code → Intl throws → the catch branch runs.
    expect(formatMoney(1000, 'xx')).toBe('10.00 XX');
  });
});

describe('milestoneProgress', () => {
  it('counts released and refunded milestones as settled', () => {
    expect(
      milestoneProgress([
        { status: 'released' },
        { status: 'refunded' },
        { status: 'funded' },
        { status: 'pending' },
      ]),
    ).toEqual({ done: 2, total: 4 });
  });

  it('is 0 of 0 for an empty engagement', () => {
    expect(milestoneProgress([])).toEqual({ done: 0, total: 0 });
  });

  it('does not count pending/funded as settled', () => {
    expect(milestoneProgress([{ status: 'pending' }, { status: 'funded' }])).toEqual({
      done: 0,
      total: 2,
    });
  });
});

describe('engagementStatusCopy', () => {
  it.each(['draft', 'pending', 'funded', 'completed', 'canceled'] as const)(
    'returns non-empty next-action copy for "%s"',
    (status) => {
      expect(engagementStatusCopy(status).length).toBeGreaterThan(0);
    },
  );

  it('prompts funding for a pending engagement', () => {
    expect(engagementStatusCopy('pending').toLowerCase()).toContain('fund');
  });
});

describe('badge variants', () => {
  it('maps agreement statuses to badge tones', () => {
    expect(agreementBadgeVariant('funded')).toBe('default');
    expect(agreementBadgeVariant('completed')).toBe('default');
    expect(agreementBadgeVariant('canceled')).toBe('destructive');
    expect(agreementBadgeVariant('draft')).toBe('outline');
    expect(agreementBadgeVariant('pending')).toBe('secondary');
  });

  it('maps milestone statuses to badge tones', () => {
    expect(milestoneBadgeVariant('released')).toBe('default');
    expect(milestoneBadgeVariant('refunded')).toBe('destructive');
    expect(milestoneBadgeVariant('funded')).toBe('secondary');
    expect(milestoneBadgeVariant('pending')).toBe('outline');
  });
});
