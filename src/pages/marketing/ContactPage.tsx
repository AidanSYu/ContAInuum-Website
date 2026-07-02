import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/Turnstile';
import { submitContact } from '@/lib/api';
import { contactSchema, type ContactInput } from '@/lib/validation';
import { Seo } from '@/components/Seo';
import { ParticleField } from '@/components/motion';
import { Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { Beat } from '@/components/marketing/Beat';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';

const turnstileEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

/** Tailors the page copy + a starter message to where the visitor came from. */
const TOPICS: Record<string, { eyebrow: string; heading: string; blurb: string; starter: string }> = {
  partner: {
    eyebrow: 'Design partner program',
    heading: 'Apply for access.',
    blurb:
      'We onboard a small cohort of design-partner labs, chemistry, materials, and biology teams who run Atlas on their own instruments and shape the product with us. Tell us about your lab and we’ll be in touch within two business days.',
    starter:
      'Our lab works on … and we run the following instruments / ELN: …\nWe’d like to join the design-partner program because …\nTeam size: …',
  },
  demo: {
    eyebrow: 'Book a demo',
    heading: 'See Atlas on your bench.',
    blurb: 'Tell us about your lab and what you run, and we’ll set up a walkthrough on instruments like yours.',
    starter: 'I’d like a demo of Atlas. Our lab works on … and we run the following instruments / ELN: …',
  },
  enterprise: {
    eyebrow: 'Enterprise',
    heading: 'Let’s scope your deployment.',
    blurb: 'Multi-lab, governance, SSO, dedicated compute, tell us your requirements and we’ll scope a deployment.',
    starter: 'We’re interested in an enterprise deployment. We have … labs / sites and need …',
  },
  security: {
    eyebrow: 'Security',
    heading: 'Security & compliance questions.',
    blurb: 'Ask for our security details, or share the controls and terms your evaluation needs.',
    starter: 'For our security review we need details on … (e.g. data residency, DPA, SSO, audit logs).',
  },
  general: {
    eyebrow: 'Contact',
    heading: 'Let’s talk.',
    blurb: 'Whether you’re evaluating Atlas for your team or need an enterprise deployment, tell us what you’re building and we’ll get back within two business days.',
    starter: '',
  },
};

export function ContactPage() {
  const [params] = useSearchParams();
  const topicKey = params.get('topic') ?? 'general';
  const topic = TOPICS[topicKey] ?? TOPICS.general;
  const [turnstileToken, setTurnstileToken] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', organization: '', message: topic.starter, company_website: '' },
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
    mutation.mutate({ ...values, topic: topicKey, turnstileToken });
  });

  const fieldClass = 'border-white/15 bg-white/[0.03] text-ink placeholder:text-ink-faint';

  return (
    <DarkPageShell>
      <Seo
        title="Contact, Contineon"
        description="Talk to the Contineon team about retrofitting your lab with Atlas. Book a demo or ask about an enterprise deployment."
        path="/contact"
      />

      {/* Hero */}
      <Beat
        minH="min-h-[56svh]"
        align="end"
        intro
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <ParticleField className="pointer-events-none absolute inset-0 z-[1]" />
            <GridField className="opacity-[0.4]" />
          </>
        }
      >
        <div className="max-w-3xl pb-6">
          <p data-beat-fade>
            <Kicker>{topic.eyebrow}</Kicker>
          </p>
          <h1
            data-beat-title
            className="type-hero mt-5"
          >
            {topic.heading}
          </h1>
          <p data-beat-fade className="type-lede mt-7 max-w-2xl text-white/75">
            {topic.blurb}
          </p>
        </div>
      </Beat>

      {/* Details + form */}
      <section className="relative border-t border-white/10">
        <GridField className="opacity-[0.12]" />
        <div className="relative z-10 mx-auto grid max-w-6xl px-[5vw] py-[clamp(48px,7vw,104px)] lg:grid-cols-2 lg:px-8 xl:px-16">
          {/* Details */}
          <div className="lg:border-r lg:border-white/10 lg:pr-16">
            <Kicker>Reach us</Kicker>
            <dl className="mt-8 border-t border-white/10">
              <div className="flex items-center gap-3 border-b border-white/10 py-5 text-ink-muted">
                <Mail className="h-5 w-5 text-safety" strokeWidth={1.5} />
                <a href="mailto:hello@contineon.io" className="transition-colors hover:text-ink">
                  hello@contineon.io
                </a>
              </div>
              <div className="flex items-center gap-3 py-5 text-ink-muted">
                <MapPin className="h-5 w-5 text-safety" strokeWidth={1.5} />
                <span className="text-sm">Shanghai · San Francisco · Salt Lake City · Boston</span>
              </div>
            </dl>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink-muted">
              We read every message. Expect a reply within two business days.
            </p>
          </div>

          {/* Form */}
          <div className="pt-12 lg:pl-16 lg:pt-0">
            <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
              <div>
                <Label htmlFor="name" className="mb-2 block text-ink-muted">Name</Label>
                <Input id="name" className={fieldClass} {...register('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
                {errors.name && <p id="name-error" role="alert" className="mt-1.5 text-xs text-safety">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="mb-2 block text-ink-muted">Email</Label>
                <Input id="email" type="email" className={fieldClass} {...register('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <p id="email-error" role="alert" className="mt-1.5 text-xs text-safety">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="organization" className="mb-2 block text-ink-muted">Organization</Label>
                <Input id="organization" className={fieldClass} {...register('organization')} aria-invalid={Boolean(errors.organization)} aria-describedby={errors.organization ? 'organization-error' : undefined} />
                {errors.organization && <p id="organization-error" role="alert" className="mt-1.5 text-xs text-safety">{errors.organization.message}</p>}
              </div>
              <div>
                <Label htmlFor="message" className="mb-2 block text-ink-muted">Message</Label>
                <Textarea id="message" className={`min-h-[120px] ${fieldClass}`} {...register('message')} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />
                {errors.message && <p id="message-error" role="alert" className="mt-1.5 text-xs text-safety">{errors.message.message}</p>}
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
      </section>
    </DarkPageShell>
  );
}
