'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shells, setShells] = useState(3);
  const [integrity, setIntegrity] = useState(100);
  const [sector, setSector] = useState('Sector 2: Nominal');
  const [log, setLog] = useState<string[]>(['SYS_INIT: IcoSkin explorer online']);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rot = 0;
    let raf: number;

    const draw = () => {
      const w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
      const h = (canvas.height = canvas.offsetHeight * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const cx = canvas.offsetWidth / 2;
      const cy = canvas.offsetHeight / 2;

      for (let s = 0; s < shells; s++) {
        const r = 70 + s * 45;
        ctx.strokeStyle = s === shells - 1 ? '#06b6d4' : '#10b981';
        ctx.lineWidth = s === shells - 1 ? 2 : 1;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 12; i++) {
          const a = rot + (i / 12) * Math.PI * 2;
          const x = cx + Math.cos(a) * r * 0.92;
          const y = cy + Math.sin(a) * r * 0.65;
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 28);
      grad.addColorStop(0, 'rgba(16,185,129,0.9)');
      grad.addColorStop(1, 'rgba(3,7,18,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fill();

      rot += 0.004;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [shells]);

  const powerCycle = () => {
    setIntegrity(30);
    setSector('Sector 2 integrity 30% — repair packet latched');
    setLog((l) => ['POWER_CYCLE: Diagnostic sweep complete', 'SECTOR_2: Integrity 30% — repair guide present', ...l].slice(0, 8));
    setTimeout(() => {
      setIntegrity(100);
      setSector('Sector 2: Nominal (reset)');
      setLog((l) => ['RESET: Sector nominal', ...l].slice(0, 8));
    }, 4500);
  };

  return (
    <div>
      <header>
        <div className="header-left">
          <div className="logo" />
          <div>
            <h1>ICOSKIN</h1>
            <p className="subtitle">Spatially Addressed Smart Compute Skin</p>
          </div>
        </div>
        <div className="stats">
          <span className="emerald">VAC 10^-7 Torr</span>
          <span className="cyan">SHELLS {shells}</span>
          <span className="amber">NODES {(shells * 320).toLocaleString()}</span>
        </div>
      </header>

      <main>
        <section>
          <div className="panel">
            <h2>The Hull Is the Sensor</h2>
            <p>
              IcoSkin is a multi-shell geodesic smart skin that unifies structural load-bearing, thermal isolation, power harvesting, and spatially addressed sensing. Fe-BMG vertex nodes provide local magnetic sensing and sparse non-volatile flags rather than dense primary memory. On power cycle the skin self-diagnoses; each sector can carry its own repair packet latched in the material.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
              <button className="btn" onClick={powerCycle}>Simulate Power Cycle</button>
              <span className="amber font-mono" style={{ fontSize: '0.875rem' }}>{sector}</span>
              <span className="emerald font-mono" style={{ fontSize: '0.875rem' }}>Integrity {integrity}%</span>
            </div>
          </div>

          <div className="canvas-wrap" style={{ marginTop: '1.5rem' }}>
            <canvas ref={canvasRef} />
            <div className="canvas-label">Interactive geodesic shells · Fe-BMG vertex nodes · spatial UUID addressing</div>
          </div>

          <div className="panel" style={{ marginTop: '1.5rem' }}>
            <h3>Diagnostic Stream</h3>
            <div className="log">
              {log.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        </section>

        <aside className="aside">
          <div className="small-panel">
            <h3>Skin Parameters</h3>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Geodesic Shell Layers: {shells}</label>
            <input type="range" min={1} max={5} value={shells} onChange={(e) => setShells(+e.target.value)} />
            <p style={{ fontSize: '0.625rem', color: '#64748b', marginTop: '0.5rem' }}>Concentric icospheric shells with vacuum-aerogel interstitials.</p>
          </div>

          <div className="small-panel">
            <div style={{ color: '#22d3ee', fontWeight: 600, marginBottom: '0.5rem' }}>Feasibility Truth Study</div>
            <p style={{ fontSize: '0.75rem' }}>Dense inductive BMG core memory is the weak near-term claim. Distributed magnetic sensing, structural integrity flags, particle-flux detection, and sparse non-volatile repair packets are the strong claim.</p>
            <p style={{ fontSize: '0.75rem' }}>Spatial UUID addressing derived from geodesic coordinates makes sector-level diagnostics and local repair storage native to the topology.</p>
          </div>

          <div className="small-panel funding">
            <h3>Funding Ask</h3>
            <p style={{ fontSize: '0.75rem' }}>
              Support materials process development on Fe-BMG micro-coils, hybrid volumetric + LPBF coupons, vacuum-aerogel multi-shell sections, and spatial UUID firmware for geodesic node addressing.
            </p>
          </div>

          <div className="small-panel">
            <div style={{ color: '#34d399', fontWeight: 600, marginBottom: '0.5rem' }}>Material Stack</div>
            <ul>
              <li>Outer: CNT geodesic lattice</li>
              <li>Power: Flexible OPV arrays</li>
              <li>Thermal: Evacuated aerogel + B/Ga</li>
              <li>Nodes: Iron-BMG inductive sensors</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer>IcoSkin · SoMaCo spatial primitives · icoskin.somacosf.com</footer>
    </div>
  );
}