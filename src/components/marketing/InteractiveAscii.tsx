import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { canUseAsciiWorker, startAsciiWorker } from './ascii-worker-client';

/* =============================================================================
   InteractiveAscii — a full-screen character field rendered from a video, that
   reacts to the cursor like General Intuition's hero: the characters near the
   pointer brighten, heat toward ember, and ripple. The pointer is eased so it
   trails smoothly; when idle it auto-drifts so the field is never dead. Our
   obsidian -> ember ramp, JetBrains Mono glyphs. Reduced motion = still frame.

   Perf: samples the video into a tiny offscreen buffer, modulates each cell's
   luminance by a smooth radial falloff from the pointer (+ a time ripple), then
   buckets cells by level so fillStyle is set a few times per frame.
   ============================================================================= */

const GLYPHS = " .'^\",:;Il!i~+_-?][}{1)|/tfjrxnuvczXYUCLQ0OZmwqpdbkhao*#MW&8%B@$";
const LEVELS = 30;

// shadows -> ash -> ember -> hot. Higher level = brighter + hotter.
const STOPS: Array<[number, [number, number, number]]> = [
  [0.0, [20, 17, 22]],
  [0.4, [92, 50, 52]],
  [0.66, [206, 96, 66]],
  [0.85, [246, 108, 52]],
  [1.0, [255, 236, 216]],
];

