import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/* =============================================================================
   AsciiMedia — Contineon's signature media treatment. Renders a video or image
   as a live grid of glyphs in our obsidian -> ember duotone. Inspired by the
   character-shader look (GI), but ours: monochrome-to-ember ramp, technical
   glyph set, integrated with the dark palette. Not a copy.

   Performance: samples the source into a tiny offscreen buffer, buckets cells
   by luminance so fillStyle is set a handful of times per frame, throttles to
   `fps`, and only animates while on-screen (IntersectionObserver). Honors
   prefers-reduced-motion by rendering a single static frame.
   ============================================================================= */

// Dark -> light luminance ramp (sparse to dense). Low luminance renders nothing.
const GLYPHS = " .'^\",:;Il!i~+_-?][}{1)|/tfjrxnuvczXYUCLQ0OZmwqpdbkhao*#MW&8%B@$";

type Tint = 'ember' | 'ice';

// 4-stop duotone gradients [t, [r,g,b]]: shadows -> ash -> accent -> hot.
const RAMPS: Record<Tint, Array<[number, [number, number, number]]>> = {
  ember: [
    [0.0, [28, 31, 36]],
    [0.5, [120, 122, 124]],
    [0.82, [242, 97, 58]],
    [1.0, [255, 226, 212]],
  ],
  ice: [
    [0.0, [26, 30, 36]],
    [0.5, [110, 120, 130]],
    [0.82, [127, 182, 214]],
    [1.0, [228, 244, 255]],
  ],
};

const LEVELS = 28;

function buildPalette(tint: Tint): string[] {
  const stops = RAMPS[tint];
  const out: string[] = [];
  for (let i = 0; i < LEVELS; i++) {
    const t = i / (LEVELS - 1);
    let a = stops[0];
    let b = stops[stops.length - 1];
    for (let s = 0; s < stops.length - 1; s++) {
      if (t >= stops[s][0] && t <= stops[s + 1][0]) {
        a = stops[s];
        b = stops[s + 1];
        break;
      }
    }
    const span = b[0] - a[0] || 1;
    const k = (t - a[0]) / span;
    const r = Math.round(a[1][0] + (b[1][0] - a[1][0]) * k);
    const g = Math.round(a[1][1] + (b[1][1] - a[1][1]) * k);
    const bl = Math.round(a[1][2] + (b[1][2] - a[1][2]) * k);
    out.push(`rgb(${r},${g},${bl})`);
  }
  return out;
}

export function AsciiMedia({
  src,
  type = 'video',
  poster,
  cols = 110,
  speed = 1,
  fps = 24,
  tint = 'ember',
  contrast = 1.15,
  className,
}: {
  src: string;
  type?: 'video' | 'image';
  poster?: string;
  cols?: number;
  speed?: number;
  fps?: number;
  tint?: Tint;
  contrast?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const cvs = canvas.current;
    if (!host || !cvs) return;
    const ctx = cvs.getContext('2d', { alpha: false });
    if (!ctx) return;

    const palette = buildPalette(tint);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // tiny offscreen sampler
    const sampler = document.createElement('canvas');
    const sctx = sampler.getContext('2d', { willReadFrequently: true })!;

    let rows = Math.round(cols * 0.5);
    let cellW = 1;
    let cellH = 1;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let onScreen = true;
    let ready = false;

    // bucket cell coords by luminance level so we batch fillStyle changes
    const buckets: number[][] = Array.from({ length: LEVELS }, () => []);

    const layout = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cvs.width = Math.floor(rect.width * dpr);
      cvs.height = Math.floor(rect.height * dpr);
      const aspect = source ? srcAspect() : rect.width / rect.height;
      rows = Math.max(8, Math.round((cols / aspect) * 0.52));
      sampler.width = cols;
      sampler.height = rows;
      cellW = cvs.width / cols;
      cellH = cvs.height / rows;
      ctx.textBaseline = 'top';
      ctx.font = `${Math.ceil(cellH * 1.08)}px "JetBrains Mono Variable", ui-monospace, monospace`;
    };

    let source: HTMLVideoElement | HTMLImageElement | null = null;
    const srcAspect = () => {
      if (source instanceof HTMLVideoElement) return (source.videoWidth || 16) / (source.videoHeight || 9);
      if (source instanceof HTMLImageElement) return (source.naturalWidth || 16) / (source.naturalHeight || 9);
      return 16 / 9;
    };

    const draw = () => {
      if (!ready) return;
      sctx.drawImage(source as CanvasImageSource, 0, 0, cols, rows);
      const data = sctx.getImageData(0, 0, cols, rows).data;

      for (let i = 0; i < LEVELS; i++) buckets[i].length = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const p = (y * cols + x) * 4;
          let lum = (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255;
          lum = Math.min(1, Math.max(0, (lum - 0.5) * contrast + 0.5));
          const lvl = Math.min(LEVELS - 1, Math.max(0, Math.floor(lum * LEVELS)));
          if (lvl <= 0) continue; // shadows stay empty
          const b = buckets[lvl];
          b.push(x, y);
        }
      }

      ctx.fillStyle = '#06080b';
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      const glyphSpan = GLYPHS.length - 1;
      for (let lvl = 1; lvl < LEVELS; lvl++) {
        const b = buckets[lvl];
        if (!b.length) continue;
        ctx.fillStyle = palette[lvl];
        const ch = GLYPHS[Math.min(glyphSpan, Math.round((lvl / (LEVELS - 1)) * glyphSpan))];
        for (let k = 0; k < b.length; k += 2) {
          ctx.fillText(ch, b[k] * cellW, b[k + 1] * cellH);
        }
      }
    };

    // Hold the last frame while the user is actively scrolling: the per-frame
    // getImageData readback otherwise stalls the scroll. Ambient enough that a
    // brief freeze mid-scroll is imperceptible; resumes ~140ms after scroll stops.
    let lastScroll = -9999;
    const onScroll = () => {
      lastScroll = performance.now();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!onScreen) return;
      if (t - last < 1000 / fps) return;
      if (t - lastScroll < 140) return;
      last = t;
      draw();
    };

    const start = () => {
      ready = true;
      layout();
      if (reduce || type === 'image') {
        draw();
      } else {
        raf = requestAnimationFrame(loop);
      }
    };

    // build the source
    if (type === 'video' && !reduce) {
      const v = document.createElement('video');
      v.src = src;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = true;
      v.crossOrigin = 'anonymous';
      source = v;
      v.addEventListener('loadeddata', () => {
        v.playbackRate = speed;
        v.play().catch(() => {});
        start();
      });
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = type === 'video' ? poster || src : src;
      source = img;
      if (img.complete) start();
      else img.addEventListener('load', start);
    }

    const ro = new ResizeObserver(() => {
      if (ready) {
        layout();
        if (reduce || type === 'image') draw();
      }
    });
    ro.observe(host);

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        if (source instanceof HTMLVideoElement) {
          if (onScreen) source.play().catch(() => {});
          else source.pause();
        }
      },
      { rootMargin: '120px' },
    );
    io.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (source instanceof HTMLVideoElement) {
        source.pause();
        source.src = '';
      }
    };
  }, [src, type, poster, cols, speed, fps, tint, contrast]);

  return (
    <div ref={wrap} className={cn('relative overflow-hidden bg-[#06080b]', className)} aria-hidden="true">
      <canvas ref={canvas} className="h-full w-full" />
    </div>
  );
}
