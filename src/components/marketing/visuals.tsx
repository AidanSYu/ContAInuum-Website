import { cn } from '@/lib/utils';

/* Dashed technical grid overlay (Varda-style). Sits absolutely inside a relative
   parent; purely decorative. */
export function GridField({ className, cell = 96 }: { className?: string; cell?: number }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage:
          'linear-gradient(to right, hsl(var(--border)/0.7) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)/0.7) 1px, transparent 1px)',
        backgroundSize: `${cell}px ${cell}px`,
        maskImage: 'radial-gradient(ellipse 120% 100% at 50% 0%, black 55%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 120% 100% at 50% 0%, black 55%, transparent 100%)',
      }}
    />
  );
}

/* Cinematic image plate. With `src`, renders a muted, duotone-tinted image in the
   SR-71 mood. Without one, a clean labelled placeholder ready for a real image. */
export function Plate({
  src,
  alt = '',
  label,
  caption,
  className,
  tint = true,
}: {
  src?: string;
  alt?: string;
  label?: string;
  caption?: string;
  className?: string;
  tint?: boolean;
}) {
  return (
    <figure className={cn('relative overflow-hidden rounded-2xl border border-line bg-panel', className)}>
      {src ? (
        <>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ filter: 'saturate(1.15) contrast(10.8) brightness(1.0)' }}
          />
          {tint && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(8,10,14,0) 45%, rgba(8,10,14,0.65) 100%)',
              }}
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 78%)',
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <svg viewBox="0 0 4096 4096" className="h-9 w-9 text-ink-faint" fill="currentColor" aria-hidden="true">
              <rect x="327.68" y="1311.676" width="489.99" height="1472.647" />
              <rect x="817.67" y="819.009" width="2950.65" height="489.99" />
              <rect x="817.67" y="2787.001" width="2950.65" height="489.99" />
            </svg>
          </div>
        </div>
      )}
      {label && (
        <figcaption className="absolute left-4 top-4 z-10">
          <span className="lab-label bg-[hsl(var(--background)/0.4)] px-1.5 py-0.5 backdrop-blur-sm">{label}</span>
        </figcaption>
      )}
      {caption && (
        <figcaption className="absolute bottom-4 left-4 z-10 max-w-[80%] text-[13px] text-white/80">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