function palette(): string[] {
  const out: string[] = [];
  for (let i = 0; i < LEVELS; i++) {
    const t = i / (LEVELS - 1);
    let a = STOPS[0];
    let b = STOPS[STOPS.length - 1];
    for (let s = 0; s < STOPS.length - 1; s++) {
      if (t >= STOPS[s][0] && t <= STOPS[s + 1][0]) {
        a = STOPS[s];
        b = STOPS[s + 1];
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

export function InteractiveAscii({
  src,
  poster,
  cols = 132,
  speed = 1,
  className,
}: {
  src: string;
  poster?: string;
  cols?: number;
  speed?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const cvs = canvas.current;
    if (!host || !cvs) return;

    if (canUseAsciiWorker(cvs)) {
      let stopWorker: (() => void) | undefined;
      const boot = requestAnimationFrame(() => {
        stopWorker = startAsciiWorker({
          host,
          canvas: cvs,
          src,
          type: 'video',
          poster,
          cols,
          speed,
          fps: 30,
          tint: 'ember',
          contrast: 1,
          interactive: true,
        });
      });
      return () => {
        cancelAnimationFrame(boot);
        stopWorker?.();
      };
    }

    // Compatibility path for browsers without transferable OffscreenCanvas.
    const ctx = cvs.getContext('2d', { alpha: false });
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pal = palette();

    const sampler = document.createElement('canvas');
    const sctx = sampler.getContext('2d', { willReadFrequently: true })!;

    let rows = Math.round(cols * 0.5);
    let cellW = 1;
    let cellH = 1;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let onScreen = false;
    let ready = false;
    let running = false;
    let hostDocumentLeft = 0;
    let hostDocumentTop = 0;

    // pointer state (display px). eased toward target; auto-drift when idle.
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    let lastMove = -9999;
    let clock = 0;

    const buckets: number[][] = Array.from({ length: LEVELS }, () => []);

    let source: HTMLVideoElement | HTMLImageElement | null = null;
    const srcAspect = () => {
      if (source instanceof HTMLVideoElement) return (source.videoWidth || 16) / (source.videoHeight || 9);
      if (source instanceof HTMLImageElement) return (source.naturalWidth || 16) / (source.naturalHeight || 9);
      return 16 / 9;
    };

    const layout = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      hostDocumentLeft = rect.left + window.scrollX;
      hostDocumentTop = rect.top + window.scrollY;
      // Render at 1x — glyph raster cost scales with dpr^2 and the ASCII grid resolution
      // (cols x rows) is independent of it, so this is a ~4x per-frame win on retina with
      // no change to the effect's detail. Raise toward 1.5 for crisper glyphs at more cost.
      dpr = 1;
      cvs.width = Math.floor(rect.width * dpr);
      cvs.height = Math.floor(rect.height * dpr);
      rows = Math.max(8, Math.round((cols / srcAspect()) * 0.52));
      sampler.width = cols;
      sampler.height = rows;
      cellW = cvs.width / cols;
      cellH = cvs.height / rows;
      ctx.textBaseline = 'top';
      ctx.font = `${Math.ceil(cellH * 1.06)}px "JetBrains Mono Variable", ui-monospace, monospace`;
      if (px === 0 && py === 0) {
        px = tx = cvs.width / 2;
        py = ty = cvs.height / 2;
      }
    };

    const draw = (dt: number) => {
      sctx.drawImage(source as CanvasImageSource, 0, 0, cols, rows);
      const data = sctx.getImageData(0, 0, cols, rows).data;
      clock += dt;

      // idle auto-drift: a slow lissajous when the pointer has not moved
      if (clock - lastMove > 1400) {
        const a = clock * 0.00022;
        tx = cvs.width * (0.5 + 0.32 * Math.cos(a));
        ty = cvs.height * (0.5 + 0.3 * Math.sin(a * 1.3));
      }
      // Ease the pointer toward its target with a framerate-independent smoothing
      // factor, so the glow tracks identically whatever the redraw rate. RESPONSE is
      // the fraction of the remaining gap closed per 16.7ms; ~0.22 lands a ~150ms
      // catch-up — tight and alive like GI's cursor, versus the old 0.08-per-frame
      // that trailed the pointer by well over a second.
      const RESPONSE = 0.22;
      const k = 1 - Math.pow(1 - RESPONSE, dt / 16.667);
      px += (tx - px) * k;
      py += (ty - py) * k;

      const radius = Math.min(cvs.width, cvs.height) * 0.36;
      const inv = 1 / radius;

      for (let i = 0; i < LEVELS; i++) buckets[i].length = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const p = (y * cols + x) * 4;
          let lum = (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255;
          // pointer influence
          const ddx = (x + 0.5) * cellW - px;
          const ddy = (y + 0.5) * cellH - py;
          const d = Math.sqrt(ddx * ddx + ddy * ddy) * inv; // 0 at pointer
          if (d < 1) {
            const fall = (1 - d) * (1 - d);
            const ripple = 0.5 + 0.5 * Math.sin(d * 9 - clock * 0.006);
            lum = lum * (0.72 + 0.28 * fall) + fall * (0.42 + 0.34 * ripple);
          } else {
            lum *= 0.82; // dim away from the pointer for contrast
          }
          let lvl = (lum * LEVELS) | 0;
          if (lvl <= 0) continue;
          if (lvl >= LEVELS) lvl = LEVELS - 1;
          const b = buckets[lvl];
          b.push(x, y);
        }
      }

      ctx.fillStyle = '#06080b';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      const gspan = GLYPHS.length - 1;
      for (let lvl = 1; lvl < LEVELS; lvl++) {
        const b = buckets[lvl];
        if (!b.length) continue;
        ctx.fillStyle = pal[lvl];
        const ch = GLYPHS[Math.min(gspan, Math.round((lvl / (LEVELS - 1)) * gspan))];
        for (let k = 0; k < b.length; k += 2) {
          ctx.fillText(ch, b[k] * cellW, b[k + 1] * cellH);
        }
      }
    };

    // Throttle to 30fps. Each draw is a heavy per-cell fillText pass on the main thread,
    // so we cap it to leave frame budget for the (main-thread) Lenis smooth-scroll. 20fps
    // was steppy for the cursor glow — 30 keeps the pointer tracking feeling responsive
    // while still yielding to scroll. True 60fps parity with GI needs the OffscreenCanvas/
    // WebGL worker path so this stops touching the main thread at all.
    const FRAME_MS = 1000 / 30;
    const loop = (t: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const dt = Math.min(64, t - last || 16);
      if (t - last < FRAME_MS) return;
      last = t;
      draw(dt);
    };

    const startLoop = () => {
      if (!ready || running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      if (!onScreen) return;
      tx = (e.clientX + window.scrollX - hostDocumentLeft) * dpr;
      ty = (e.clientY + window.scrollY - hostDocumentTop) * dpr;
      lastMove = clock;
    };

    const start = () => {
      ready = true;
      layout();
      if (reduce) {
        draw(16);
      } else if (onScreen) startLoop();
    };

    if (!reduce) {
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
      img.src = poster || src;
      source = img;
      if (img.complete) start();
      else img.addEventListener('load', start);
    }

    const ro = new ResizeObserver(() => {
      if (ready) {
        layout();
        if (reduce) draw(16);
      }
    });
    ro.observe(host);
    const io = new IntersectionObserver(
      (en) => {
        onScreen = en[0]?.isIntersecting ?? true;
        if (source instanceof HTMLVideoElement) {
          if (onScreen) {
            source.play().catch(() => {});
            startLoop();
          } else {
            source.pause();
            stopLoop();
          }
        }
      },
      { threshold: 0.01 },
    );
    io.observe(host);
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      if (source instanceof HTMLVideoElement) {
        source.pause();
        source.src = '';
      }
    };
  }, [src, poster, cols, speed]);

  return (
    <div
      ref={wrap}
      className={cn('relative overflow-hidden bg-[#06080b] [contain:layout_paint_style]', className)}
      aria-hidden="true"
    >
      <canvas ref={canvas} className="h-full w-full" />
    </div>
  );
}
