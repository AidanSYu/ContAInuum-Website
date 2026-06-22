import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Faint measured blueprint grid used behind hero / feature sections.
 * Fades out toward the edges so content stays legible.
 */
export const BlueprintGrid: React.FC<{ className?: string; fade?: boolean }> = ({
  className,
  fade = true,
}) => {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 grid-blueprint', className)}
      aria-hidden="true"
      style={
        fade
          ? {
              maskImage:
                'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 100%)',
            }
          : undefined
      }
    />
  );
};
