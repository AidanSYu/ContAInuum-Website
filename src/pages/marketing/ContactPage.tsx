import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/Turnstile';
import { submitContact } from '@/lib/api';
import { contactSchema, type ContactInput } from '@/lib/validation';

const turnstileEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

export function ContactPage() {
  const [turnstileToken, setTurnstileToken] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', organization: '', message: '', company_website: '' },
  });

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      toast.success('Message sent. We’ll respond within two business days.');
      reset();
      setTurnstileToken('');
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Something went wrong.');
    },
  });

  const onSubmit = handleSubmit((values) => {
    if (turnstileEnabled && !turnstileToken) {
      toast.error('Please complete the verification challenge.');
      return;
    }
    mutation.mutate({ ...values, turnstileToken });
  });

  return (
    <div className="px-[5vw] pb-28 pt-32 lg:px-8 lg:pt-40">
      <div className="mx-auto grid max-w-6xl border border-line bg-surface shadow-lab lg:grid-cols-2">
        {/* Left — copy + details */}
        <div className="border-b border-line p-8 sm:p-12 lg:border-b-0 lg:border-r">
          <p className="lab-label text-safety">CONTACT</p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink">
            Let’s talk.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-muted">
            Whether you’re evaluating ATLAS for your team or need an Enterprise
            plan, tell us what you’re building and we’ll get back within two
            business days.
          </p>

          <div className="mt-10 space-y-px border-t border-line">
            <div className="flex items-center gap-3 border-b border-line py-4 text-ink-muted">
              <Mail className="h-5 w-5 text-safety" strokeWidth={1.5} />
              <a href="mailto:hello@containuum.io" className="hover:text-ink">
                hello@containuum.io
              </a>
            </div>
            <div className="flex items-center gap-3 py-4 text-ink-muted">
              <MapPin className="h-5 w-5 text-safety" strokeWidth={1.5} />
              <span className="text-sm">Shanghai · San Francisco · Salt Lake City · Boston</span>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="p-8 sm:p-12">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="name" className="mb-2 block text-ink-muted">Name</Label>
              <Input id="name" {...register('name')} aria-invalid={Boolean(errors.name)} />
              {errors.name && <p className="mt-1.5 text-xs text-safety">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block text-ink-muted">Email</Label>
              <Input id="email" type="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
              {errors.email && <p className="mt-1.5 text-xs text-safety">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="organization" className="mb-2 block text-ink-muted">Organization</Label>
              <Input id="organization" {...register('organization')} aria-invalid={Boolean(errors.organization)} />
              {errors.organization && <p className="mt-1.5 text-xs text-safety">{errors.organization.message}</p>}
            </div>
            <div>
              <Label htmlFor="message" className="mb-2 block text-ink-muted">Message</Label>
              <Textarea id="message" {...register('message')} className="min-h-[120px]" aria-invalid={Boolean(errors.message)} />
              {errors.message && <p className="mt-1.5 text-xs text-safety">{errors.message.message}</p>}
            </div>

            {/* Honeypot */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="company_website">Company website</label>
              <input id="company_website" type="text" tabIndex={-1} autoComplete="off" {...register('company_website')} />
            </div>

            {turnstileEnabled && <Turnstile onToken={setTurnstileToken} className="pt-1" />}

            <Button type="submit" disabled={mutation.isPending} className="w-full bg-safety text-white hover:bg-safety/90">
              {mutation.isPending ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
