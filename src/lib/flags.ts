/* =============================================================================
   Feature flags — resolved from Vite env at build time.
   Set them in `.env.local` (dev) or the deploy host's env (prod).
   Every flag defaults OFF so a missing/blank env var is always the safe state.
   A flag is "on" only when its VITE_ var is the literal string "true".
   ============================================================================= */

const on = (v: unknown) => v === 'true';

export const flags = {
  /**
   * Show the illustrative campaign metrics (handoff alert + stat cards) on the
   * dashboard Overview. OFF by default: the ATLAS campaign backend does not
   * exist yet, so those numbers are demo data, not the signed-in user's data.
   * Turn on only for sales demos / screenshots — never in customer-facing prod.
   */
  showDemoMetrics: on(import.meta.env.VITE_SHOW_DEMO_METRICS),
} as const;

export type Flags = typeof flags;
