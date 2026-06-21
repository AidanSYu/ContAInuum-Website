import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validation';

/**
 * Reached from the password-reset email link. Supabase's detectSessionInUrl
 * establishes a short-lived recovery session; we confirm it exists, then let
 * the user set a new password.
 */
export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // The recovery link may still be exchanging tokens; wait for the event or
    // an existing session before deciding the link is invalid.
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      setValidSession(ok);
      setReady(true);
    };

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) finish(true);
    });

    const timer = setTimeout(() => finish(Boolean(false)), 2500);
    return () => {
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirm: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updatePassword(values.password);
      toast.success('Password updated. You’re signed in.');
      navigate('/app', { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update password.');
    }
  });

  if (!ready) {
    return (
      <div className="rounded-2xl border border-white/10 bg-void-lifted/40 p-8 text-center text-text-secondary backdrop-blur-xl">
        Verifying reset link…
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="rounded-2xl border border-white/10 bg-void-lifted/40 p-8 text-center backdrop-blur-xl">
        <h1 className="font-display text-2xl font-bold text-text-primary">Link expired</h1>
        <p className="mt-2 text-sm text-text-secondary">
          This password-reset link is invalid or has expired. Request a new one.
        </p>
        <Button asChild className="mt-6 w-full bg-safety text-white hover:bg-safety/90">
          <Link to="/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-void-lifted/40 p-8 backdrop-blur-xl">
      <h1 className="font-display text-2xl font-bold text-text-primary">Set a new password</h1>
      <p className="mt-1 text-sm text-text-secondary">Choose a strong password you don’t use elsewhere.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="password" className="mb-2 block text-text-secondary">New password</Label>
          <Input id="password" type="password" autoComplete="new-password" {...register('password')} aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="mt-1.5 text-xs text-safety">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirm" className="mb-2 block text-text-secondary">Confirm password</Label>
          <Input id="confirm" type="password" autoComplete="new-password" {...register('confirm')} aria-invalid={Boolean(errors.confirm)} />
          {errors.confirm && <p className="mt-1.5 text-xs text-safety">{errors.confirm.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-safety text-white hover:bg-safety/90">
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  );
}
