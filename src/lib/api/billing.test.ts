import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Created via vi.hoisted so the (hoisted) vi.mock factory can safely close over them.
const { FUNCTIONS_URL, getSession } = vi.hoisted(() => ({
  FUNCTIONS_URL: 'https://proj.functions.supabase.co/functions/v1',
  getSession: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  FUNCTIONS_URL,
  isBackendConfigured: true,
  supabase: { auth: { getSession } },
}));

import { startCheckout, openBillingPortal } from '@/lib/api/billing';

function stubFetch(response: Partial<Response> & { json: () => Promise<unknown> }) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const signedIn = () => getSession.mockResolvedValue({ data: { session: { access_token: 'tok-abc' } } });

beforeEach(() => {
  getSession.mockReset();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('startCheckout', () => {
  it('posts the plan id with the bearer token and returns the checkout url', async () => {
    signedIn();
    const fetchMock = stubFetch({ ok: true, json: async () => ({ url: 'https://checkout.stripe.com/c/sess_1' }) });

    const url = await startCheckout('pro');

    expect(url).toBe('https://checkout.stripe.com/c/sess_1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${FUNCTIONS_URL}/create-checkout-session`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer tok-abc',
        }),
        body: JSON.stringify({ plan_id: 'pro' }),
      }),
    );
  });

  it('throws and never calls the network when there is no session', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const fetchMock = stubFetch({ ok: true, json: async () => ({ url: 'x' }) });

    await expect(startCheckout('pro')).rejects.toThrow('You must be signed in to do that.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('surfaces the server error message on a non-ok response', async () => {
    signedIn();
    stubFetch({ ok: false, json: async () => ({ error: 'Unknown plan' }) });

    await expect(startCheckout('bogus')).rejects.toThrow('Unknown plan');
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    signedIn();
    stubFetch({
      ok: false,
      json: async () => {
        throw new Error('not json');
      },
    });

    await expect(startCheckout('pro')).rejects.toThrow('Something went wrong. Please try again.');
  });
});

describe('openBillingPortal', () => {
  it('posts an empty body and returns the portal url', async () => {
    signedIn();
    const fetchMock = stubFetch({ ok: true, json: async () => ({ url: 'https://billing.stripe.com/p/sess_2' }) });

    const url = await openBillingPortal();

    expect(url).toBe('https://billing.stripe.com/p/sess_2');
    expect(fetchMock).toHaveBeenCalledWith(
      `${FUNCTIONS_URL}/create-portal-session`,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({}) }),
    );
  });
});

describe('when the backend is not configured', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/supabase');
    vi.resetModules();
  });

  it('refuses before touching the network', async () => {
    vi.resetModules();
    vi.doMock('@/lib/supabase', () => ({
      FUNCTIONS_URL: '',
      isBackendConfigured: false,
      supabase: { auth: { getSession } },
    }));
    const fetchMock = stubFetch({ ok: true, json: async () => ({ url: 'x' }) });

    const mod = await import('@/lib/api/billing');
    await expect(mod.startCheckout('pro')).rejects.toThrow('Backend is not configured');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
