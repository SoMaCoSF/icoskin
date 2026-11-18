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

      // Core
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
    <div className="min-h-screen bg-[#030712] text-slate-300">
      <header className="border-b border-cyan-900/60 bg-slate-900/40 backdrop-blur sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/20" />
          <div>
            <h1 className="text-white font-bold tracking-wider text-lg">ICOSKIN</h1>
            <p className="text-xs text-cyan-400 font-mono">Spatially Addressed Smart Compute Skin</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <span className="text-emerald-400">VAC 10^-7 Torr</span>
          <span className="text-cyan-400">SHELLS {shells}</span>
          <span className="text-amber-400">NODES {(shells * 320).toLocaleString()}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 space-y-6">
          <div className="border border-cyan-800/40 rounded-xl p-6 bg-slate-900/50">
            <h2 className="text-2xl font-bold text-white mb-3">The Hull Is the Sensor</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              IcoSkin is a multi-shell geodesic smart skin that unifies structural load-bearing, thermal isolation, power harvesting, and spatially addressed sensing. Fe-BMG vertex nodes provide local magnetic sensing and sparse non-volatile flags rather than dense primary memory. On power cycle the skin self-diagnoses; each sector can carry its own repair packet latched in the material.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={powerCycle} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm font-medium transition shadow-lg shadow-cyan-600/20">
                Simulate Power Cycle
              </button>
              <span className="text-amber-400 font-mono text-sm">{sector}</span>
              <span className="text-emerald-400 font-mono text-sm">Integrity {integrity}%</span>
            </div>
          </div>

          <div className="border border-cyan-800/40 rounded-xl overflow-hidden bg-slate-950 relative h-[520px]">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute bottom-4 left-4 text-xs font-mono text-cyan-400">
              Interactive geodesic shells · Fe-BMG vertex nodes · spatial UUID addressing
            </div>
          </div>

          <div className="border border-cyan-800/40 rounded-xl p-5 bg-slate-900/50">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Diagnostic Stream</h3>
            <div className="font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
              {log.map((line, i) => (
                <div key={i} className="text-slate-400">{line}</div>
              ))}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-4">
          <div className="border border-cyan-800/40 rounded-xl p-4 bg-slate-900/50">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Skin Parameters</h3>
            <label className="text-xs text-slate-400 block mb-1">Geodesic Shell Layers: {shells}</label>
            <input type="range" min={1} max={5} value={shells} onChange={(e) => setShells(+e.target.value)} className="w-full accent-cyan-500" />
            <p className="text-[10px] text-slate-500 mt-2">Concentric icospheric shells with vacuum-aerogel interstitials.</p>
          </div>

          <div className="border border-cyan-800/40 rounded-xl p-4 bg-slate-900/50 text-xs space-y-2">
            <div className="text-cyan-400 font-semibold">Feasibility Truth Study</div>
            <p>Dense inductive BMG core memory is the weak near-term claim. Distributed magnetic sensing, structural integrity flags, particle-flux detection, and sparse non-volatile repair packets are the strong claim.</p>
            <p>Spatial UUID addressing derived from geodesic coordinates makes sector-level diagnostics and local repair storage native to the topology.</p>
          </div>

          <div className="border border-amber-800/40 rounded-xl p-4 bg-slate-900/50">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Funding Ask</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Support materials process development on Fe-BMG micro-coils, hybrid volumetric + LPBF coupons, vacuum-aerogel multi-shell sections, and spatial UUID firmware for geodesic node addressing.
            </p>
          </div>

          <div className="border border-cyan-800/40 rounded-xl p-4 bg-slate-900/50 text-xs">
            <div className="text-emerald-400 font-semibold mb-2">Material Stack</div>
            <ul className="space-y-1 text-slate-400">
              <li>Outer: CNT geodesic lattice</li>
              <li>Power: Flexible OPV arrays</li>
              <li>Thermal: Evacuated aerogel + B/Ga</li>
              <li>Nodes: Iron-BMG inductive sensors</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="border-t border-cyan-900/50 mt-8 py-6 text-center text-xs text-slate-500 font-mono">
        IcoSkin · SoMaCo spatial primitives · icoskin.somacosf.com
      </footer>
    </div>
  );
}