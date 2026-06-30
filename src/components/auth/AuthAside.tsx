/* =============================================================================
   AuthAside, cinematic right-hand panel for the sign-up / login pages.
   Rendered as the right column in AuthLayout (hidden below lg). Honest framing —
   no fabricated testimonials or customer logos.
   ============================================================================= */

const PROOF = [
  { t: 'Cross-campaign memory', d: 'Knowledge carries from the very first run.' },
  { t: 'Human handoff, any time', d: 'Atlas pauses mid-campaign for the steps that need hands.' },
  { t: 'No instruments to replace', d: 'It runs on the bench and integrations you already operate.' },
];

export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-ink lg:block">
      <img
        src="/images/sr71-quote-wide.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(11,13,17,.6), rgba(11,13,17,.92))' }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between p-[clamp(36px,4vw,60px)]">
        <p className="lab-label text-white/55">Atlas, the lab that remembers</p>

        <p className="max-w-md text-[clamp(24px,2.6vw,36px)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
          One agent that plans, runs, and remembers, on the lab you already have.
        </p>

        <dl className="divide-y divide-white/10 border-y border-white/10">
          {PROOF.map((p) => (
            <div key={p.t} className="py-4">
              <dt className="text-[15px] font-semibold text-white">{p.t}</dt>
              <dd className="mt-1 text-sm text-white/60">{p.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
