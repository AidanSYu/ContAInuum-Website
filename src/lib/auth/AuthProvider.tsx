import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AuthContext, type AuthContextValue } from './context';

const loadSupabaseClient = () => import('@/lib/supabase').then((module) => module.supabase);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    let idleHandle = 0;
    let timeoutHandle = 0;

    const initialize = () => {
      void loadSupabaseClient()
        .then((supabase) => {
          if (!active) return;

          void supabase.auth.getSession().then(({ data }) => {
            if (!active) return;
            setSession(data.session);
            setLoading(false);
          });

          const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
            setSession(next);
          });
          unsubscribe = () => sub.subscription.unsubscribe();
        })
        .catch(() => {
          if (active) setLoading(false);
        });
    };

    // Authenticated routes must resolve the session immediately. Public pages
    // can wait for the first idle slice, keeping the large auth SDK off the
    // hero's parse/paint path without changing signed-in header behavior once
    // the page settles.
    const authCritical = /^\/(?:app(?:\/|$)|login|signup|forgot-password|reset-password)/.test(
      window.location.pathname,
    );
    if (authCritical) {
      initialize();
    } else if (typeof window.requestIdleCallback === 'function') {
      idleHandle = window.requestIdleCallback(initialize, { timeout: 1_000 });
    } else {
      timeoutHandle = globalThis.setTimeout(initialize, 250);
    }

    return () => {
      active = false;
      if (idleHandle) window.cancelIdleCallback(idleHandle);
      if (timeoutHandle) globalThis.clearTimeout(timeoutHandle);
      unsubscribe?.();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      async signInWithPassword(email, password, captchaToken) {
        const supabase = await loadSupabaseClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
          ...(captchaToken ? { options: { captchaToken } } : {}),
        });
        if (error) throw error;
      },
      async signUp(email, password, fullName, captchaToken) {
        const supabase = await loadSupabaseClient();
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName ?? '' },
            ...(captchaToken ? { captchaToken } : {}),
          },
        });
        if (error) throw error;
      },
      async signOut() {
        const supabase = await loadSupabaseClient();
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
      async requestPasswordReset(email, captchaToken) {
        const supabase = await loadSupabaseClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
          ...(captchaToken ? { captchaToken } : {}),
        });
        if (error) throw error;
      },
      async updatePassword(newPassword) {
        const supabase = await loadSupabaseClient();
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
