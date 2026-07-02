import { cn } from '@/lib/utils';

/* =============================================================================
   ConsolePreview — a static, on-brand mock of the Atlas console: a running
   campaign as a plan/run/pause/evaluate/learn log. Bespoke to Contineon's
   lab-instrument voice (not a generic dashboard). Swap for a live capture later.
   ============================================================================= */

const STEPS: Array<{ n: string; k: string; t: string; s: 'done' | 'now' | 'queued' }> = [
  { n: '01', k: 'Plan', t: 'Decompose objective into 12 ordered experiments', s: 'done' },
  { n: '02', k: 'Run', t: 'Execute on the liquid handler + LC/MS', s: 'done' },
  { n: '03', k: 'Pause', t: 'TLC check — handed to a scientist', s: 'now' },
  { n: '04', k: 'Evaluate', t: 'Score results, read back the failures', s: 'queued' },
  { n: '05', k: 'Learn', t: 'Update lab memory for the next campaign', s: 'queued' },
];

export function ConsolePreview({ className, label = 'Atlas console' }: { className?: string; label?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0D12]', className)}>
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="lab-label">{label}</span>
        <span className="lab-label inline-flex items-center gap-2 text-safety">
          <span className="h-1.5 w-1.5 rounded-full bg-safety animate-pulse-tick" />
          Running
        </span>
      </div>

      {/* body */}
      <div className="px-5 py-6 sm:px-7 sm:py-7">
        <p className="font-mono-tech text-[12px] text-ink-muted">
          campaign — <span className="text-ink">suzuki coupling · yield optimization</span>
        </p>

        <ul className="mt-5 divide-y divide-white/[0.06]">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="grid grid-cols-[2rem_5rem_1fr] items-center gap-3 py-3 font-mono-tech text-[12px] sm:grid-cols-[2rem_5.5rem_1fr_auto] sm:text-[13px]"
            >
              <span className="text-ink-faint">{step.n}</span>
              <span className={cn('uppercase tracking-[0.12em]', step.s === 'now' ? 'text-safety' : 'text-ink')}>
                {step.k}
              </span>
              <span className="truncate text-ink-muted">{step.t}</span>
              <span
                className={cn(
                  'hidden text-[10px] uppercase tracking-[0.16em] sm:inline',
                  step.s === 'now' ? 'text-safety' : 'text-ink-faint',
                )}
              >
                {step.s === 'now' ? '● now' : step.s}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-white/10 pt-4 font-mono-tech text-[11px] text-ink-faint">
          <span>
            memory <span className="text-ink-muted">+37 recipes</span>
          </span>
          <span>
            <span className="text-ink-muted">4</span> failure modes
          </span>
          <span>
            graph <span className="text-ink-muted">updated</span>
          </span>
        </div>
      </div>
    </div>
  );
}
