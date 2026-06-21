import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile widget. Renders a privacy-friendly captcha and hands the
 * resulting token to `onToken`. If no site key is configured (e.g. local dev),
 * it renders nothing and emits a sentinel token so forms remain usable.
 */

type TurnstileAPI = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.turnstile) return resolve();
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-turnstile', '');
    script.addEventListener('load', () => resolve(), { once: true });
    document.head.appendChild(script);
  });
}

export function Turnstile({
  onToken,
  className,
}: {
  onToken: (token: string) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep the latest callback without re-running the render effect on every change.
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!SITE_KEY) {
      onTokenRef.current('dev-no-turnstile');
      return;
    }

    let widgetId: string | undefined;
    let cancelled = false;

    void loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: 'dark',
        callback: (token: string) => onTokenRef.current(token),
        'error-callback': () => onTokenRef.current(''),
        'expired-callback': () => onTokenRef.current(''),
      });
    });

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className={className} />;
}
