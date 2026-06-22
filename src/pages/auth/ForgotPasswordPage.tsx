import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { MailCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validation';

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await requestPasswordReset(values.email);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send reset email.');
    }
  });

  if (sent) {
    return (
      <div className="border border-line bg-surface p-8 text-center shadow-lab">
        <MailCheck className="mx-auto h-10 w-10 text-safety" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">Check your email</h1>
        <p className="mt-2 text-sm text-ink-muted">
          If an account exists for that address, we’ve sent a link to reset your password.
        </p>
        <Button asChild className="mt-6 w-full bg-safety text-white hover:bg-safety/90">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-line bg-surface p-8 shadow-lab">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Reset your password</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Enter your email and we’ll send you a reset link.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="email" className="mb-2 block text-ink-muted">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="mt-1.5 text-xs text-safety">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-safety text-white hover:bg-safety/90">
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link to="/login" className="text-safety hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
