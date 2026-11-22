import Simulator from './Simulator';
import Chladni from './Chladni';
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
          <a href="/cad-cam" style={{ color: 'var(--fg)', fontWeight: 600, textDecoration: 'none' }}>CAD/CAM ENGINE →</a>
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
        <h2>FIGURES — THE DESIGN AS DRAWN</h2>
        <p className="lede">
          Concept schematics from the design study. They are design communication, not engineering
          drawings — every load-bearing claim on this page is graded in §3 and referenced in §10.
        </p>
        <div className="gallery">
          <figure className="fig">
            <img src="/img/multi-shell.webp" alt="Icospheric multi-shell smart compute skin schematic" />
            <figcaption><b>Multi-shell icosphere.</b> Nested geodesic CNT lattice shells (A–C) with vacuum-sealed aerogel interstitials, Fe-MG core-memory nodes at the vertices, and the cymatic-patterned carbon-copper micro-coil at face scale.</figcaption>
          </figure>
          <figure className="fig">
            <img src="/img/fab-facility.webp" alt="Icospheric multi-shell fabrication facility schematic" />
            <figcaption><b>Fabrication.</b> (A) Vacuum cymatic resin bath — multi-frequency transducer arrays form the standing-wave mask while metal-coated CNTs and metallic-glass particles align. (B) Multi-layer casting and shell build-up with aerogel infiltration grout. (C) The final composite: tile-node architecture, B-10/Ga-71 doped core, evacuated vacuum pockets.</figcaption>
          </figure>
          <figure className="fig">
            <img src="/img/exploded-layers.webp" alt="Exploded layers of the smart compute skin" />
            <figcaption><b>Exploded layers.</b> Outer protective CNT lattice → hexagonal photovoltaic layer → mycelial CNT wiring and power bus → integrated compute &amp; memory core lattice → structural base. "Hull is compute."</figcaption>
          </figure>
          <figure className="fig">
            <img src="/img/aerogel-paper.webp" alt="Graphical abstract of the doped graphene aerogel stealth paper" />
            <figcaption><b>Reference — not our result.</b> Graphical abstract of a heteroatom-doped reduced-graphene-oxide aerogel study (full citation being identified — §10): interlayer crosslinking, topological distortion, and lattice stabilization yield a lightweight aerogel with radar-infrared compatible stealth (EAB<sub>max</sub> 8.06 GHz, RL<sub>min</sub> −64.82 dB). This is the class of material our aerogel interstitial is specified from — doped, structured, multifunctional.</figcaption>
          </figure>
        </div>
      </section>

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
        <h2>§5 · FABRICATION — PRINTING THE ICO LATTICE IN RESIN</h2>
        <p className="lede">
          The skin is printed, not assembled. The primary structure is a geodesic lattice formed in
          UV-curable elastomer resin inside a vacuum chamber (10⁻⁷ Torr class in the facility
          schematic), by two coupled processes: volumetric / projector-directed curing that builds
          each shell layer as a continuous lattice, and the cymatic bath (§6) that patterns what
          goes inside each face while the resin is still liquid.
        </p>
        <div className="two-col">
          <div className="panel">
            <h3>The print sequence</h3>
            <ul className="tight">
              <li><b>Shell n is cast first</b> — projector-directed UV curing forms the geodesic lattice layer by layer (the CAL lineage: a whole volume cured from projected patterns, not stacked filaments — §10).</li>
              <li><b>Precursors go in wet.</b> Metal-coated CNTs and metallic-glass particles are suspended in the resin; the acoustic field (§6) organises them before the cure locks the pattern.</li>
              <li><b>Nodes are embedded, not placed.</b> Pre-printed Fe-BMG elements are seated at vertices during the build — the memory is in the lattice from the first cure, which is what §7 means by imbued.</li>
              <li><b>Aerogel is grout.</b> Silica aerogel — doped per §8 — is infiltrated into the interstitial frame under vacuum and sealed: insulation, structure, and dopant host in one pour.</li>
              <li><b>Shell n+1 casts over it.</b> The multi-shell stack (t = 1.00 / 1.60 / 2.05 in the estate shells model) is a print sequence, not a parts list.</li>
            </ul>
          </div>
          <div className="panel">
            <h3>Why resin printing is the enabling choice</h3>
            <p>
              A geodesic lattice at hull scale cannot be machined and should not be assembled from
              struts: every joint is a failure mode and a labour line. Volumetric resin printing
              forms the lattice as one object, lets functional particles be patterned <i>during</i>
              formation rather than coated on afterwards, and scales by chamber, not by headcount.
              The honest limits are the ones in §3: print resolution against glass-forming physics
              at the node scale, and vacuum integrity of the sealed interstitials over a service life.
            </p>
          </div>
        </div>
      </section>

      <section className="brief">
        <h2>§6 · THE CYMATIC MASK — A CHLADNI CREATOR IN EVERY HEX</h2>
        <p className="lede">
          The geodesic mesh sets the address space; the cymatic mask sets the density. Each hex face
          is an individual Chladni plate: driven at a chosen mode by the face's own transducers, the
          standing wave's nodal lines become the circuit — conductive precursor settles on the nodes
          of the wave, antinodes become pads. One face, one pattern, chosen per face. The circuit
          subdivides the face without touching the mesh above it.
        </p>
        <Chladni />
        <div className="panel" style={{ marginTop: 18 }}>
          <h3>The mask, in motion — 30s</h3>
          <video className="motion" controls preload="metadata" poster="/img/multi-shell.webp">
            <source src="/cymatic-mask.mp4" type="video/mp4" />
          </video>
          <p className="faint" style={{ fontSize: '0.72rem', marginTop: 8, marginBottom: 0 }}>
            Program-motion, deterministic: the field, the particle migration, the pads, and the route are
            computed from the same field equation as the instrument above — nothing is hand-animated.
            GIF version: <a href="/cymatic-mask.gif" style={{ color: 'var(--fg-muted)' }}>cymatic-mask.gif</a>
          </p>
        </div>
        <div className="two-col" style={{ marginTop: 18 }}>
          <div className="panel">
            <h3>Why this multiplies density</h3>
            <p>
              Geodesic subdivision is global: one more level quadruples every face on the hull,
              wanted or not. The mask is local: density is bought per face, at the mode the face is
              driven at, only where the sensing or routing load justifies it. A quiet face runs a
              low mode and a sparse circuit; a face over a hot zone runs dense. The instrument above
              computes the multiplier live — pads per face × faces — because the count is a property
              of the field equation, not a rendering.
            </p>
          </div>
          <div className="panel">
            <h3>Why UUID routing still holds</h3>
            <p>
              A pad is not a new kind of address. Its sub-address derives deterministically from the
              parent face's spatial ID plus its quantised nodal coordinates — the same derivation
              rule as the mesh itself, one level down. Routing crosses pads by adjacency inside the
              face and crosses faces by the mesh, with one rule at both scales: identity is a
              function of position. No registry appears at any density.
            </p>
            <p className="faint" style={{ fontSize: '0.74rem', marginBottom: 0 }}>
              Grade: the field mathematics is exact and demonstrated above. Acoustic patterning of
              conductive precursors is REPORTED in the literature at bench scale; patterning inside
              a curing resin face, at hull scale, is DESIGN — WP4 (§4) is the measurement.
            </p>
          </div>
        </div>
      </section>

      <section className="brief">
        <h2>§7 · CORE MEMORY, IMBUED</h2>
        <p className="lede">
          The name is literal. Core memory — the woven ferrite grids that flew to the Moon — stored
          bits as magnetic state in a physical lattice, and the lattice was the memory: no separation
          between the medium and the structure holding it. IcoSkin returns to that architecture with
          modern materials. The Fe-BMG elements at the vertices and faces are written into the skin
          during the print (§5); their magnetic state is the flag store; the hull does not carry a
          memory subsystem, it <i>is</i> one.
        </p>
        <div className="two-col">
          <div className="panel">
            <h3>Imbued, in three senses</h3>
            <ul className="tight">
              <li><b>Manufacturing:</b> the memory elements are embedded during fabrication — imbued at birth, not installed.</li>
              <li><b>Identity:</b> each element's address is its position (§1) — the memory is imbued with the hull's coordinate system, so a read is always located.</li>
              <li><b>State:</b> event, state, and orientation flags persist as material magnetisation — the skin remembers what happened to it in the same material that it happened to.</li>
            </ul>
          </div>
          <div className="panel">
            <h3>The honest shape of it</h3>
            <p>
              This is sparse state, not a memory hierarchy: 3 bits per node, refreshed by design,
              read and written inductively through the bus. It will not replace a single conventional
              memory chip at density, retention, or speed — §3 says so plainly. What it does that no
              chip does: survive as structure, cost no separate volume or mass budget, and keep its
              state spatially addressed by construction. The claim is architectural, and it is the
              strongest claim in this brief.
            </p>
          </div>
        </div>
      </section>

      <section className="brief">
        <h2>§8 · PARTICLE SENSING — DOPED AEROGEL, LOCATED EVENTS</h2>
        <p className="lede">
          The aerogel interstitial is the dopant host. Doping is what turns insulation into an
          instrument: regions of the aerogel carry isotopes chosen for the particles they answer to,
          and an interaction there raises a flag at that face — located, because everything on this
          hull is located. The physics below is established; the engineering claim is graded at the end.
        </p>
        <div className="panel">
          <table>
            <thead><tr><th>Dopant</th><th>Interaction</th><th>What it gives the skin</th><th>Grade</th></tr></thead>
            <tbody>
              <tr>
                <td>Boron-10</td>
                <td>¹⁰B(n,α)⁷Li — thermal-neutron capture, cross-section ≈ 3,837 barns</td>
                <td>Neutron events, counted at the face where they happen; the same boron loading is the radiation shield (below)</td>
                <td><span className="tag ok">ESTABLISHED</span></td>
              </tr>
              <tr>
                <td>Gallium-71</td>
                <td>⁷¹Ga(ν,e⁻)⁷¹Ge — the radiochemical neutrino capture GALLEX and SAGE ran on tens of tonnes of gallium</td>
                <td>A neutrino interaction channel in principle — see the boundary note; nobody sane promises a hull-scale neutrino telescope</td>
                <td><span className="tag ok">PHYSICS ESTABLISHED</span></td>
              </tr>
              <tr>
                <td>Heteroatom-doped graphene aerogel (N/S/P class)</td>
                <td>EM absorption + thermal signature management in the interstitial itself</td>
                <td>Radar-infrared compatible stealth behaviour from the insulation layer (EAB<sub>max</sub> 8.06 GHz, RL<sub>min</sub> −64.82 dB as reported on the study's graphical abstract — §10)</td>
                <td><span className="tag ok">REPORTED</span></td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 12 }}>
            <b>Boron is also the shield.</b> The same ¹⁰B loading that detects thermal neutrons absorbs
            them: boron-rich and boron-nitride materials are a studied spacecraft radiation-shielding
            family precisely because hydrogenous + boron loading moderates and then captures the
            neutron component of the radiation environment. On IcoSkin the shielding is not a layer
            added around the instrument — the instrument's host material is the shield.
          </p>
          <p className="faint" style={{ fontSize: '0.74rem', marginBottom: 0 }}>
            Boundary, stated plainly: GALLEX/SAGE needed ~30–60 tonnes of gallium and months of
            exposure to count solar neutrinos. A hull carries kilograms. The claim is therefore NOT
            neutrino astronomy — it is that high-flux particle events (neutrons, and the charged
            component) register as sparse located flags, with the neutrino channel present as physics,
            not as a promised instrument. A further honesty point: no peer-reviewed demonstration of a
            doped aerogel functioning as a particle detector exists — silica aerogel's established
            particle-physics role is as a Cherenkov radiator. The doped-aerogel sensor is a design
            concept, and it is labelled that way here. Citations: §10.
          </p>
        </div>
      </section>

      <section className="brief">
        <h2>§9 · THE ASK</h2>
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

      <section className="brief">
        <h2>§10 · REFERENCES</h2>
        <p className="lede">
          The load-bearing external claims on this page, and where they come from. REPORTED means
          another group's published result — cited, never adopted as ours.
        </p>
        <div className="panel">
          <ul className="refs" style={{ margin: 0, paddingLeft: 18 }}>
            <li><span className="tag ok">REF</span><span data-ref="febmg">Rodríguez-Sánchez, M. et al. "Laser powder bed fusion of a newly designed Fe-based bulk metallic glass with enhanced soft magnetic properties." Acta Materialia 318 (2026). DOI 10.1016/j.actamat.2026.122636 — as-built coercivity as low as 44 A/m, critical casting thickness ≈ 1 mm, amorphous fraction &gt; 87%. The source of §2's magnetic figures; printed specimens still carried pores and cracks, and no complete device was demonstrated.</span></li>
            <li><span className="tag ok">REF</span><span data-ref="cal">Kelly, B. E. et al. "Volumetric additive manufacturing via tomographic reconstruction." Science 363(6431), 1075–1079 (2019). DOI 10.1126/science.aau7114 — computed axial lithography (CAL), the volumetric resin-printing lineage §5 builds on.</span></li>
            <li><span className="tag ok">REF</span><span data-ref="gallex">Hampel, W. et al. (GALLEX Collaboration). "GALLEX solar neutrino observations: results for GALLEX IV." Physics Letters B 447, 127–133 (1999). DOI 10.1016/S0370-2693(98)01579-2 · Abdurashitov, J. N. et al. (SAGE Collaboration). "Measurement of the solar neutrino capture rate with gallium metal. III." Physical Review C 80, 015807 (2009). DOI 10.1103/PhysRevC.80.015807 — radiochemical detection on 30.3 t (GALLEX) and ~60 t (SAGE) of gallium, yielding on the order of one ⁷¹Ge atom per day: the physics behind §8's gallium row, and the source of its scale caveat.</span></li>
            <li><span className="tag ok">REF</span><span data-ref="b10">¹⁰B thermal-neutron capture cross-section = 3,837 barns at 0.0253 eV (ENDF/B evaluated data; cf. "Nuclear Instrumentation," Springer, 2022, DOI 10.1007/978-981-19-6589-0_5) — the basis of BF₃ and boron-lined neutron counters and of §8's detection and shielding claims. Boron detects neutrons, not neutrinos; the two are kept separate on this page deliberately.</span></li>
            <li><span className="tag ok">REF</span><span data-ref="bnnt">Thibeault, S. A. et al. "Radiation Shielding Materials Containing Hydrogen, Boron, and Nitrogen: Systematic Computational and Experimental Study." NASA Langley / NIAC Final Report (2012), NTRS 20160010096 — hydrogenated BNNT shown computationally to shield galactic cosmic rays, solar particle events, and secondary neutrons while serving as structure. Modelled efficacy, materials-characterisation stage — a research programme, not a flown hull material.</span></li>
            <li><span className="tag ok">REF</span><span data-ref="aerogel">Heteroatom-doped reduced-graphene-oxide aerogel (N,S- vs N,P-co-doped variants, "rGO-NS" / "rGO-NP"), radar-infrared compatible stealth — the study whose graphical abstract appears in the Figures, reporting EAB<sub>max</sub> 8.06 GHz and RL<sub>min</sub> −64.82 dB on the abstract itself. <b>Citation status: the paper has not yet been identified</b> — an exact-figure and label search across Crossref and the open web (2026-11-18) found no match, so the figures are quoted as the abstract's own claims, not as a verified citation. Identification is an open task, not a detail.</span></li>
            <li><span className="tag warn">NOTE</span>Design tokens: monohud (MIT, © 2026 Joshua Guo). Spatial IDs on this page are PROVISIONAL, derived from coordinates under the SoMaCo UUID protocol.</li>
          </ul>
        </div>
      </section>

      <section className="brief">
        <h2>§11 · THE CAD/CAM ENGINE — FROM BRIEF TO MANUFACTURING FILE</h2>
        <p className="lede">
          The brief above is the argument; the CAD/CAM engine is the instrument that turns it into
          manufacturing files. It converges the two earlier single-file prototypes — the ISM-SCS
          hull simulator (v4.2) and the Cymatic Chladni &amp; Material Circuit Engine — into one
          workstation, and it runs entirely in the browser:
        </p>
        <div className="two-col">
          <div className="panel">
            <h3>What it does</h3>
            <ul className="tight">
              <li><b>Multi-tile GeoHex patch editor.</b> Centre hex + 6 neighbours, each running a rotated Chladni mode (N,M offset by axial coordinate), with edge-port <i>imbuuid</i> handshake verification across every shared edge — plus pentagon-defect handling for the 12 topological defect tiles.</li>
              <li><b>Skeleton extraction + DRC.</b> The particle density field is chained into vector traces, then checked: minimum trace spacing, trace–trace shorts, Fe-MG coil clearance. Violations are ringed on the canvas, not hidden.</li>
              <li><b>Tomographic mask stack.</b> A Radon sinogram of the trace field (the CAL input form) and a 3-layer export — L1 CNT scaffold, L2 Cu/Fe-MG core-memory, L3 inverse aerogel infiltration channels — as print-ready PNG masks plus a GeoHex netlist JSON.</li>
              <li><b>Transient core-memory pulse.</b> Click two edge ports: the pulse routes over the extracted mycelial graph with per-segment voltage drop and Joule heating, and Fe-MG coils near the path flip hysteresis state — the write event, simulated on the real extracted topology.</li>
            </ul>
          </div>
          <div className="panel">
            <h3>Measured on the instrument itself</h3>
            <ul className="tight">
              <li><span className="tag ok">MEASURED</span>Edge-port handshakes at default modes (N3 M5, 640 Hz): <b>11 of 12</b> shared edges PASS with the v6 skeletoniser (Zhang–Suen thinning → graph vectorisation → Douglas–Peucker), 12 of 12 on the Gor'kov field. The v5 greedy chainer managed 6 of 12. Continuity is a measurement, not an assumption.</li>
              <li><span className="tag ok">MEASURED</span>Pulse, centre tile port e0→e3, Cu at 120 mA: path 75.3 mm, R 1.56 Ω, drop 188 mV, Joule heat 22.5 mW. A 45×18 µm trace is genuinely that resistive — the number is the physics, not a rendering.</li>
              <li><span className="tag warn">CORRECTION</span>An earlier version of this section reported "17 trace-crossing shorts" in the v5 skeleton. That count was an artifact of a naive DRC rule that scored skeleton junctions and near-endpoint touches as shorts. Under the corrected, net-aware rule (junction-joined traces are one net; a short is an interior crossing), both extractors are short-free at defaults, and DRC is <b>clean</b> on the v6 skeleton: 180 traces, 0 shorts, 0 spacing violations at an 800 µm rule (canvas resolution ≈ 175 µm/px, stated in the instrument).</li>
              <li><span className="tag ok">FIELD SEAM</span>The vectoriser consumes any scalar field, not just Chladni |Z|: the engine's field selector also runs a Gor'kov-proxy potential (U from pressure/velocity terms of the plate mode), which yields a denser trapping field — 465 traces, 12/12 handshakes. That selector is the seam where a full fluid/field solver plugs in.</li>
              <li><span className="tag warn">KNOWN LIMIT</span>The sinogram is a Radon projection of the 2D vector trace field — the correct input form for CAL dose planning, not a voxel CT reconstruction of a printed part.</li>
            </ul>
            <p style={{ marginBottom: 0 }}>
              <a href="/cad-cam" style={{ color: 'var(--fg)', fontWeight: 600 }}>Open the CAD/CAM Engine →</a>
              <span className="faint"> · single file, no build step, no server state — the same file that is developed locally is the file that ships.</span>
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
