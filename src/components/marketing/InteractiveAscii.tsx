import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

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
  [0.0, [26, 29, 34]],
  [0.45, [108, 112, 116]],
  [0.74, [214, 120, 92]],
  [0.9, [242, 97, 58]],
  [1.0, [255, 232, 220]],
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
    let onScreen = true;
    let ready = false;

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
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
      // ease pointer toward target
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;

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

    // Hold the last frame while the user is actively scrolling — the getImageData
    // readback otherwise stalls the scroll. Resumes ~140ms after scroll settles.
    let lastScroll = -9999;
    const onScroll = () => {
      lastScroll = performance.now();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!onScreen || !ready) return;
      const dt = Math.min(64, t - last || 16);
      if (t - last < 1000 / 22) return;
      if (t - lastScroll < 140) return;
      last = t;
      draw(dt);
    };

    const onMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect();
      tx = (e.clientX - rect.left) * dpr;
      ty = (e.clientY - rect.top) * dpr;
      lastMove = clock;
    };

    const start = () => {
      ready = true;
      layout();
      if (reduce) {
        draw(16);
      } else {
        raf = requestAnimationFrame(loop);
      }
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
          if (onScreen) source.play().catch(() => {});
          else source.pause();
        }
      },
      { rootMargin: '120px' },
    );
    io.observe(host);
    window.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      if (source instanceof HTMLVideoElement) {
        source.pause();
        source.src = '';
      }
    };
  }, [src, poster, cols, speed]);

  return (
    <div ref={wrap} className={cn('relative overflow-hidden bg-[#06080b]', className)} aria-hidden="true">
      <canvas ref={canvas} className="h-full w-full" />
    </div>
  );
}
