'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildMesh, counts, edgeNeighbours, latLon, nodePosition, spatialId, SHELLS,
  type Face, type Vec3,
} from '../lib/ico';

interface Flags { event: boolean; state: boolean; orient: boolean }
const NOFLAGS: Flags = { event: false, state: false, orient: false };

interface Sel { shell: number; face: number }

function fmt(n: number, d = 3): string {
  return n.toFixed(d);
}

export default function Simulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [level, setLevel] = useState(1);
  const [shellCount, setShellCount] = useState(2);
  const [spin, setSpin] = useState(true);
  const [cymatic, setCymatic] = useState(false);
  const [sel, setSel] = useState<Sel | null>(null);
  const [flags, setFlags] = useState<Map<string, Flags>>(new Map());
  const [integrity, setIntegrity] = useState(100);
  const [log, setLog] = useState<string[]>([
    'SYS_INIT: IcoSkin instrument online — mesh derived from coordinates, no registry',
  ]);
  const flagsRef = useRef(flags);
  flagsRef.current = flags;
  const selRef = useRef(sel);
  selRef.current = sel;
  const spinRef = useRef(spin);
  spinRef.current = spin;
  const cymRef = useRef(cymatic);
  cymRef.current = cymatic;

  const mesh = useMemo(() => buildMesh(level), [level]);
  const c = useMemo(() => counts(level), [level]);
  const shells = SHELLS.slice(0, shellCount);
  const activeShell = shellCount >= 2 ? 1 : 0;

  const key = (s: number, f: number) => `${s}:${f}`;
  const getFlags = (s: number, f: number): Flags => flags.get(key(s, f)) ?? NOFLAGS;

  const pushLog = (lines: string[]) =>
    setLog((l) => [...lines, ...l].slice(0, 9));

  // --- canvas render loop -------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let rot = 0;
    let raf = 0;

    const project = (p: Vec3, w: number, h: number, scale: number) => {
      const cy = Math.cos(rot), sy = Math.sin(rot);
      const x1 = p[0] * cy + p[2] * sy;
      const z1 = -p[0] * sy + p[2] * cy;
      const tilt = 0.45, ct = Math.cos(tilt), st = Math.sin(tilt);
      const y2 = p[1] * ct - z1 * st;
      const z2 = p[1] * st + z1 * ct;
      return { x: w / 2 + x1 * scale, y: h / 2 - y2 * scale, z: z2 };
    };

    const draw = () => {
      const w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
      const h = (canvas.height = canvas.offsetHeight * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      const scale = Math.min(W, H) / 2 / 2.35;

      // collect faces across shells, painter-sort far -> near
      interface D { pts: { x: number; y: number; z: number }[]; z: number; shell: number; face: Face }
      const all: D[] = [];
      shells.forEach((sh, si) => {
        for (const f of mesh.faces) {
          const pts = f.v.map((vi) => project(nodePosition(mesh.vertices[vi], sh.t), W, H, scale));
          const z = pts.reduce((a, p) => a + p.z, 0) / 3;
          all.push({ pts, z, shell: si, face: f });
        }
      });
      all.sort((a, b) => a.z - b.z);

      for (const d of all) {
        const front = d.z > -0.15;
        const isSel = selRef.current && selRef.current.shell === d.shell && selRef.current.face === d.face.index;
        ctx.beginPath();
        ctx.moveTo(d.pts[0].x, d.pts[0].y);
        ctx.lineTo(d.pts[1].x, d.pts[1].y);
        ctx.lineTo(d.pts[2].x, d.pts[2].y);
        ctx.closePath();
        const depth = Math.max(0, Math.min(1, (d.z + 2.2) / 4.4));
        ctx.fillStyle = isSel
          ? 'rgba(201,162,39,0.20)'
          : `rgba(230,230,230,${0.015 + depth * 0.05})`;
        ctx.fill();
        ctx.strokeStyle = isSel ? '#c9a227' : front ? 'rgba(160,160,160,0.5)' : 'rgba(120,120,120,0.18)';
        ctx.lineWidth = isSel ? 1.6 : 0.6;
        ctx.stroke();

        // node dot at centroid
        const cd = project(nodePosition(d.face.dir, SHELLS[d.shell].t), W, H, scale);
        const fl = flagsRef.current.get(`${d.shell}:${d.face.index}`);
        const r = isSel ? 4 : 2.2;
        ctx.beginPath();
        ctx.arc(cd.x, cd.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isSel
          ? '#c9a227'
          : fl?.event
            ? 'oklch(0.68 0.21 27)'
            : fl?.state
              ? 'oklch(0.78 0.16 62)'
              : front
                ? 'rgba(210,210,210,0.75)'
                : 'rgba(150,150,150,0.3)';
        ctx.fill();

        // cymatic nodal pattern on the selected face (schematic standing wave)
        if (isSel && cymRef.current) {
          const [a, b, cc] = d.pts;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(cc.x, cc.y); ctx.closePath();
          ctx.clip();
          ctx.strokeStyle = 'rgba(140,220,255,0.55)';
          ctx.lineWidth = 0.7;
          for (let i = 1; i <= 5; i++) {
            const u = i / 6;
            ctx.beginPath();
            ctx.moveTo(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u);
            ctx.lineTo(a.x + (cc.x - a.x) * u, a.y + (cc.y - a.y) * u);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(b.x + (a.x - b.x) * u, b.y + (a.y - b.y) * u);
            ctx.lineTo(b.x + (cc.x - b.x) * u, b.y + (cc.y - b.y) * u);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      if (spinRef.current) rot += 0.0035;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesh, shellCount]);

  // --- interaction ----------------------------------------------------------
  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    // Pick the nearest projected centroid (front hemisphere) from the picking loop's store.
    const store = projStore.current;
    let best: { s: number; f: number; d: number } | null = null;
    for (const p of store) {
      const dd = Math.hypot(p.x - mx, p.y - my);
      if (dd < 26 && (!best || dd < best.d)) best = { s: p.s, f: p.f, d: dd };
    }
    if (best) {
      setSel({ shell: best.s, face: best.f });
      const face = mesh.faces[best.f];
      const id = spatialId(SHELLS[best.s].t, level, best.f, face.dir);
      pushLog([`INSPECT f=${best.f} shell=${best.s} id=${id.slice(0, 13)}…`]);
    }
  };

  // screen-space centroid projections, refreshed each frame for picking
  const projStore = useRef<{ x: number; y: number; s: number; f: number }[]>([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let rot = 0;
    let raf = 0;
    const tick = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      const scale = Math.min(W, H) / 2 / 2.35;
      const cy = Math.cos(rot), sy = Math.sin(rot);
      const tilt = 0.45, ct = Math.cos(tilt), st = Math.sin(tilt);
      const out: { x: number; y: number; s: number; f: number }[] = [];
      shells.forEach((sh, si) => {
        for (const f of mesh.faces) {
          const p = nodePosition(f.dir, sh.t);
          const x1 = p[0] * cy + p[2] * sy;
          const z1 = -p[0] * sy + p[2] * cy;
          const y2 = p[1] * ct - z1 * st;
          const z2 = p[1] * st + z1 * ct;
          if (z2 > 0) out.push({ x: W / 2 + x1 * scale, y: H / 2 - y2 * scale, s: si, f: f.index });
        }
      });
      projStore.current = out;
      if (spinRef.current) rot += 0.0035;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesh, shellCount]);

  const setFlag = (patch: Partial<Flags>) => {
    if (!sel) return;
    setFlags((prev) => {
      const next = new Map(prev);
      const cur = next.get(key(sel.shell, sel.face)) ?? { ...NOFLAGS };
      next.set(key(sel.shell, sel.face), { ...cur, ...patch });
      return next;
    });
  };

  const injectEvent = () => {
    const f = Math.floor(Math.random() * mesh.faces.length);
    const s = activeShell;
    const nb = edgeNeighbours(mesh, f);
    setFlags((prev) => {
      const next = new Map(prev);
      const cur = next.get(key(s, f)) ?? { ...NOFLAGS };
      next.set(key(s, f), { ...cur, event: true });
      for (const j of nb) {
        const ncur = next.get(key(s, j)) ?? { ...NOFLAGS };
        next.set(key(s, j), { ...ncur, state: true });
      }
      return next;
    });
    const id = spatialId(SHELLS[s].t, level, f, mesh.faces[f].dir);
    pushLog([
      `PARTICLE_EVENT shell=${s} f=${f} — flag latched at node`,
      `AGGREGATE: ${nb.length} edge-neighbours threshold-checked in place, no raw data hauled`,
      `ROUTE ${id.slice(0, 13)}… → bus: 1 sparse event packet`,
    ]);
    setSel({ shell: s, face: f });
  };

  const powerCycle = () => {
    setIntegrity(30);
    pushLog([
      'POWER_CYCLE: diagnostic sweep across shells',
      `SECTOR SWEEP: integrity 30% — sparse flags read from material, repair packet present at sector nodes`,
    ]);
    setTimeout(() => {
      setIntegrity(100);
      pushLog(['RESET: sector nominal — flags re-read, no central state required']);
    }, 4500);
  };

  const selFace: Face | null = sel ? mesh.faces[sel.face] : null;
  const selId = sel && selFace ? spatialId(SHELLS[sel.shell].t, level, sel.face, selFace.dir) : null;
  const selLL = selFace ? latLon(selFace.dir) : null;
  const selFlags = sel ? getFlags(sel.shell, sel.face) : NOFLAGS;
  const selNeighbours = useMemo(
    () => (sel ? edgeNeighbours(mesh, sel.face) : []),
    [mesh, sel],
  );

  return (
    <div className="grid-main">
      <section>
        <div className="canvas-wrap">
          <canvas ref={canvasRef} onClick={onClick} />
          <div className="canvas-label">
            <span>GEODESIC MESH · n={level} · {c.faces} FACES / SHELL · CLICK A NODE TO INSPECT</span>
            <span>{cymatic ? 'CYMATIC OVERLAY: SCHEMATIC NODAL PATTERN' : ''}</span>
          </div>
        </div>

        <div className="panel" style={{ marginTop: 18 }}>
          <h3>Diagnostic Stream</h3>
          <div className="log">
            {log.map((line, i) => (
              <div key={i} style={i === 0 ? { color: 'var(--fg)' } : undefined}>{line}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            <button className="btn" onClick={injectEvent}>Inject Particle Event</button>
            <button className="btn" onClick={powerCycle}>Simulate Power Cycle</button>
            <span className={integrity < 100 ? 'warn' : 'ok'} style={{ fontSize: '0.8rem', alignSelf: 'center' }}>
              SKIN INTEGRITY {integrity}%
            </span>
          </div>
        </div>
      </section>

      <aside className="stack">
        <div className="small-panel">
          <h3>Mesh Controls</h3>
          <label className="lbl">Subdivision level n = {level} · faces {c.faces} · vertices {c.vertices}</label>
          <input type="range" min={0} max={2} value={level}
            onChange={(e) => { setLevel(+e.target.value); setSel(null); }} />
          <label className="lbl">Shells: {shellCount} (radii t = {shells.map((s) => s.t.toFixed(2)).join(' · ')})</label>
          <input type="range" min={1} max={3} value={shellCount}
            onChange={(e) => { setShellCount(+e.target.value); setSel(null); }} />
          <label className="lbl">Rotation</label>
          <button className="btn" onClick={() => setSpin(!spin)}>{spin ? 'Pause' : 'Resume'}</button>
          <label className="lbl">Cymatic overlay (selected face)</label>
          <button className="btn" onClick={() => setCymatic(!cymatic)}>{cymatic ? 'Hide' : 'Show'}</button>
          <p className="faint" style={{ fontSize: '0.68rem', marginTop: 10, marginBottom: 0 }}>
            Counts are computed live from F = 20·4ⁿ, V = 10·4ⁿ + 2, E = 30·4ⁿ — the same
            formulas tabulated in §1. Nothing on this page is a typed-in number.
          </p>
        </div>

        <div className="small-panel">
          <h3>Node Inspector</h3>
          {sel && selFace && selId && selLL ? (
            <>
              <dl className="kv">
                <dt>SPATIAL ID</dt><dd className="gold">{selId}</dd>
                <dt>ID CLASS</dt><dd>PROVISIONAL — derived from coordinates, pre-mint</dd>
                <dt>SHELL</dt><dd>{SHELLS[sel.shell].name} (t = {SHELLS[sel.shell].t.toFixed(2)})</dd>
                <dt>FACE</dt><dd>f = {sel.face} of {c.faces}</dd>
                <dt>RAY n̂</dt><dd>({fmt(selFace.dir[0])}, {fmt(selFace.dir[1])}, {fmt(selFace.dir[2])})</dd>
                <dt>LAT / LON</dt><dd>{fmt(selLL.lat, 2)}° / {fmt(selLL.lon, 2)}°</dd>
                <dt>FACE AREA</dt><dd>{fmt(selFace.areaUnit * SHELLS[sel.shell].t * SHELLS[sel.shell].t, 4)} unit² (× t²)</dd>
                <dt>NEIGHBOURS</dt><dd>{selNeighbours.length} edge-adjacent faces</dd>
                <dt>FLAGS</dt>
                <dd>
                  <span className={selFlags.event ? 'danger' : 'faint'}>EVENT {selFlags.event ? '1' : '0'}</span>{' · '}
                  <span className={selFlags.state ? 'warn' : 'faint'}>STATE {selFlags.state ? '1' : '0'}</span>{' · '}
                  <span className={selFlags.orient ? 'ok' : 'faint'}>ORIENT {selFlags.orient ? '1' : '0'}</span>
                </dd>
              </dl>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                <button className="btn" onClick={() => setFlag({ event: !selFlags.event })}>Toggle EVENT</button>
                <button className="btn" onClick={() => setFlag({ state: !selFlags.state })}>Toggle STATE</button>
                <button className="btn" onClick={() => setFlag({ orient: !selFlags.orient })}>Toggle ORIENT</button>
              </div>
              <p className="faint" style={{ fontSize: '0.68rem', marginTop: 10, marginBottom: 0 }}>
                Three flag bits per node is the whole memory claim: event, state, orientation —
                latched in the material, read inductively, addressed by position.
              </p>
            </>
          ) : (
            <p style={{ marginBottom: 0 }}>
              No node selected. Click any vertex node on the mesh — its identity is computed
              from its position on the shell, not looked up.
            </p>
          )}
        </div>

        <div className="small-panel">
          <h3>Readouts · n = {level}</h3>
          <dl className="kv">
            <dt>NODES / SHELL</dt><dd>{c.faces} (one per face)</dd>
            <dt>DUAL CELLS</dt><dd>{c.dualCells} = 12 pentagons + {c.hexagons} hexagons</dd>
            <dt>MEAN FACE AREA</dt><dd>{fmt(c.meanFaceAreaUnit, 4)} sr (unit sphere)</dd>
            <dt>AT R = 1 m</dt><dd>{fmt(c.meanFaceAreaUnit, 3)} m² per face</dd>
            <dt>AT R = 10 m</dt><dd>{fmt(c.meanFaceAreaUnit * 100, 2)} m² per face</dd>
            <dt>NODE SPACING</dt><dd>{fmt(c.meanNodeSpacingRad, 3)} rad ≈ {fmt(2 * Math.sin(c.meanNodeSpacingRad / 2) * 10, 2)} m at R = 10 m</dd>
          </dl>
        </div>
      </aside>
    </div>
  );
}
