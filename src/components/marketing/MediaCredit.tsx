import type { MediaCreditInfo } from '@/lib/mediaCredits';

/* Tiny bottom-right attribution overlay for licensed media — rendered ONLY
   where the license requires visible credit (see src/lib/mediaCredits.ts).
   Sits inside a full-bleed media container (absolute positioning context). */
export function MediaCredit({ credit }: { credit: MediaCreditInfo }) {
  return (
    <a
      href={credit.href}
      target="_blank"
      rel="noreferrer"
      className="absolute bottom-2 right-3 z-20 max-w-[80vw] text-right font-mono-tech text-[10px] leading-snug text-white/30 transition-colors hover:text-white/70"
    >
      {credit.label}
    </a>
  );
}
