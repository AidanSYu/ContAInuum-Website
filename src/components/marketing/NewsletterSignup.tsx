import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowRight, MailCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Turnstile } from '@/components/Turnstile';
import { subscribe } from '@/lib/api';
import { subscribeSchema } from '@/lib/validation';
import { cn } from '@/lib/utils';

const turnstileEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

/* =============================================================================
   NewsletterSignup, lightweight double-opt-in capture for visitors who aren't
   ready to start a trial. Wires the existing `subscribe()` API + newsletter
   Edge Function. `source` tags where the signup came from for attribution.
   ============================================================================= */

export function NewsletterSignup({ source = 'footer', className }: { source?: string; className?: string }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: () => subscribe({ email, source, turnstileToken: token }),
    onSuccess: () => {
      setDone(true);
      setEmail('');
      setToken('');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Could not subscribe. Please try again.');
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = subscribeSchema.safeParse({ email, source, turnstileToken: token });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Enter a valid email.');
      return;
    }
    if (turnstileEnabled && !token) {
      toast.error('Please complete the verification challenge.');
      return;
    }
    mutation.mutate();
  };

  if (done) {
    return (
      <div className={cn('flex items-start gap-2.5 text-sm text-ink-muted', className)}>
        <MailCheck className="mt-0.5 h-4 w-4 flex-none text-safety" strokeWidth={1.75} />
        <span>
          Almost there, check your inbox and click the link to confirm your subscription.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)} noValidate>
      <div className="flex gap-2">
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@lab.org"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 border-white/15 bg-white/[0.04] text-ink placeholder:text-white/50"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex h-11 flex-none items-center gap-1.5 rounded bg-ink px-4 text-sm font-medium text-paper transition-colors hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending ? 'Joining…' : (<>Join <ArrowRight className="h-4 w-4" /></>)}
        </button>
      </div>
      {turnstileEnabled && <Turnstile onToken={setToken} className="pt-3" />}
    </form>
  );
}
