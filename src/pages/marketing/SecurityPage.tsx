import { ArrowRight, Lock, Database, KeyRound, Network, Eye, FileCheck } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Magnetic, ParticleField } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { Beat } from '@/components/marketing/Beat';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';

/* =============================================================================
   SecurityPage, the trust posture a lab needs before it connects Atlas to its
   instruments and data. Honest about what exists today vs. what is on the
   roadmap (Atlas is open source and under active development). Cinematic obsidian:
   a compact GridField hero, then a hairline spec list, mono readout rows, and one call.
   ============================================================================= */

const PILLARS = [
  {
    icon: Database,
    title: 'Your data is yours',
    body: 'Lab content, campaigns, traces, results, and your knowledge graph, belongs to you. It is used to provide the Service to your account, never sold, and it exports with you if you leave. No lock-in.',
  },
  {
    icon: Lock,
    title: 'Encryption',
    body: 'Data is encrypted in transit (TLS) between your browser, our APIs, and our data stores. Secrets and credentials are held by specialized processors, not in application code.',
  },
  {
    icon: Network,
    title: 'Tenant isolation',
    body: 'Each customer’s data is isolated and access-scoped at the database layer with row-level security, so one tenant can never read another’s campaigns or graph.',
  },
  {
    icon: KeyRound,
    title: 'Authentication & access',
    body: 'Accounts are protected by modern auth with hardened password and session handling. SSO / SAML and role-based access are available for larger deployments.',
  },
  {
    icon: Eye,
    title: 'Privacy-preserving learning',
    body: 'Cross-lab learning is opt-in. Where enabled, it uses aggregated or differentially private signals, one lab’s failure mode can warn another’s scientist without either seeing the other’s targets.',
  },
  {
    icon: FileCheck,
    title: 'Auditability',
    body: 'Every campaign keeps a full execution trace and lineage. Larger deployments add an audit log of access and administrative actions for governance and review.',
  },
];

const PROCESSORS = [
  ['Supabase', 'Database, authentication, and edge functions'],
  ['Cloudflare', 'Bot mitigation (Turnstile) and edge delivery'],
];

export function SecurityPage() {
  return (
    <DarkPageShell>
      <Seo
        title="Security & Trust, Contineon"
        description="How Contineon protects your lab data: encryption, tenant isolation, access controls, privacy-preserving learning, and auditability."
        path="/security"
      />

      {/* Hero */}
      <Beat
        minH="min-h-[80svh]"
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
        <div className="max-w-4xl pb-8">
          <p data-beat-fade>
            <Kicker>Security &amp; trust</Kicker>
          </p>
          <h1
            data-beat-title
            className="type-hero mt-5"
          >
            Built to be trusted with your lab.
          </h1>
          <p
            data-beat-fade
            className="type-lede mt-8 max-w-2xl text-white/75"
          >
            Atlas connects to the instruments and data that run your science. Here is how we protect
            them, and an honest account of where we are today.
          </p>
          <div data-beat-fade className="mt-10">
            <Magnetic>
              <Cta to="/contact?topic=security" variant="outlineLight">
                Request our security details <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
          </div>
        </div>
      </Beat>

      {/* Pillars — hairline spec list */}
      <Beat
        media={
          <>
            <div className="absolute inset-0 bg-[#06080B]" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <div className="max-w-2xl">
          <p data-beat-fade>
            <Kicker>How we protect it</Kicker>
          </p>
          <h2
            data-beat-title
            className="type-h2 mt-4"
          >
            The controls that guard your science.
          </h2>
        </div>
        <div className="mt-14">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              data-beat-fade
              className="grid grid-cols-1 gap-3 border-t border-white/10 py-6 sm:grid-cols-[44px_1fr] sm:gap-8"
            >
              <p.icon className="mt-1 h-6 w-6 text-ink" strokeWidth={1.5} />
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Beat>

      {/* Subprocessors — mono readout rows */}
      <Beat
        minH="min-h-[70svh]"
        media={
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080B] via-[#0A0D12] to-[#06080B]" />
            <GridField className="opacity-25" />
          </>
        }
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p data-beat-fade>
              <Kicker>Subprocessors</Kicker>
            </p>
            <h2
              data-beat-title
              className="type-h2 mt-4"
            >
              A small set of vetted providers.
            </h2>
            <p data-beat-fade className="type-body mt-6 max-w-md text-white/75">
              We rely on a small set of vetted providers to operate the Service. Each processes data
              only to deliver their service to us, under contract.
            </p>
          </div>
          <dl data-beat-fade className="lg:col-span-6 lg:col-start-7">
            {PROCESSORS.map(([name, role]) => (
              <div
                key={name}
                className="grid grid-cols-1 gap-2 border-t border-white/10 py-5 sm:grid-cols-[160px_1fr] sm:gap-8"
              >
                <dt className="font-mono-tech text-[13px] uppercase tracking-[0.16em] text-ink">{name}</dt>
                <dd className="text-[15px] leading-relaxed text-ink-muted">{role}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Beat>

      {/* Honest status + close */}
      <Beat
        minH="min-h-[80svh]"
        media={
          <>
            <div className="absolute inset-0 bg-[#06080B]" />
            <GridField className="opacity-20" />
          </>
        }
      >
        <div className="max-w-3xl">
          <p data-beat-fade>
            <Kicker className="text-safety">Where we are today</Kicker>
          </p>
          <h2
            data-beat-title
            className="type-h2 mt-4"
          >
            Honest about today, clear about the roadmap.
          </h2>
          <p data-beat-fade className="type-lede mt-7 max-w-2xl text-white/75">
            Atlas is open source and under active development. On the hosted service the protections
            above are in place now, and self-hosting keeps your data entirely inside your own
            infrastructure. Formal attestations (such as SOC 2) and a published Data Processing
            Addendum are on our roadmap for the hosted offering. If your evaluation needs a specific
            control, certification, or contractual term, tell us, we would rather scope it with you
            than over-claim.
          </p>
          <div data-beat-fade className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Cta to="/contact?topic=security" variant="accent">
                Request our security details <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
            <a
              href="mailto:security@contineon.io"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/25 px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Report a vulnerability
            </a>
          </div>
        </div>
      </Beat>
    </DarkPageShell>
  );
}
