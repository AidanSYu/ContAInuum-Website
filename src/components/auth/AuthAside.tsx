/* =============================================================================
   AuthAside — cinematic right-hand panel for the sign-up / login pages.
   Rendered as the right column in AuthLayout (hidden below lg). The left column
   keeps the form, validation, and Turnstile logic untouched.
   ============================================================================= */

const PROOF = [
  'Cross-campaign memory from run one',
  'Human handoff, mid-campaign, any time',
  'No instruments to replace',
];

export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-ink lg:block">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.42]"
        style={{ backgroundImage: "url('/images/contact-lab-closeup.jpg')" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(11,13,17,.55), rgba(11,13,17,.9))' }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between p-[clamp(36px,4vw,60px)]">
        <p className="font-mono-tech text-[11px] uppercase tracking-[0.22em] text-white/50">
          [ FIG.02 — live campaign ]
        </p>

        <blockquote>
          <p className="font-display text-[clamp(24px,2.6vw,34px)] font-bold leading-tight tracking-tight text-white">
            “It remembers what my postdocs forget. That’s the whole reason we bought it.”
          </p>
          <p className="mt-5 text-sm text-white/[0.66]">
            <span className="font-semibold text-white">Dr. Maya Okonkwo</span> — PI, Northpoint Chemistry
          </p>
        </blockquote>

        <div className="overflow-hidden rounded-lg border border-white/[0.14] bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-white/10 px-[15px] py-3 font-mono-tech text-[10px] uppercase tracking-[0.16em] text-white/50">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-safety" /> atlas / campaign-4821
            </span>
            <span>RUN</span>
          </div>
          {[
            ['09:52', 'handoff → TLC read requested'],
            ['10:03', 'resumed · yield 78% logged'],
            ['10:04', 'recipe template updated ✓'],
          ].map(([t, m]) => (
            <div key={t} className="flex gap-2.5 border-b border-white/[0.08] px-[15px] py-2.5 font-mono-tech text-[11px] text-white/70 last:border-b-0">
              <span className="text-white/40">{t}</span>
              <span>{m}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3.5">
          {PROOF.map((p) => (
            <div key={p} className="flex items-center gap-3 text-sm text-white/[0.86]">
              <span className="font-mono-tech text-safety">→</span> {p}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
