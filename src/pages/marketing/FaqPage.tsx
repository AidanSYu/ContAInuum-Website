import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Seo } from '@/components/Seo';

/* =============================================================================
   FaqPage — objection handling for evaluating labs. Grouped by the questions a
   lab director actually asks before a trial: what it is, how it connects, what
   happens to their data, and how the trial/billing works.
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
        a: 'Atlas pauses the campaign and notifies a scientist — like a job awaiting approval. You return a result (a TLC photo, a CSV, a note) and the run resumes from exactly where it stopped. Correct a tool call once and that correction becomes training signal.',
      },
    ],
  },
  {
    group: 'Integration & setup',
    items: [
      {
        q: 'Which instruments and systems integrate?',
        a: 'Atlas connects over open integrations to the systems labs already run — liquid handlers, plate readers, analytical instruments (e.g. LC/MS), and electronic lab notebooks. As a rule of thumb: if a step can be scripted or its output can be exported, Atlas can read it. Tell us your stack and we will confirm specifics.',
      },
      {
        q: 'How long does setup take?',
        a: 'Connecting your workcell is an afternoon, not a quarter. You point Atlas at your instruments and data, define an objective, and run your first campaign the same day.',
      },
      {
        q: 'Is Contineon cloud or on-premises?',
        a: 'Atlas runs on managed, secure cloud infrastructure. Dedicated or VPC arrangements with governance controls are available for larger deployments — talk to us about your requirements.',
      },
    ],
  },
  {
    group: 'Data & security',
    items: [
      {
        q: 'Is my data private? Do you train shared models on it?',
        a: 'Your lab content is yours. By default it is used only to provide the Service to your account. Cross-lab learning, where offered, is opt-in and privacy-preserving — aggregated or differentially private — and never exposes one customer’s data to another.',
      },
      {
        q: 'Can I export my data if I leave?',
        a: 'Yes. Your knowledge graph and run history export with you. There is no lock-in — that is a deliberate design choice, not a favor.',
      },
      {
        q: 'How do you secure my data?',
        a: 'Encryption in transit, access controls, and tenant isolation, with SSO/SAML and audit logging available for larger deployments. See the Security page for the full picture.',
      },
    ],
  },
  {
    group: 'Access & onboarding',
    items: [
      {
        q: 'How do I get access?',
        a: 'We onboard a small cohort of design-partner labs at a time. Request access and we will scope an early-partner pilot for your lab on the instruments you already run — no rip-and-replace.',
      },
      {
        q: 'Is there a demo?',
        a: 'An interactive demo is on the way. In the meantime, book a live walkthrough and we will run Atlas against a campaign close to your own.',
      },
      {
        q: 'What support do I get?',
        a: 'Design partners work directly with the team building Atlas, with response times scoped to your pilot.',
      },
    ],
  },
];

export function FaqPage() {
  return (
    <div className="px-[5vw] pb-28 pt-32 lg:px-8 lg:pt-40">
      <Seo
        title="FAQ — Contineon"
        description="Answers to common questions about Atlas: instruments and integrations, data privacy and security, setup time, and how to get access."
        path="/faq"
      />

      <div className="mx-auto max-w-3xl">
        <div className="border-b border-line pb-8">
          <p className="lab-label text-safety">FAQ</p>
          <h1 className="mt-4 font-display text-[clamp(34px,5vw,56px)] font-bold tracking-tight text-ink">
            Questions, answered.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-muted">
            What labs ask before they retrofit. Can’t find it here?{' '}
            <a href="/contact" className="text-safety hover:underline">Ask us directly.</a>
          </p>
        </div>

        <div className="mt-10 space-y-12">
          {GROUPS.map((g) => (
            <div key={g.group}>
              <h2 className="lab-label mb-2 text-ink-faint">{g.group}</h2>
              <Accordion type="single" collapsible className="w-full">
                {g.items.map((item) => (
                  <AccordionItem key={item.q} value={item.q} className="border-line">
                    <AccordionTrigger className="text-left font-display text-base font-semibold text-ink hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-ink-muted">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* soft CTA */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <p className="font-display text-lg font-semibold text-ink">Ready to see it on your bench?</p>
          <div className="flex gap-3">
            <a href="/contact?topic=partner" className="inline-flex items-center justify-center gap-2 rounded bg-safety px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-safety/90">
              Request access
            </a>
            <a href="/contact?topic=demo" className="inline-flex items-center justify-center gap-2 rounded border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-hair">
              Book a demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
