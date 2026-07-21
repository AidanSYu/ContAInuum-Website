import { Suspense, lazy, useEffect, useState } from 'react';

const Toaster = lazy(() =>
  import('@/components/ui/sonner').then((module) => ({ default: module.Toaster })),
);

/** Mount the toast viewport after first paint; interactive routes still load it
 * well before a user can submit a form, while the home hero avoids its parse
 * and initialization cost. */
export function DeferredToaster() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleHandle = 0;
    let timeoutHandle = 0;
    const mount = () => setReady(true);
    if (typeof window.requestIdleCallback === 'function') {
      idleHandle = window.requestIdleCallback(mount, { timeout: 1_000 });
    } else {
      timeoutHandle = globalThis.setTimeout(mount, 250);
    }
    return () => {
      if (idleHandle) window.cancelIdleCallback(idleHandle);
      if (timeoutHandle) globalThis.clearTimeout(timeoutHandle);
    };
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <Toaster richColors position="top-center" />
    </Suspense>
  );
}

