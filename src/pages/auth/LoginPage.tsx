import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { loginSchema, type LoginInput } from '@/lib/validation';

export function LoginPage() {
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/app';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signInWithPassword(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not sign in.');
    }
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-void-lifted/40 p-8 backdrop-blur-xl">
      <h1 className="font-display text-2xl font-bold text-text-primary">Welcome back</h1>
      <p className="mt-1 text-sm text-text-secondary">Sign in to your contAInuum account.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="email" className="mb-2 block text-text-secondary">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="mt-1.5 text-xs text-safety">{errors.email.message}</p>}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="password" className="text-text-secondary">Password</Label>
            <Link to="/forgot-password" className="text-xs text-text-secondary hover:text-text-primary">
              Forgot?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="mt-1.5 text-xs text-safety">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full bg-safety text-white hover:bg-safety/90">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-safety hover:underline">Start free trial</Link>
      </p>
    </div>
  );
}
