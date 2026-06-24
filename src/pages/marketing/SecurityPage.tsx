import { Lock, Database, KeyRound, Network, Eye, FileCheck } from 'lucide-react';
import { Seo } from '@/components/Seo';

/* =============================================================================
   SecurityPage — the trust posture a lab needs before it connects ATLAS to its
   instruments and data. Honest about what exists today vs. what is on the
   roadmap (the product is in private trial).
   ============================================================================= */

const PILLARS = [
  {
    icon: Database,
    title: 'Your data is yours',
    body: 'Lab content — campaigns, traces, results, and your knowledge graph — belongs to you. It is used to provide the Service to your account, never sold, and it exports with you if you leave. No lock-in.',
  },
  {
    icon: Lock,
    title: 'Encryption',
    body: 'Data is encrypted in transit (TLS) between your browser, our APIs, and our data stores. Secrets and payment details are held by specialized processors, not in application code.',
  },
  {
    icon: Network,
    title: 'Tenant isolation',
    body: 'Each customer’s data is isolated and access-scoped at the database layer with row-level security, so one tenant can never read another’s campaigns or graph.',
  },
  {
    icon: KeyRound,
    title: 'Authentication & access',
    body: 'Accounts are protected by modern auth with hardened password and session handling. SSO / SAML and role-based access are available on Institute deployments.',
  },
  {
    icon: Eye,
    title: 'Privacy-preserving learning',
    body: 'Cross-lab learning is opt-in. Where enabled, it uses aggregated or differentially private signals — one lab’s failure mode can warn another’s scientist without either seeing the other’s targets.',
  },
  {
    icon: FileCheck,
    title: 'Auditability',
    body: 'Every campaign keeps a full execution trace and lineage. Institute plans add an audit log of access and administrative actions for governance and review.',
  },
];

const PROCESSORS = [
  ['Supabase', 'Database, authentication, and edge functions'],
  ['Stripe', 'Payment processing and subscription billing'],
  ['Cloudflare', 'Bot mitigation (Turnstile) and edge delivery'],
];

export function SecurityPage() {
  return (
    <div className="px-[5vw] pb-28 pt-32 lg:px-8 lg:pt-40">
      <Seo
        title="Security & Trust — contAInuum"
        description="How contAInuum protects your lab data: encryption, tenant isolation, access controls, privacy-preserving learning, and auditability."
        path="/security"
      />

      <div className="mx-auto max-w-5xl">
        <div className="border-b border-line pb-8">
          <p className="lab-label text-safety">SECURITY &amp; TRUST</p>
          <h1 className="mt-4 font-display text-[clamp(34px,5vw,56px)] font-bold tracking-tight text-ink">
            Built to be trusted with your lab.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">
            ATLAS connects to the instruments and data that run your science. Here is how we protect
            them — and an honest account of where we are today.
          </p>
        </div>

        {/* pillars */}
        <div className="mt-12 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-surface p-7">
              <div className="flex h-10 w-10 items-center justify-center border border-line-hair text-safety">
                <p.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{p.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{p.body}</p>
            </div>
          ))}
        </div>

        {/* subprocessors */}
        <div className="mt-14">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Subprocessors</h2>
          <p className="mt-2 max-w-2xl text-ink-muted">
            We rely on a small set of vetted providers to operate the Service. Each processes data only
            to deliver their service to us, under contract.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
            {PROCESSORS.map(([name, role], i) => (
              <div
                key={name}
                className={`flex flex-wrap items-center justify-between gap-2 px-6 py-4 ${i ? 'border-t border-line' : ''}`}
              >
                <span className="font-display font-semibold text-ink">{name}</span>
                <span className="text-sm text-ink-muted">{role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* honest status */}
        <div className="mt-14 rounded-xl border border-line bg-panel p-7">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Where we are today</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
            contAInuum is in private trial. The protections above are in place now. Formal attestations
            (such as SOC 2) and a published Data Processing Addendum are on our roadmap as we move toward
            general availability. If your evaluation needs a specific control, certification, or
            contractual term, tell us — we would rather scope it with you than over-claim.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/contact?topic=security" className="inline-flex items-center justify-center gap-2 rounded bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:opacity-90">
              Request our security details
            </a>
            <a href="mailto:security@containuum.io" className="inline-flex items-center justify-center gap-2 rounded border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-hair">
              Report a vulnerability
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
