/* =============================================================================
   Legal facts — the single source the Terms and Privacy pages read from.
   Fill every `null` below with the real value BEFORE launch. Until a value is
   set, the page keeps rendering the visible [PLACEHOLDER] marker, so unfilled
   blanks stay obvious and the "review required" banner stays accurate.

   These are FACTS, not legal judgment. The clauses still marked
   [REVIEW WITH COUNSEL] in the pages are a SEPARATE concern — a qualified
   attorney must review/finalize those, and the LegalTemplateNotice banner must
   stay until counsel signs off. Do not treat filling these blanks as having had
   the documents reviewed.
   ============================================================================= */

export interface LegalFacts {
  /** Registered legal entity that owns the Service / is the data controller. */
  entityName: string | null;
  /** Full registered address: street, city, region, postal code, country. */
  registeredAddress: string | null;
  /** "Last updated" / effective date shown on both documents, e.g. 'June 29, 2026'. */
  effectiveDate: string | null;
  /** Governing-law jurisdiction for the Terms, e.g. 'the State of Delaware, USA'. */
  governingLaw: string | null;
  /** Exclusive venue / courts for disputes, e.g. 'New Castle County, Delaware'. */
  venue: string | null;
  /** Liability-cap look-back period, e.g. '12 months'. */
  liabilityCapPeriod: string | null;
  /**
   * One concrete sentence stating data-retention windows (replaces the
   * "[RETENTION PERIODS] — set concrete retention windows with counsel." text).
   */
  retentionPeriods: string | null;
  /**
   * DPO / EU-representative sentence, e.g.
   * 'Our EU representative is … and our Data Protection Officer can be reached at …'.
   * Leave null if none is required (the placeholder stays visible until decided).
   */
  dpoOrEuRepresentative: string | null;
  /** Website / app hosting + CDN provider. Established: Vercel (see vercel.json). */
  hostingProvider: string | null;
  /** Contact address for privacy / legal questions. */
  contactEmail: string;
}

export const legal: LegalFacts = {
  entityName: null,
  registeredAddress: null,
  effectiveDate: null,
  governingLaw: null,
  venue: null,
  liabilityCapPeriod: null,
  retentionPeriods: null,
  dpoOrEuRepresentative: null,
  // The only fact established so far: the app deploys on Vercel (see #3 / vercel.json).
  hostingProvider: 'Vercel',
  contactEmail: 'hello@contineon.io',
};
