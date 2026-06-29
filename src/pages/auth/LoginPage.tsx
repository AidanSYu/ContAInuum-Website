import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/Turnstile';
import { useAuth } from '@/lib/auth';
import { loginSchema, type LoginInput } from '@/lib/validation';

const turnstileEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

export function LoginPage() {
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/app';
  const [captchaToken, setCaptchaToken] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (turnstileEnabled && !captchaToken) {
      toast.error('Please complete the verification challenge.');
      return;
    }
    try {
      await (captchaToken
        ? signInWithPassword(values.email, values.password, captchaToken)
        : signInWithPassword(values.email, values.password));
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not sign in.');
    }
  });

  return (
    <div className="border border-line bg-surface p-8 shadow-lab">
      <h1 className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-muted">Sign in to your contAInuum account.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="email" className="mb-2 block text-ink-muted">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="mt-1.5 text-xs text-safety">{errors.email.message}</p>}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="password" className="text-ink-muted">Password</Label>
            <Link to="/forgot-password" className="text-xs text-ink-muted hover:text-ink">
              Forgot?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="mt-1.5 text-xs text-safety">{errors.password.message}</p>}
        </div>

        {turnstileEnabled && <Turnstile onToken={setCaptchaToken} className="pt-1" />}

        <Button type="submit" disabled={isSubmitting} className="w-full bg-safety text-white hover:bg-safety/90">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-safety hover:underline">Start free trial</Link>
      </p>
    </div>
  );
}
