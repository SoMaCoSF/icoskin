'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { spatialId } from '../lib/ico';

/**
 * The cymatic mask instrument. One hex face of the icosphere, drawn flat.
 *
 * The field is the interference of three standing waves at 60 degrees —
 * the hexagonal-symmetry Chladni family:
 *   f(p) = cos(k d1.p) + cos(k d2.p) + cos(k d3.p)
 * Nodal lines (f ~ 0) are where particles settle under acoustic excitation:
 * the mask. Antinodes (|f| maxima) are the pads — sub-nodes of the face.
 * Sub-addresses derive from the parent face ID + quantised nodal
 * coordinates, so UUID routing holds at every density the mask reaches.
 */

const FACE_INDEX = 1234;
const FACE_ID = spatialId(1.0, 1, FACE_INDEX, [0.2679, 0.5345, 0.7954]);

type Pt = { x: number; y: number; i: number; j: number };

function hexContains(x: number, y: number, R: number): boolean {
  // Pointy-top hex, circumradius R: inside iff |p.n| <= apothem for the
  // three edge normals at 0, 60, 120 degrees. Matches the drawn outline.
  const a = 0.8660254 * R;
  return (
    Math.abs(x) <= a &&
    Math.abs(0.5 * x + 0.8660254 * y) <= a &&
    Math.abs(-0.5 * x + 0.8660254 * y) <= a
  );
}

