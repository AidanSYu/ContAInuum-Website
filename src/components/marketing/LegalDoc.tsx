import type { ReactNode } from 'react';
import { DarkPageShell } from '@/components/marketing/DarkPageShell';
import { GridField } from '@/components/marketing/visuals';
import { Kicker } from '@/components/marketing/ui';

/* =============================================================================
   LegalDoc, shared editorial shell for long-form legal/policy pages
   (Terms, Privacy). Obsidian and ruthlessly plain: a calm titled masthead over a
   faint grid, then a quiet dark reading column (.legal-prose). No hero media, no
   motion theatrics — readability and seriousness first. Content lives in the page
   that renders it.
   ============================================================================= */

export function LegalDoc({
  kicker,
  title,
  lastUpdated,
  children,
}: {
  kicker: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <DarkPageShell>
      <div className="relative px-[5vw] pb-28 pt-32 lg:px-8 lg:pt-40">
        <GridField className="opacity-[0.14]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="border-b border-white/10 pb-8">
            <Kicker>{kicker}</Kicker>
            <h1 className="type-h2 mt-4 text-ink">
              {title}
            </h1>
            <p className="mt-4 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-ink-faint">
              Last updated, {lastUpdated}
            </p>
          </div>

          <div className="legal-prose mt-10 space-y-8">{children}</div>

          <p className="mt-14 border-t border-white/10 pt-6 text-sm text-ink-muted">
            Questions about this document?{' '}
            <a href="/contact" className="text-safety hover:underline">
              Contact us
            </a>
            .
          </p>
        </div>
      </div>
    </DarkPageShell>
  );
}

/** A numbered section with a heading. */
export function LegalSection({ n, heading, children }: { n: string; heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
        <span className="mr-2 font-mono-tech text-sm text-ink-faint">{n}</span>
        {heading}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">{children}</div>
    </section>
  );
}

/**
 * Prominent, honest banner: this content is a DRAFT generated from how the
 * product actually behaves. It is NOT legal advice and must be reviewed by
 * qualified counsel (and have placeholders filled) before launch.
 */
export function LegalTemplateNotice() {
  return (
    <div className="rounded-lg border border-safety/50 bg-safety/[0.07] p-5">
      <p className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-safety">
        Draft, not legal advice, review required
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        This document is a <strong className="text-ink">DRAFT</strong> generated from Contineon's
        actual product behavior. It is <strong className="text-ink">not legal advice</strong> and has
        not been reviewed by counsel. It must be reviewed and adapted by a qualified attorney for
        Contineon's jurisdiction(s) and data-processing arrangements before launch. Items in{' '}
        <code className="font-mono-tech text-[12px] text-safety">[BRACKETS]</code> are placeholders the
        owner must complete; clauses marked{' '}
        <code className="font-mono-tech text-[12px] text-safety">[REVIEW WITH COUNSEL]</code> involve
        legal judgment a non-lawyer should not finalize.
      </p>
    </div>
  );
}

/** Inline helper to render a placeholder token consistently within prose. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-safety/10 px-1 py-0.5 font-mono-tech text-[12px] text-safety">
      {children}
    </code>
  );
}

/**
 * Render a filled-in legal fact (from src/config/legal.ts), or fall back to the
 * visible [PLACEHOLDER] marker when it hasn't been provided yet, so unfilled
 * blanks stay obvious and the "review required" banner stays accurate.
 */
export function Fact({ value, placeholder }: { value: string | null; placeholder: string }) {
  return value ? <>{value}</> : <Placeholder>{placeholder}</Placeholder>;
}
