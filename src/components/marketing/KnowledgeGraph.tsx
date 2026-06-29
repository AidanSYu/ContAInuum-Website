/* eslint-disable react-hooks/refs --
   Intentional imperative-animation pattern: a requestAnimationFrame loop mutates
   node positions in `nodesRef.current` in place (a force-directed physics sim)
   and a useReducer tick drives the re-render that reads those live positions
   during render. Lifting positions into state would re-run the sim every frame
   through React and defeat the optimization. */
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Reveal } from '@/lib/scroll-fx';
import { cn } from '@/lib/utils';

/* =============================================================================
   KnowledgeGraph — a live, force-directed SVG of a lab's memory.
   Replaces the static product-graph.png with interactive "proof": every node
   is a recipe, failure mode, lab-lore note, or instrument; drag one and the
   whole graph responds. Dependency-free (hand-rolled spring sim on rAF).
   ============================================================================= */

type Kind = 'core' | 'recipe' | 'failure' | 'lore' | 'instrument';

interface SimNode {
  id: string;
  label: string;
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null; // pinned position while dragging
  fy: number | null;
}

const VBW = 660;
const VBH = 460;

const NODE_DEFS: { id: string; label: string; kind: Kind }[] = [
  { id: 'core', label: 'Lab memory', kind: 'core' },
  { id: 'r1', label: 'Suzuki coupling', kind: 'recipe' },
  { id: 'r2', label: 'Pd cat. screen', kind: 'recipe' },
  { id: 'r3', label: 'Amide coupling', kind: 'recipe' },
  { id: 'f1', label: 'Rotovap leak', kind: 'failure' },
  { id: 'f2', label: 'Wet solvent', kind: 'failure' },
  { id: 'f3', label: 'Low yield @ 4°C', kind: 'failure' },
  { id: 'l1', label: '“Avoid supplier X”', kind: 'lore' },
  { id: 'l2', label: '“Balance drifts”', kind: 'lore' },
  { id: 'i1', label: 'HPLC-02', kind: 'instrument' },
  { id: 'i2', label: 'Glovebox', kind: 'instrument' },
  { id: 'i3', label: 'Plate reader', kind: 'instrument' },
];

const EDGES: [string, string][] = [
  ['core', 'r1'], ['core', 'r2'], ['core', 'r3'],
  ['core', 'f1'], ['core', 'l1'], ['core', 'i1'],
  ['r1', 'r2'], ['r1', 'i1'], ['r1', 'f3'],
  ['r2', 'f2'], ['r2', 'i2'], ['r3', 'i3'],
  ['f1', 'i1'], ['f2', 'l1'], ['f3', 'l2'],
  ['r3', 'f3'], ['l2', 'i3'],
];

const KIND_STYLE: Record<Kind, { fill: string; stroke: string; r: number; text: string }> = {
  core: { fill: 'var(--safety)', stroke: 'var(--safety)', r: 13, text: 'var(--paper)' },
  recipe: { fill: 'var(--surface)', stroke: 'var(--safety)', r: 8, text: 'var(--ink)' },
  failure: { fill: 'var(--surface)', stroke: 'var(--ink)', r: 7, text: 'var(--ink)' },
  lore: { fill: 'var(--panel)', stroke: 'var(--ink-faint)', r: 7, text: 'var(--ink-muted)' },
  instrument: { fill: 'var(--surface)', stroke: 'var(--hairline-strong)', r: 7, text: 'var(--ink-muted)' },
};

const LEGEND: { kind: Kind; label: string }[] = [
  { kind: 'recipe', label: 'Recipe' },
  { kind: 'failure', label: 'Failure mode' },
  { kind: 'lore', label: 'Lab lore' },
  { kind: 'instrument', label: 'Instrument' },
];

/** Deterministic initial layout — nodes on a ring around the core. */
function seedNodes(): SimNode[] {
  return NODE_DEFS.map((n, i) => {
    if (n.kind === 'core') {
      return { ...n, x: VBW / 2, y: VBH / 2, vx: 0, vy: 0, fx: null, fy: null };
    }
    const a = (i / (NODE_DEFS.length - 1)) * Math.PI * 2;
    return {
      ...n,
      x: VBW / 2 + Math.cos(a) * 150,
      y: VBH / 2 + Math.sin(a) * 110,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    };
  });
}