export default function Chladni() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState(22);
  const [harmonic, setHarmonic] = useState(true);
  const [showTraces, setShowTraces] = useState(true);
  const [log, setLog] = useState<string[]>([
    'MASK_INIT: face field solved — nodal lines are the mask; antinodes are the pads.',
  ]);
  const [route, setRoute] = useState<Pt[] | null>(null);
  const [tick, setTick] = useState(0);
  const routeT = useRef(0);

  const field = useMemo(() => {
    const RES = 150;
    const f = new Float32Array(RES * RES);
    const inside = new Uint8Array(RES * RES);
    const d = [
      [1, 0],
      [0.5, Math.sqrt(3) / 2],
      [-0.5, Math.sqrt(3) / 2],
    ];
    let fmax = 0.0001;
    for (let j = 0; j < RES; j++) {
      for (let i = 0; i < RES; i++) {
        const x = (i / (RES - 1)) * 2 - 1;
        const y = (j / (RES - 1)) * 2 - 1;
        const idx = j * RES + i;
        if (!hexContains(x, y, 0.98)) continue;
        inside[idx] = 1;
        let v = 0;
        for (const [dx, dy] of d) v += Math.cos(k * (dx * x + dy * y));
        if (harmonic) {
          const k2 = k * 1.7015;
          for (const [dx, dy] of d) v += 0.35 * Math.cos(k2 * (dx * x + dy * y) + 0.7);
        }
        f[idx] = v;
        if (Math.abs(v) > fmax) fmax = Math.abs(v);
      }
    }
    // antinode pads: local maxima of |f| above 72% of max, min separation 7 cells
    const pads: Pt[] = [];
    for (let j = 3; j < RES - 3; j++) {
      for (let i = 3; i < RES - 3; i++) {
        const idx = j * RES + i;
        if (!inside[idx]) continue;
        const v = Math.abs(f[idx]);
        if (v < 0.68 * fmax) continue;
        let isMax = true;
        for (let dj = -2; dj <= 2 && isMax; dj++)
          for (let di = -2; di <= 2; di++)
            if (Math.abs(f[(j + dj) * RES + (i + di)]) > v) { isMax = false; break; }
        if (!isMax) continue;
        const x = (i / (RES - 1)) * 2 - 1;
        const y = (j / (RES - 1)) * 2 - 1;
        if (pads.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < 0.012)) continue;
        pads.push({ x, y, i, j });
      }
    }
    return { f, inside, RES, fmax, pads };
  }, [k, harmonic]);

  // draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { f, inside, RES, fmax, pads } = field;
    const W = canvas.width, H = canvas.height;
    const img = ctx.createImageData(W, H);
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const o = (py * W + px) * 4;
        const gx = Math.floor((px / W) * RES), gy = Math.floor((py / H) * RES);
        const idx = gy * RES + gx;
        if (!inside[idx]) { img.data[o + 3] = 0; continue; }
        const v = f[idx] / fmax;
        const nodal = Math.abs(v) < 0.09;
        let r = 16, g = 17, b = 20;
        const glow = Math.abs(v);
        r += glow * 52; g += glow * 56; b += glow * 64;
        if (showTraces && nodal) { r = 196; g = 200; b = 208; }
        img.data[o] = r; img.data[o + 1] = g; img.data[o + 2] = b; img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // hex boundary
    ctx.strokeStyle = 'rgba(226,228,233,0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let s = 0; s <= 6; s++) {
      const a = (Math.PI / 3) * s + Math.PI / 6;
      const x = (W / 2) + Math.cos(a) * W * 0.49;
      const y = (H / 2) + Math.sin(a) * H * 0.49;
      if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // pads
    ctx.fillStyle = '#e2e4e9';
    for (const p of pads) {
      ctx.beginPath();
      ctx.arc((p.x + 1) / 2 * W, (p.y + 1) / 2 * H, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // route
    if (route && route.length > 1) {
      const n = Math.max(2, Math.floor(routeT.current * route.length));
      ctx.strokeStyle = '#C9A227';
      ctx.lineWidth = 2;
      ctx.beginPath();
      route.slice(0, n).forEach((p, idx) => {
        const x = (p.x + 1) / 2 * W, y = (p.y + 1) / 2 * H;
        if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      const head = route[Math.min(n - 1, route.length - 1)];
      ctx.fillStyle = '#C9A227';
      ctx.beginPath();
      ctx.arc((head.x + 1) / 2 * W, (head.y + 1) / 2 * H, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [field, showTraces, route, tick]);

  // route animation: advance routeT and bump tick to redraw
  useEffect(() => {
    if (!route) return;
    let raf = 0;
    const step = () => {
      routeT.current = Math.min(1, routeT.current + 0.01);
      setTick((t) => t + 1);
      if (routeT.current < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [route]);

  const subId = (p: Pt) =>
    `${FACE_ID.slice(0, 13)}-${((p.i * 977 + p.j * 331) % 0xffff).toString(16).padStart(4, '0')}`;

  const runRoute = () => {
    const pads = field.pads;
    if (pads.length < 2) return;
    const start = pads.reduce((a, b) => (a.x + a.y < b.x + b.y ? a : b));
    const goal = pads.reduce((a, b) => (a.x + a.y > b.x + b.y ? a : b));
    // BFS over pad adjacency (nearest-neighbour graph)
    const adj = new Map<Pt, Pt[]>();
    for (const p of pads) {
      adj.set(p, pads.filter((q) => q !== p)
        .map((q) => ({ q, d: (q.x - p.x) ** 2 + (q.y - p.y) ** 2 }))
        .sort((a, b) => a.d - b.d).slice(0, 3).map((e) => e.q));
    }
    const prev = new Map<Pt, Pt | null>([[start, null]]);
    const queue = [start];
    while (queue.length) {
      const cur = queue.shift()!;
      if (cur === goal) break;
      for (const nb of adj.get(cur) ?? []) {
        if (!prev.has(nb)) { prev.set(nb, cur); queue.push(nb); }
      }
    }
    if (!prev.has(goal)) { setLog((l) => ['ROUTE_FAIL: pad graph disconnected at this mode — raise density or drop the harmonic.', ...l].slice(0, 7)); return; }
    const path: Pt[] = [];
    let cur: Pt | null = goal;
    while (cur) { path.unshift(cur); cur = prev.get(cur) ?? null; }
    routeT.current = 0;
    setRoute(path);
    setLog((l) => [
      `ROUTE: ${path.length} hops across the mask, face ${FACE_ID.slice(0, 8)}…`,
      ...path.slice(0, 4).map((p, idx) => `  hop ${idx}: sub ${subId(p)} · nodal (${p.i}, ${p.j})`),
      path.length > 4 ? `  … ${path.length - 4} more hops, every sub-address derived from the face ID` : '',
      ...l,
    ].filter(Boolean).slice(0, 8));
  };

  const padsPerFace = field.pads.length;

  return (
    <div className="sim-grid">
      <div className="panel canvas-panel">
        <canvas ref={canvasRef} width={560} height={560} />
        <div className="cap">ONE HEX FACE · CYMATIC MASK FIELD · NODAL LINES = TRACES · DOTS = ANTINODE PADS</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="panel">
          <h3>Mask controls</h3>
          <label>Wavenumber k = {k} — the mode the face is driven at</label>
          <input type="range" min={6} max={30} step={1} value={k}
            onChange={(e) => { setK(Number(e.target.value)); setRoute(null); }} />
          <label>Second harmonic (k × 1.70, phase-shifted)</label>
          <div className="row">
            <button className="btn" onClick={() => { setHarmonic((h) => !h); setRoute(null); }}>
              {harmonic ? 'On' : 'Off'}
            </button>
            <button className="btn" onClick={() => setShowTraces((s) => !s)}>
              Nodal traces {showTraces ? 'shown' : 'hidden'}
            </button>
          </div>
          <label>Route a packet across the pads</label>
          <div className="row">
            <button className="btn gold" onClick={runRoute}>Route packet</button>
          </div>
          <p className="faint" style={{ fontSize: '0.72rem', marginBottom: 0 }}>
            The pattern is computed from the field equation, not drawn. Change k and the
            circuit changes — the addressing does not: every pad's sub-address derives
            from the parent face ID plus its quantised nodal coordinates.
          </p>
        </div>
        <div className="panel">
          <h3>Density — computed</h3>
          <div className="kv"><span>Pads on this face</span><span className="v">{padsPerFace}</span></div>
          <div className="kv"><span>Geodesic nodes, same face (no mask)</span><span className="v">1</span></div>
          <div className="kv"><span>Density multiplier</span><span className="v">{padsPerFace}×</span></div>
          <div className="kv"><span>Addressable points, full skin @ n=1 (80 faces)</span><span className="v">{(80 * padsPerFace).toLocaleString()}</span></div>
          <div className="kv"><span>Addressable points, full skin @ n=2 (320 faces)</span><span className="v">{(320 * padsPerFace).toLocaleString()}</span></div>
          <div className="kv"><span>Parent face ID</span><span className="v" style={{ fontSize: '0.68rem' }}>{FACE_ID.slice(0, 18)}…</span></div>
        </div>
        <div className="panel">
          <h3>Mask log</h3>
          <div className="log">
            {log.map((line, i) => <div key={i} className="line">{line}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
