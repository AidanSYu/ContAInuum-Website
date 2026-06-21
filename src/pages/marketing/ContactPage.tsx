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
    <div className="px-[5vw] pb-28 pt-32 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
        {/* Left — copy + details */}
        <div>
          <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-safety">Contact</p>
          <h1 className="mt-4 font-display text-5xl font-bold text-text-primary">
            Let’s talk.
          </h1>
          <p className="mt-5 max-w-md text-lg text-text-secondary">
            Whether you’re evaluating ATLAS for your team or need an Enterprise
            plan, tell us what you’re building and we’ll get back within two
            business days.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3 text-text-secondary">
              <Mail className="h-5 w-5 text-safety" />
              <a href="mailto:hello@containuum.io" className="hover:text-text-primary">
                hello@containuum.io
              </a>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <MapPin className="h-5 w-5 text-safety" />
              <span>Shanghai · San Francisco · Salt Lake City · Boston</span>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="name" className="mb-2 block text-text-secondary">Name</Label>
              <Input id="name" {...register('name')} aria-invalid={Boolean(errors.name)} />
              {errors.name && <p className="mt-1.5 text-xs text-safety">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block text-text-secondary">Email</Label>
              <Input id="email" type="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
              {errors.email && <p className="mt-1.5 text-xs text-safety">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="organization" className="mb-2 block text-text-secondary">Organization</Label>
              <Input id="organization" {...register('organization')} aria-invalid={Boolean(errors.organization)} />
              {errors.organization && <p className="mt-1.5 text-xs text-safety">{errors.organization.message}</p>}
            </div>
            <div>
              <Label htmlFor="message" className="mb-2 block text-text-secondary">Message</Label>
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
