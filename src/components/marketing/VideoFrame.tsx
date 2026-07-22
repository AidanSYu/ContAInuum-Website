import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

/* =============================================================================
   VideoFrame, the framed slot for Asilia's hero film. Drop a real MP4 into `src`
   and it becomes a click-to-play player (native controls, poster, lazy). Leave
   `src` empty and it renders an on-brand placeholder (poster or an obsidian
   grid, a play affordance, and a caption) that is obviously ready for the real
   film without shipping a misleading one. antigravity-style rounded frame with
   an ember bloom and corner ticks.
   ============================================================================= */

export function VideoFrame({
  src,
  poster,
  label = 'Asilia',
  caption = 'Product film coming soon',
  className,
}: {
  src?: string;
  poster?: string;
  label?: string;
  caption?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    videoRef.current?.play().catch(() => {});
  };

  return (
    <div className={cn('relative', className)}>
      {/* ember bloom behind the frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -inset-y-12 -z-10 bg-[radial-gradient(58%_58%_at_50%_45%,rgba(242,97,58,0.20),transparent_72%)] blur-2xl"
      />

      <figure className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#0A0C10] shadow-[0_50px_140px_-45px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[16/9]">
          {src ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster={poster}
              controls={playing}
              preload="none"
              playsInline
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={src} type="video/mp4" />
            </video>
          ) : poster ? (
            <img src={poster} alt="" className="h-full w-full object-cover opacity-80" />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '54px 54px',
                maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 82%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 82%)',
              }}
            />
          )}

          {/* legibility scrim */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080B]/75 via-transparent to-[#06080B]/25" />

          {/* play affordance, hidden once a real film is playing */}
          {!playing && (
            <button
              type="button"
              onClick={src ? play : undefined}
              className={cn(
                'group absolute inset-0 grid place-items-center',
                src ? 'cursor-pointer' : 'cursor-default',
              )}
              aria-label={src ? 'Play film' : 'Film coming soon'}
              aria-disabled={!src}
            >
              <span className="grid h-[76px] w-[76px] place-items-center rounded-full border border-white/25 bg-white/5 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-white/40 group-hover:bg-white/10">
                <Play className="h-6 w-6 translate-x-[2px] fill-white text-white" />
              </span>
            </button>
          )}

          {/* corner ticks */}
          <div className="pointer-events-none absolute inset-[14px] z-[3] hidden md:block">
            <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-white/25" />
            <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-white/25" />
            <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-white/25" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-white/25" />
          </div>

          {/* label + caption */}
          {!playing && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-4 p-5">
              <span className="lab-label text-white/70">{label}</span>
              {!src && <span className="lab-label text-white/45">{caption}</span>}
            </div>
          )}
        </div>
      </figure>
    </div>
  );
}