/** One physics step. Mutates nodes in place. Returns total kinetic energy. */
function step(nodes: SimNode[], adj: Map<string, Set<string>>, alpha: number): number {
  const REPULSE = 2600;
  const SPRING = 0.015;
  const SPRING_LEN = 96;
  const CENTER = 0.012;
  const DAMP = 0.84;

  // repulsion (all pairs)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 1) d2 = 1;
      const f = (REPULSE / d2) * alpha;
      const d = Math.sqrt(d2);
      const ux = dx / d;
      const uy = dy / d;
      a.vx += ux * f;
      a.vy += uy * f;
      b.vx -= ux * f;
      b.vy -= uy * f;
    }
  }
  // springs (edges)
  for (const [s, t] of EDGES) {
    const a = nodes.find((n) => n.id === s)!;
    const b = nodes.find((n) => n.id === t)!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const f = (d - SPRING_LEN) * SPRING * alpha;
    const ux = dx / d;
    const uy = dy / d;
    a.vx += ux * f;
    a.vy += uy * f;
    b.vx -= ux * f;
    b.vy -= uy * f;
  }
  // centering + integrate
  let energy = 0;
  for (const n of nodes) {
    n.vx += (VBW / 2 - n.x) * CENTER * alpha;
    n.vy += (VBH / 2 - n.y) * CENTER * alpha;
    n.vx *= DAMP;
    n.vy *= DAMP;
    if (n.fx != null) {
      n.x = n.fx;
      n.vx = 0;
    } else {
      n.x += n.vx;
    }
    if (n.fy != null) {
      n.y = n.fy;
      n.vy = 0;
    } else {
      n.y += n.vy;
    }
    // keep inside the box
    n.x = Math.max(28, Math.min(VBW - 28, n.x));
    n.y = Math.max(26, Math.min(VBH - 26, n.y));
    energy += n.vx * n.vx + n.vy * n.vy;
  }
  void adj;
  return energy;
}

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const nodesRef = useRef<SimNode[]>(seedNodes());
  const alphaRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const dragRef = useRef<string | null>(null);
  const [, rerender] = useReducer((c) => c + 1, 0);
  const [hover, setHover] = useState<string | null>(null);

  const adj = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const [s, t] of EDGES) {
      (m.get(s) ?? m.set(s, new Set()).get(s)!).add(t);
      (m.get(t) ?? m.set(t, new Set()).get(t)!).add(s);
    }
    return m;
  }, []);

  // simulate
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      for (let i = 0; i < 400; i++) step(nodesRef.current, adj, 0.6);
      rerender();
      return;
    }

    const tick = () => {
      const e = step(nodesRef.current, adj, alphaRef.current);
      alphaRef.current = Math.max(0.02, alphaRef.current * 0.992);
      rerender();
      // keep animating while warm or dragging; otherwise idle
      if (e > 0.6 || dragRef.current || alphaRef.current > 0.05) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [adj]);

  const reheat = () => {
    alphaRef.current = Math.max(alphaRef.current, 0.7);
    if (rafRef.current == null) {
      const tick = () => {
        const e = step(nodesRef.current, adj, alphaRef.current);
        alphaRef.current = Math.max(0.02, alphaRef.current * 0.992);
        rerender();
        if (e > 0.6 || dragRef.current || alphaRef.current > 0.05) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const toVB = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * VBW,
      y: ((clientY - rect.top) / rect.height) * VBH,
    };
  };

  const onPointerDown = (id: string) => (ev: React.PointerEvent) => {
    ev.preventDefault();
    (ev.target as Element).setPointerCapture?.(ev.pointerId);
    dragRef.current = id;
    const p = toVB(ev.clientX, ev.clientY);
    const n = nodesRef.current.find((x) => x.id === id)!;
    n.fx = p.x;
    n.fy = p.y;
    reheat();
  };
  const onPointerMove = (ev: React.PointerEvent) => {
    if (!dragRef.current) return;
    const p = toVB(ev.clientX, ev.clientY);
    const n = nodesRef.current.find((x) => x.id === dragRef.current)!;
    n.fx = p.x;
    n.fy = p.y;
  };
  const onPointerUp = () => {
    if (!dragRef.current) return;
    const n = nodesRef.current.find((x) => x.id === dragRef.current)!;
    n.fx = null;
    n.fy = null;
    dragRef.current = null;
    reheat();
  };

  const nodes = nodesRef.current;
  const isActive = (id: string) =>
    !hover || hover === id || adj.get(hover)?.has(id) || adj.get(id)?.has(hover);

  return (
    <div className="select-none">
      {/* Non-visual fallback: the graph's data as a plain list for screen readers */}
      <ul className="sr-only">
        {NODE_DEFS.map((n) => (
          <li key={n.id}>
            {n.kind === 'core' ? 'Core' : n.kind}: {n.label}
          </li>
        ))}
      </ul>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VBW} ${VBH}`}
        className="block h-auto w-full touch-none"
        role="img"
        aria-label="Interactive knowledge graph of a lab's recipes, failure modes, lore, and instruments"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* edges */}
        {EDGES.map(([s, t]) => {
          const a = nodes.find((n) => n.id === s)!;
          const b = nodes.find((n) => n.id === t)!;
          const lit = hover && (s === hover || t === hover);
          const dim = hover && !lit;
          return (
            <line
              key={`${s}-${t}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={lit ? 'var(--safety)' : 'var(--line)'}
              strokeWidth={lit ? 1.4 : 1}
              opacity={dim ? 0.25 : 1}
            />
          );
        })}

        {/* nodes */}
        {nodes.map((n) => {
          const s = KIND_STYLE[n.kind];
          const active = isActive(n.id);
          return (
            <g
              key={n.id}
              transform={`translate(${n.x} ${n.y})`}
              opacity={active ? 1 : 0.32}
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={onPointerDown(n.id)}
              onPointerEnter={() => setHover(n.id)}
              onPointerLeave={() => setHover(null)}
            >
              <circle
                r={s.r + (hover === n.id ? 2.5 : 0)}
                fill={s.fill}
                stroke={s.stroke}
                strokeWidth={n.kind === 'core' ? 0 : 1.6}
              />
              <text
                y={s.r + 13}
                textAnchor="middle"
                fontSize={n.kind === 'core' ? 12 : 10.5}
                fontFamily="'IBM Plex Mono', monospace"
                fill={n.kind === 'core' ? 'var(--ink)' : s.text}
                fontWeight={n.kind === 'core' ? 600 : 400}
                style={{ pointerEvents: 'none' }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* legend */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {LEGEND.map((l) => (
          <span key={l.kind} className="inline-flex items-center gap-2 font-mono-tech text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: KIND_STYLE[l.kind].fill, border: `1.5px solid ${KIND_STYLE[l.kind].stroke}` }}
            />
            {l.label}
          </span>
        ))}
        <span className="ml-auto font-mono-tech text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          Drag a node ↻
        </span>
      </div>
    </div>
  );
}

/** Editorial section housing the live graph as a numbered figure. */
export function KnowledgeGraphShowcase({ figNo = '04' }: { figNo?: string }) {
  return (
    <section id="memory" className="relative overflow-hidden border-y border-line bg-paper py-[clamp(64px,9vw,120px)] text-ink">
      <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative z-10 mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
        <Reveal className="max-w-[44rem]">
          <p className="lab-label text-safety">[ {figNo} ] The knowledge graph</p>
          <h2 className="cine-head mt-4 text-[clamp(30px,4.4vw,58px)]">Your lab's memory, as a graph.</h2>
          <p className="mt-5 text-[clamp(16px,1.2vw,19px)] leading-relaxed text-ink-muted">
            Every run, correction, and note becomes a node — recipes, failure modes, and lab lore.
            The PI's case for ATLAS isn't speed. It's that it remembers what your postdocs forget.
          </p>
        </Reveal>

        <Reveal delay={120} className={cn('mt-10 border border-line bg-surface p-3 shadow-lab sm:p-5')}>
          <KnowledgeGraph />
          <figcaption className="mt-4 border-t border-line pt-3">
            <span className="lab-label">Fig. {figNo} — Live knowledge graph · containuum.io / knowledge-graph</span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
