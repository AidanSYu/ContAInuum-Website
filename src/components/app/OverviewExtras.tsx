import { Activity, ArrowRight } from 'lucide-react';
import { useCountUp } from '@/lib/scroll-fx';
import { cn } from '@/lib/utils';

/* =============================================================================
   OverviewExtras, dashboard handoff alert + stat cards.
   <HandoffAlert /> and <StatCards /> show DEMO data (there is no ASILIA campaign
   backend yet), so OverviewPage only renders them behind the `showDemoMetrics`
   feature flag (off by default). When the flag is off, customers see
   <CampaignsEmptyState /> instead, no fabricated numbers.
   When the real campaign API lands, wire the values / onResolve to live queries
   and drop the flag gate.
   ============================================================================= */

export function HandoffAlert({
  title = 'Campaign 4821 paused, needs a human read',
  detail = 'ASILIA ran a TLC plate on the Pd catalyst screen and needs you to confirm the result before it resumes.',
  since = 'paused 14m ago',
  onResolve,
}: {
  title?: string;
  detail?: string;
  since?: string;
  onResolve?: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4.5 rounded-[10px] border border-safety/45 bg-safety/[0.05] px-5 py-4.5">
      <span className="h-2.5 w-2.5 flex-none animate-pulse rounded-full bg-safety" />
      <div className="min-w-[200px] flex-1">
        <b className="font-display text-[15px] font-semibold text-ink">{title}</b>
        <p className="mt-0.5 text-[13px] text-ink-muted">{detail}</p>
      </div>
      <span className="font-mono-tech text-[11px] text-ink-faint">{since}</span>
      <button
        onClick={onResolve}
        className="inline-flex items-center gap-2 rounded bg-safety px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-safety/90"
      >
        Resolve handoff <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

type Stat = { k: string; value: number; decimals?: number; suffix?: string; prefix?: string; unit?: string; d: string; up?: string };

const STATS: Stat[] = [
  { k: 'Active campaigns', value: 3, d: 'since last week', up: '▲ 1' },
  { k: 'Memory carry-over', value: 78, suffix: '%', d: 'avg seed coverage / new run' },
  { k: 'Graph nodes', value: 12.4, decimals: 1, suffix: 'k', d: 'this campaign', up: '▲ 420' },
  { k: 'Drift alerts', value: 0, d: 'all runs within calibration' },
];

function StatCard({ s }: { s: Stat }) {
  const { ref, val } = useCountUp(s.value, { decimals: s.decimals ?? 0 });
  return (
    <div className="rounded-[10px] border border-line bg-surface px-5 py-4.5">
      <div className="font-mono-tech text-[10px] uppercase tracking-[0.14em] text-ink-faint">{s.k}</div>
      <div className="mt-2.5 font-display text-[32px] font-extrabold tracking-tight text-ink">
        {s.prefix}
        <span ref={ref}>{val}</span>
        {s.suffix}
        {s.unit && <span className="text-[0.6em]"> {s.unit}</span>}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-ink-muted">
        {s.up && <span className="font-mono-tech text-safety">{s.up}</span>}
        {s.d}
      </div>
    </div>
  );
}

export function StatCards({ className }: { className?: string }) {
  return (
    <div className={cn('mt-5.5 grid grid-cols-2 gap-4 lg:grid-cols-4', className)}>
      {STATS.map((s) => (
        <StatCard key={s.k} s={s} />
      ))}
    </div>
  );
}

/* -----------------------------------------------------------------------------
   CampaignsEmptyState, shown on the Overview when demo metrics are off.
   Honest placeholder: no numbers, just an explanation of what will appear here.
   ----------------------------------------------------------------------------- */
export function CampaignsEmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mt-6 flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-line bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      <Activity className="h-7 w-7 text-ink-faint" strokeWidth={1.5} />
      <div>
        <p className="font-display text-[15px] font-semibold text-ink">No active campaigns yet</p>
        <p className="mx-auto mt-1 max-w-md text-[13px] text-ink-muted">
          Once you launch an ASILIA campaign, its live metrics, memory carry-over, and any handoffs
          that need a human read will show up here.
        </p>
      </div>
    </div>
  );
}
