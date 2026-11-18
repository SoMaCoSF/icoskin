import Simulator from './Simulator';
import { counts } from '../lib/ico';

function TopoTable() {
  const rows = [0, 1, 2, 3, 4].map((n) => ({ n, ...counts(n) }));
  return (
    <table>
      <thead>
        <tr>
          <th>Level n</th><th className="n">Faces F = 20·4ⁿ</th><th className="n">Vertices V = 10·4ⁿ+2</th>
          <th className="n">Edges E = 30·4ⁿ</th><th className="n">Hex cells (dual)</th>
          <th className="n">Mean face area @ R=1 m</th><th className="n">Node spacing @ R=10 m</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.n}>
            <td>n = {r.n}</td>
            <td className="n">{r.faces.toLocaleString()}</td>
            <td className="n">{r.vertices.toLocaleString()}</td>
            <td className="n">{r.edges.toLocaleString()}</td>
            <td className="n">{r.hexagons.toLocaleString()} + 12 pent</td>
            <td className="n">{r.meanFaceAreaUnit.toFixed(4)} m²</td>
            <td className="n">{(2 * Math.sin(r.meanNodeSpacingRad / 2) * 10).toFixed(2)} m</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const LAYERS: { name: string; material: string; fn: string; process: string; grade: string; cls: string }[] = [
  { name: 'Outer lattice', material: 'CNT geodesic lattice', fn: 'Load-bearing protection; the structure itself', process: 'Printed / laid lattice, CAL precursor + infiltration', grade: 'TRL 3–4', cls: 'warn' },
  { name: 'Power', material: 'Flexible OPV arrays', fn: 'Power harvested per hex face, used where it is generated', process: 'Laminated flexible photovoltaic film', grade: 'TRL 4–5', cls: 'warn' },
  { name: 'Bus', material: 'Mycelial CNT network', fn: 'Low-rate power + data; topology-native routing', process: 'Printed conductive CNT traces', grade: 'TRL 3', cls: 'warn' },
  { name: 'Nodes', material: 'Fe-BMG inductive elements', fn: 'Sparse magnetic sensing + 3-bit non-volatile flags at vertices / hex faces', process: 'LPBF of Fe-Si-B-Nb-Ni; hybrid embed of pre-printed elements', grade: 'TRL 3–4', cls: 'warn' },
  { name: 'Patterning', material: 'Cymatic (Chladni) standing waves', fn: 'Bias CNT / precursor alignment on hex faces during fabrication', process: 'Multi-frequency acoustic transducers in resin bath', grade: 'SPECULATIVE', cls: 'danger' },
  { name: 'Sensing dopants', material: 'B-10 / Ga-71 doped regions', fn: 'Neutron capture + particle-flux detection, intrinsically located', process: 'Doped precursor regions in aerogel / core matrix', grade: 'TRL 2–3', cls: 'warn' },
  { name: 'Thermal', material: 'Evacuated aerogel interstitials', fn: 'Thermal isolation + structural grout between shells', process: 'Aerogel infiltration, sealed + evacuated', grade: 'TRL 3', cls: 'warn' },
  { name: 'Inner lattice', material: 'CNT geodesic lattice', fn: 'Inner structural shell; completes the multi-shell icosphere', process: 'As outer lattice', grade: 'TRL 3–4', cls: 'warn' },
];

export default function Home() {
  return (
    <div className="wrap">
      <header className="top">
        <div className="wordmark">
          <div className="logo" />
          <div>
            <div style={{ fontSize: '1.3rem', color: 'var(--fg)', letterSpacing: '0.06em', fontWeight: 600 }}>ICOSKIN</div>
            <div className="subtitle">Spatially Addressed Smart Compute Skin</div>
          </div>
        </div>
        <div className="stats">
          <span className="ok">ADDRESSING: SOFTWARE-PROVEN</span>
          <span className="warn">COMPONENTS: TRL 3–5</span>
          <span className="warn">INTEGRATED SKIN: TRL 1–2</span>
          <span className="faint">SOMACOSF</span>
        </div>
      </header>

      <div className="hero">
        <h1>THE SKIN IS THE<br />ADDRESS SPACE</h1>
        <p className="claim" style={{ marginTop: 16 }}>
          Every vertex is an address. Every hex face is a sensor. Every flag is a memory.
        </p>
        <p className="sub">
          IcoSkin is a multi-shell geodesic skin that unifies structural load-bearing, thermal isolation,
          power harvesting, and spatially addressed sensing in one printed object. Iron-based bulk metallic
          glass (Fe-BMG) elements at the vertices and hex faces provide local magnetic sensing and sparse
          non-volatile flags — not dense memory. Each node's identity is a deterministic spatial UUID derived
          from its position on the icosphere. There is no ID registry, no overlay network, and no central
          coordinator: sensor data is intrinsically located because the hull is the coordinate system.
        </p>
        <p className="sub faint">
          This page is a materials brief, not a poster. Every number below is either computed live from the
          topology, graded against the published record, or explicitly marked as not yet known. §3 states
          what we will not claim.
        </p>
      </div>

      <Simulator />

      <section className="brief">
        <h2>§1 · TOPOLOGY MATH</h2>
        <p className="lede">
          The mesh is a subdivided icosphere. Subdivision level n splits every edge 2ⁿ times, giving closed-form
          counts — F = 20·4ⁿ faces, V = 10·4ⁿ + 2 vertices, E = 30·4ⁿ edges (Euler: V − E + F = 2 at every level).
          The dual Goldberg mesh has one cell per primal vertex: exactly 12 pentagons — a topological invariant,
          not a design choice — and V − 12 hexagons. A sensing node sits on every face; its position is the ray
          R(t) = t·n̂ from the centre through the face centroid, at shell radius t. Cells are derived from the
          ray, never stored: the address is a function of position.
        </p>
        <div className="panel">
          <TopoTable />
          <p className="faint" style={{ fontSize: '0.72rem', marginTop: 10, marginBottom: 0 }}>
            Table computed live from the same formulas the simulator runs. Mean face area = 4πR²/F (exact as a
            mean); node spacing = mean angular spacing √(4π/V) expressed as a chord at hull radius R.
          </p>
        </div>
        <div className="two-col" style={{ marginTop: 18 }}>
          <div className="panel">
            <h3>Addressing derivation</h3>
            <p>
              A node's spatial ID is a 128-bit UUID-form value derived from (shell t, level n, face index,
              quantised ray n̂) by a deterministic hash. Same position → same ID, on any machine, with no
              lookup. Routing is topology-native: a packet moves across edge-adjacent faces toward a target
              ray, the way the aggregate in the instrument above moves across neighbours. IDs shown on this
              page are PROVISIONAL — reproducible from coordinates alone, ahead of production minting under
              the SoMaCo UUID protocol.
            </p>
          </div>
          <div className="panel">
            <h3>Why sparse flags change the physics</h3>
            <p>
              A dense memory cell needs strong hysteresis, long retention, and low write energy per bit at
              density. A flag needs three bits — event, state, orientation — and can tolerate refresh. That
              drops the coercivity and retention bar to what soft-magnetic Fe-BMG can plausibly meet, makes a
              defective face a missing sensor instead of a failed array, and cuts write traffic to sparse
              events: the bus carries packets, not raw sensor streams.
            </p>
          </div>
        </div>
      </section>

      <section className="brief">
        <h2>§2 · THE LAYERS — WHAT A PARTNER ACTUALLY MAKES</h2>
        <p className="lede">
          Eight functional layers, each with a named process route and an honest grade. The right column is
          the point of this brief: every layer is a thing a materials partner can fabricate, coupon, and
          measure today — the integration is the research.
        </p>
        <div className="panel">
          <table>
            <thead>
              <tr><th>Layer</th><th>Material</th><th>Function</th><th>Process route</th><th>Grade</th></tr>
            </thead>
            <tbody>
              {LAYERS.map((l) => (
                <tr key={l.name}>
                  <td>{l.name}</td><td>{l.material}</td><td>{l.fn}</td><td>{l.process}</td>
                  <td><span className={`tag ${l.cls}`}>{l.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="brief">
        <h2>§3 · CLAIM BOUNDARY</h2>
        <p className="lede">
          The feasibility truth study, stated plainly. Literature figures are graded REPORTED — they are
          other groups' published results, not ours. Our own measurements do not exist yet; Work Package 1
          (§4) is how they come to exist.
        </p>
        <div className="two-col">
          <div className="panel">
            <h3 style={{ color: 'var(--ok)' }}>What we claim</h3>
            <ul className="tight">
              <li><span className="tag ok">REPORTED</span>Fe-BMG additive manufacturing is real at micro-to-mm scale: LPBF Fe-Si-B-Nb-Ni with coercivities reported as low as ~44 A/m and ~1 mm critical casting thickness; ring cores ~5 cm printed and permeability-tested.</li>
              <li><span className="tag ok">PROVEN</span>Spatial UUID addressing over a geodesic mesh — demonstrated in software on this page; the mesh, the IDs, and the routing are computed, not mocked.</li>
              <li><span className="tag ok">DESIGN</span>Sparse flags (3 bits/node) instead of dense memory — the framing that makes the magnetics plausible.</li>
              <li><span className="tag ok">DESIGN</span>In-situ thresholding and aggregation at the node; only sparse events cross the bus.</li>
              <li><span className="tag ok">DESIGN</span>Dual-function structure: the skin is structure first, sensor/compute surface second — no add-on layer.</li>
            </ul>
          </div>
          <div className="panel">
            <h3 style={{ color: 'var(--danger)' }}>What we will not claim</h3>
            <ul className="tight">
              <li><span className="tag danger">NOT CLAIMED</span>Dense nano-scale core memory. Soft-magnetic Fe-BMG has low coercivity — easy to reverse, poor retention. Dense primary memory is a long-term speculation, not a near-term deliverable.</li>
              <li><span className="tag danger">NOT CLAIMED</span>Nano-scale printed coils with reliable hysteresis. Glass-forming physics fights ultra-fine features; not demonstrated anywhere.</li>
              <li><span className="tag danger">NOT CLAIMED</span>Vacuum integrity of thin aerogel interstitials at hull scale under vibration, thermal cycling, and micrometeorite flux. Seals and outgassing are the limit, and they are unmeasured.</li>
              <li><span className="tag danger">NOT CLAIMED</span>Cymatic patterning as a coil-forming process. Standing waves may bias CNT / particle alignment; they do not print inductors.</li>
              <li><span className="tag warn">UNKNOWN</span>Write energy per flag vs OPV harvest per face. This is the first parameter likely to break at scale — and it is a measurement, not an argument. WP1 exists to take it.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="brief">
        <h2>§4 · WORK PACKAGES — THE FIRST FIVE MEASUREMENTS</h2>
        <p className="lede">
          Each package ends in a number, not a narrative. A partner who can run WP1 or WP3 can start
          without believing anything else on this page.
        </p>
        <div className="panel">
          <table>
            <thead><tr><th>Package</th><th>Article</th><th>Measurement</th><th>Pass condition</th></tr></thead>
            <tbody>
              <tr><td>WP1 · Magnetics</td><td>Small array of Fe-BMG micro-coils / toroidal cores, LPBF</td><td>Hysteresis loop, coercive field, write energy per flag, retention over time + temperature, read SNR at node spacing</td><td>A stable, inductively readable flag at energy the OPV face budget can pay</td></tr>
              <tr><td>WP2 · Addressing</td><td>Geodesic mesh + deterministic spatial IDs + mesh routing</td><td>Routing correctness over the dual graph; ID reproducibility across machines</td><td>Done in software — the instrument above is the prototype</td></tr>
              <tr><td>WP3 · Hybrid shell</td><td>Small multi-shell section: CAL / SLA precursor shells, aerogel infiltration, embedded pre-printed BMG elements</td><td>Thermal isolation across the section; electrical continuity of bus + nodes</td><td>A curved section that insulates and reports</td></tr>
              <tr><td>WP4 · Cymatic demo</td><td>Flat hex array in resin bath, CNT / magnetic-particle precursor, multi-frequency transducers</td><td>Orientation order parameter vs unpatterned control</td><td>Order high enough to matter — or the layer is cut</td></tr>
              <tr><td>WP5 · Systems model</td><td>Power budget (OPV harvest vs write energy), thermal path, load cases for a curved hull section</td><td>First breaking parameter identified with numbers</td><td>A budget a partner can price against</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="brief">
        <h2>§5 · THE ASK</h2>
        <div className="two-col">
          <div className="panel">
            <h3>Materials partners</h3>
            <p>
              We are looking for the shops and labs who can actually make the layers: LPBF houses running
              Fe-based metallic glass, CNT lattice fabricators, aerogel producers, flexible OPV lines. The
              entry point is a coupon, not a hull — WP1 and WP3 are scoped to be quotable.
            </p>
          </div>
          <div className="panel">
            <h3>Funding</h3>
            <p>
              Funding supports materials process development on Fe-BMG micro-coils, hybrid volumetric + LPBF
              coupons, vacuum-aerogel multi-shell sections, and spatial UUID firmware for geodesic node
              addressing — the five work packages above, in order, each gated on its own measurement.
            </p>
            <p style={{ marginBottom: 0 }}>
              Introductions and enquiries: Sam Stave · SoMaCoSF · via this site's network.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <span>ICOSKIN · SOMACOSF · Identity Is Infrastructure</span>
        <span>Design tokens: monohud (MIT, © 2026 Joshua Guo) · Spatial IDs on this page are PROVISIONAL, derived from coordinates · Feasibility grades per the IcoSkin truth study, Nov 2026</span>
      </footer>
    </div>
  );
}
