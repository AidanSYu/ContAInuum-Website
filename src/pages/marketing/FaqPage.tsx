import { ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { Beat } from '@/components/marketing/Beat';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';

/* =============================================================================
   FaqPage, objection handling for evaluating labs. Grouped by the questions a
   lab director actually asks before adopting Atlas: what it is, how it connects,
   what happens to their data, and how to get started with the open-source stack.
   ============================================================================= */

type QA = { q: string; a: string };
type Group = { group: string; items: QA[] };

const GROUPS: Group[] = [
  {
    group: 'Product',
    items: [
      {
        q: 'What exactly is Atlas?',
        a: 'Atlas is an autonomous agent for the lab. It plans a campaign toward an objective you set, executes the steps it can, and pauses to hand off the steps that still need a human. Every campaign it touches feeds a memory that makes the next one start smarter.',
      },
      {
        q: 'Do I need to buy new instruments or rebuild my lab?',
        a: 'No. Contineon is a retrofit, not a rip-and-replace. Atlas runs on the instruments, ELN, and data you already have. The whole premise is that you keep your workcell and add a memory and an autonomy layer on top of it.',
      },
      {
        q: 'What happens when a step needs a human?',
        a: 'Atlas pauses the campaign and notifies a scientist, like a job awaiting approval. You return a result (a TLC photo, a CSV, a note) and the run resumes from exactly where it stopped. Correct a tool call once and that correction becomes training signal.',
      },
    ],
  },
  {
    group: 'Integration & setup',
    items: [
      {
        q: 'Which instruments and systems integrate?',
        a: 'Atlas connects over open integrations to the systems labs already run, liquid handlers, plate readers, analytical instruments (e.g. LC/MS), and electronic lab notebooks. As a rule of thumb: if a step can be scripted or its output can be exported, Atlas can read it. Tell us your stack and we will confirm specifics.',
      },
      {
        q: 'How long does setup take?',
        a: 'Connecting your workcell is an afternoon, not a quarter. You point Atlas at your instruments and data, define an objective, and run your first campaign the same day.',
      },
      {
        q: 'Is Contineon cloud or on-premises?',
        a: 'Atlas runs on managed, secure cloud infrastructure. Dedicated or VPC arrangements with governance controls are available for larger deployments, talk to us about your requirements.',
      },
    ],
  },
  {
    group: 'Data & security',
    items: [
      {
        q: 'Is my data private? Do you train shared models on it?',
        a: 'Your lab content is yours. By default it is used only to provide the Service to your account. Cross-lab learning, where offered, is opt-in and privacy-preserving, aggregated or differentially private, and never exposes one customer’s data to another.',
      },
      {
        q: 'Can I export my data if I leave?',
        a: 'Yes. Your knowledge graph and run history export with you. There is no lock-in, that is a deliberate design choice, not a favor.',
      },
      {
        q: 'How do you secure my data?',
        a: 'Encryption in transit, access controls, and tenant isolation, with SSO/SAML and audit logging available for larger deployments. See the Security page for the full picture.',
      },
    ],
  },
  {
    group: 'Getting started',
    items: [
      {
        q: 'How do I get Atlas?',
        a: 'Atlas is open source. There is no waitlist and no access request, install it from the docs, point it at the instruments you already run, and start your first campaign. The quickstart walks you through setup end to end.',
      },
      {
        q: 'Is there a demo?',
        a: 'An interactive demo is on the way. In the meantime, book a live walkthrough and we will run Atlas against a campaign close to your own.',
      },
      {
        q: 'What support do I get?',
        a: 'Atlas is built in the open, so the docs and issue tracker are the fastest path for most questions. Teams that need hands-on onboarding, governance, or response-time guarantees can talk to us about a supported deployment.',
      },
    ],
  },
];

export function FaqPage() {
  return (
    <DarkPageShell>
      <Seo
        title="FAQ, Contineon"
        description="Answers to common questions about Atlas: instruments and integrations, data privacy and security, setup time, and how to get started with the open-source stack."
        path="/faq"
      />

      {/* Hero */}
      <Beat
        minH="min-h-[56svh]"
        align="end"
        intro
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <GridField className="opacity-[0.4]" />
          </>
        }
      >
        <div className="max-w-3xl pb-6">
          <p data-beat-fade>
            <Kicker>FAQ</Kicker>
          </p>
          <h1
            data-beat-title
            className="mt-5 type-hero"
          >
            Questions, answered.
          </h1>
          <p data-beat-fade className="mt-7 max-w-2xl type-lede text-white/75">
            What labs ask before they retrofit. Can’t find it here?{' '}
            <a href="/contact" className="text-safety underline-offset-4 hover:underline">
              Ask us directly.
            </a>
          </p>
        </div>
      </Beat>

      {/* Groups */}
      <section className="relative border-t border-white/10">
        <GridField className="opacity-[0.12]" />
        <div className="relative z-10 mx-auto max-w-3xl px-[5vw] py-[clamp(48px,7vw,104px)] lg:px-8">
          <div className="space-y-16">
            {GROUPS.map((g) => (
              <Reveal key={g.group}>
                <Kicker>{g.group}</Kicker>
                <div className="mt-4 border-t border-white/10">
                  <Accordion type="single" collapsible className="w-full">
                    {g.items.map((item) => (
                      <AccordionItem key={item.q} value={item.q} className="border-white/10">
                        <AccordionTrigger className="text-left font-display text-base font-semibold text-ink hover:text-safety hover:no-underline">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed text-ink-muted">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="relative border-t border-white/10">
        <div className="relative z-10 mx-auto max-w-3xl px-[5vw] py-[clamp(40px,5vw,72px)] lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-md type-h3 text-ink">
              Ready to see it on your bench?
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Cta to="/docs" variant="accent">
                Get started <ArrowRight className="h-4 w-4" />
              </Cta>
              <Cta to="/contact?topic=demo" variant="outlineLight">
                Book a demo
              </Cta>
            </div>
          </div>
        </div>
      </section>
    </DarkPageShell>
  );
}
