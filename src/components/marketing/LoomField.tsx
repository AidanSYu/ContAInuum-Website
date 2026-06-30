import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/* =============================================================================
   LoomField — a bespoke generative weave. A faint cloth of warp (vertical) and
   weft (horizontal) threads, with a single ember shuttle gliding across, laying
   one thread at a time, climbing the cloth and looping. It makes the line
   literal: "still made by hand, one mind at a time, the way cloth was made
   before the loom." Our grid motif, made organic. Obsidian + ember.

   The static cloth is prerendered to an offscreen buffer; each frame only blits
   the buffer and draws the moving shuttle. Reduced motion shows the still cloth.
   ============================================================================= */
export function LoomField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const CELL = 18;
    const SPEED = 0.95; // cells per frame
    let w = 0;
    let h = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let last = 0;
    let sx = 0; // shuttle column position (fractional)
    let srow = 0; // shuttle row from the bottom

    const base = document.createElement('canvas');
    const bctx = base.getContext('2d')!;

    const renderBase = () => {
      base.width = Math.floor(w * dpr);
      base.height = Math.floor(h * dpr);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, w, h);
      // warp: vertical threads
      bctx.lineWidth = 1;
      for (let c = 0; c <= cols; c++) {
        const x = c * CELL;
        bctx.strokeStyle = 'rgba(255,255,255,0.05)';
        bctx.beginPath();
        bctx.moveTo(x, 0);
        bctx.lineTo(x, h);
        bctx.stroke();
      }
      // weft: horizontal threads
      for (let r = 0; r <= rows; r++) {
        const y = r * CELL;
        bctx.strokeStyle = 'rgba(236,236,232,0.062)';
        bctx.beginPath();
        bctx.moveTo(0, y);
        bctx.lineTo(w, y);
        bctx.stroke();
      }
      // over/under weave nodes: brighter where the weft crosses over the warp
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (((r + c) & 1) === 0) {
            bctx.fillStyle = 'rgba(255,255,255,0.09)';
            bctx.fillRect(c * CELL - 0.7, r * CELL - 0.7, 1.4, 1.4);
          }
        }
      }
      // a handful of already-woven ember threads, for warmth in the cloth
      bctx.lineWidth = 1.2;
      for (let r = 4; r <= rows; r += 6) {
        const y = r * CELL;
        bctx.strokeStyle = 'rgba(242,97,58,0.08)';
        bctx.beginPath();
        bctx.moveTo(0, y);
        bctx.lineTo(w, y);
        bctx.stroke();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      renderBase();
    };

    const drawShuttle = () => {
      const y = h - srow * CELL;
      const x = sx * CELL;
      // woven ember trail behind the shuttle
      const trail = 11 * CELL;
      const x0 = Math.max(0, x - trail);
      const lg = ctx.createLinearGradient(x0, y, x, y);
      lg.addColorStop(0, 'rgba(242,97,58,0)');
      lg.addColorStop(1, 'rgba(242,97,58,0.7)');
      ctx.strokeStyle = lg;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      // soft glow
      const rg = ctx.createRadialGradient(x, y, 0, x, y, CELL * 3.6);
      rg.addColorStop(0, 'rgba(242,97,58,0.6)');
      rg.addColorStop(1, 'rgba(242,97,58,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(x, y, CELL * 3.6, 0, Math.PI * 2);
      ctx.fill();
      // bright shuttle core
      ctx.fillStyle = 'rgba(255,228,214,0.95)';
      ctx.beginPath();
      ctx.arc(x, y, 2.3, 0, Math.PI * 2);
      ctx.fill();
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (t - last < 1000 / 45) return;
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(base, 0, 0, w, h);
      drawShuttle();
      sx += SPEED;
      if (sx >= cols) {
        sx = 0;
        srow += 1;
        if (srow > rows) srow = 0;
      }
    };

    const onResize = () => {
      resize();
      if (reduce) {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(base, 0, 0, w, h);
      }
    };

    resize();
    if (reduce) {
      ctx.drawImage(base, 0, 0, w, h);
    } else {
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className={cn('block h-full w-full', className)} aria-hidden="true" />;
}
