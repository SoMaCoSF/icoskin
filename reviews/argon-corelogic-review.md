<!-- SOM-DOC-10913-v1.0.0 · reviews/ · Argon (gemini-4-argon-high via arena.ai), 2026-11-22 -->
<!-- Questions: ~/workspace/user/files/argon-questions-icoskin-corelogic.md (founder-fed). Answer received verbatim via arena.ai conversation 01a20530-97ac-7f80-a0ba-6b1e54d44afb, 2026-11-22 13:35-13:44 PT. Transcription from the arena page; equations rendered there as formatted math. -->

# Argon Review — Magnetic Core Logic & ISM-SCS Physics (2026-11-22)

## 1. XOR Honesty

**VERDICT: FICTION.**

A single square-loop magnetic core cannot realize a non-monotonic flux window ([0.5, 1.1) of threshold).

Core switching is governed by irreversible domain-wall propagation above the coercive threshold H_c, described by the Landau-Lifshitz-Gilbert / Menyuk-Goodenough switching relation: 1/τ_sw = (H_app − H_c) / S_w, where S_w is the switching coefficient (~30–60 A·μs/m for soft metallic glasses) and τ_sw is the switching time. The total switched flux ΔΦ = ∫ V_out(t) dt is bounded by saturation magnetics: ΔΦ_max = 2 B_r A_c.

If your core is configured so that a single input (0.60 H_th) exceeds H_c and flips the core from −B_r to +B_r, then applying both inputs in the same direction (1.20 H_th) drives the core harder into +B_s. It does not suppress switching; it switches the core 2.7× faster and produces a higher peak voltage spike with the exact same volt-second integral ΔΦ = 2 B_r A_c. Minor-loop switching cannot rescue this: two active inputs still produce twice the flux change of one input, never zero.

Opposing windings (A−B) on one core still isn't XOR: with the core initialized to −B_r, A=1,B=1 → H_net = 0 → no flip (0); A=1,B=0 → flips (1); A=0,B=1 → drives deeper into −B_s, ΔΦ ≈ 0 (0). The initialized remanent state breaks symmetry: a single core with differential windings computes INHIBIT (A ∧ ¬B), not XOR.

**Minimal honest circuit:**
- **Two-Core Magnetic XOR (standard 1950s practice):** Core 1 wound (+N_A, −N_B) computes A ∧ ¬B; Core 2 wound (−N_A, +N_B) computes B ∧ ¬A. Both initialized to −B_r; output sense windings wired in series (or diode-ORed).
- **Single-Core + 4-Diode Bridge:** moves the non-monotonicity into semiconductor diodes, which violates a pure trace-and-core fabric.

## 2. Threshold Margins and Field Arithmetic

**VERDICT: MARGINAL (120 mA drive is far too high for a closed 100 μm core; open-core geometries fail due to demagnetization).**

Closed toroid, mean diameter D_m = 100 μm → path length l_e = π·D_m = 3.14×10⁻⁴ m. Single turn at 120 mA: H = NI/l_e = 382 A/m = 8.68× H_c (44 A/m) — a single input slams the core into saturation. To set one input to 0.60·H_c = 26.4 A/m at N=1: I = 8.29 mA. (At 120 mA, N=1, the core diameter would need to be 1.45 mm.)

Demagnetization trap: an open bead/rod/cluster has H_int = H_app − N_d·M. For a sphere (N_d = 1/3), H_sat ≈ 2–3×10⁵ A/m and remanence collapses to M_r ≈ H_c/N_d ≈ 132 A/m. Coincident-current logic requires a closed magnetic circuit (gapless toroid / picture-frame core).

Radial gradient: H(r) = NI/2πr. With r_out/r_in = 2.0, the inner wall at 1 input sees the same field the outer wall sees at 2 inputs — noise margin 0%. Requirement: r_out/r_in ≤ 1.35 and squareness B_r/B_s > 0.88 (field annealing) → workable ±15% drive margin.

## 3. Cascading and Fan-Out

**VERDICT: FICTION (passive core-to-core fan-out in this geometry is strictly 0; resistive trace loss exceeds the core's total flux by ~7.5×).**

A flipping core is a passive transformer with a finite volt-second reservoir ΔΦ = 2·B_r·A_c, not an energy source. Historical fixes: core-diode logic with 2/3-phase clock (Advance/Clear) where the clock supplies switching energy and turns-ratio step-up (N_out > N_in, 2:1–3:1) restores levels; core-transistor logic (one transistor per sense winding); multi-aperture devices (transfluxor/MAD) with multi-phase clocks, short thick jumpers only.

Flux budget in our geometry: A_c = 20×20 μm, B_r = 1.0 T → ΔΦ_core = 8.0×10⁻¹⁰ Wb (0.8 nV·s). Charge to switch a downstream core Q_sw = (H_c·τ_sw + S_w)·l_e/N_2 ≈ 1.39×10⁻⁸ C. A 10 mm interconnect loop (R_loop ≈ 0.43 Ω) drops Φ_loss = R·Q_sw ≈ 6.0×10⁻⁹ Wb — 7.5× the core's entire reservoir. Fan-out ≥ 2 needs ~20× core cross-section, 4:1 turns ratio, and a global 2-phase clock with unidirectional coupling.

## 4. Clocking and Skew

**VERDICT: FICTION (unclocked τ = L/v coincidence fails; two-phase synchronous clocking required).**

Wire flight time is negligible (v ≈ 1.54×10⁸ m/s in resin, ~1 ns across the patch). The dominant delay is core switching latency τ_sw ≈ 50–200 ns per hop. Sub-threshold (0.60 H_c) pulses that arrive 100 ns apart each produce only reversible domain-wall bowing that collapses in ~2 ns — coincidence never registers. Delay-line matching is infeasible (100 ns = 15.4 m of trace); asynchronous handshakes need dual-rail + static holding currents. **Two-phase synchronous clocking is the only credible discipline:** bipartite core sets on global phases Φ1/Φ2 at ~1–2 MHz; better, replace coincident-current AND with INHIBIT readout — inputs set buffer cores at full current, the clock reads them through an inhibit winding, eliminating amplitude-margin sensitivity.

## 5. Gor'kov Separation (CNTs vs Fe-MG in Resin)

**VERDICT: FICTION (both species have Φ > 0 and migrate to the same pressure nodes; dense Fe-MG particles are actively expelled from nodal vertices in a single-frequency field).**

Resin baseline: ρ_0 = 1100 kg/m³, c_0 = 1450 m/s, κ_0 = 4.32×10⁻¹⁰ Pa⁻¹.
- CNTs: f_1 = +0.954, f_2 = +0.327, Φ = +0.482 → pressure nodes; align along nodal lines via radiation torque.
- Fe-MG: f_1 = +0.984, f_2 = +0.790, Φ = +0.723 → the same pressure nodes.

Vertex repulsion: on the nodal network the pressure term vanishes; U = −V_p·f_2·(3/4)·ρ_0·⟨v²⟩. At a vertex (saddle of p), ∇p = 0 → v = 0 → U = 0, a local MAXIMUM along the line; segments have U < 0. Fe-MG particles are swept OUT of vertices and bunch at segment midpoints. Only f_2 < 0 (buoyant) particles trap at vertices.

Separation requires a two-step process: magnetic template pinning (ferromagnetic concentrator pins under the 24 vertex coordinates, tack-cure) then the acoustic CNT patterning — or dual-frequency orthogonal drive. Also: dispersed CNTs (a_eff ~ 50 nm) sit below the streaming/radiation crossover (~1 μm) in viscous resin and will not focus unless pre-agglomerated into 5–10 μm flocculates.

## 6. CAL Dose Optimization with Sparse Line Masks

**VERDICT: MARGINAL (iterative sinogram optimization is mathematically sound for sparse targets; volumetric CAL breaks on optics/opacity — use 2D mask lithography).**

VAMToolbox standard: positivity-clipped Ram-Lak FBP initialization, then iterative projected gradient descent / OSMO minimizing a double-threshold objective with the attenuated Radon operator (Beer-Lambert + projector PSF) against the gelation dose window. Sparsity helps dose contrast (fill < 2% → ideal D_in/D_out > 5:1). It breaks physically: Rayleigh range for a 22.5 μm waist at 405 nm in resin is z_R ≈ 5.89 mm → 196 μm beam diameter at 25 mm depth (>4× feature smear); CNT/Fe-loaded resin has μ_ext > 20 cm⁻¹ (penetration < 0.5 mm) vs the ≤ 0.32 cm⁻¹ CAL requires; O₂ inhibitor diffusion quenches a 45 μm filament in ~1 s. **Correction: top-down 2D DLP/mask projection lithography through a 50–100 μm layer — which is what the engine's mask exporter already produces.**

## 7. In-Transit Evaluation

**VERDICT: MARGINAL (single-pass threshold aggregation via magnetostriction is real; dynamic address-header routing and arbitrary bit-flipping at 1-core junctions is FICTION).**

Physically grounded: the Villari (inverse magnetostrictive) effect — Fe-BMG λ_s ≈ +30 ppm; a 2 MPa local stress shifts the switching threshold by ΔH_σ ≈ 150 A/m (>3× H_c). A core is a zero-power analog strain-threshold comparator. Minimal honest semantics per 1-core junction: a condition-gated repeater — P_out = P_in ∧ ¬C (inhibit mode) or P_out = P_in ∨ C (pre-set latch mode). Achievable in one pass over k nodes: commutative Boolean reductions (any-node-over-limit ⋁ C_i; all-nodes-safe ⋀ C_i) and time-of-flight accumulation — Σ τ_sw(σ_i) is a path-integrated strain tomogram.

Marketing (strike): in-flight address-header decoding needs an N-bit shift register + comparator + demux (~40–60 cores) per junction; routing must be circuit-switched (host pre-sets paths) or fixed-topology broadcast. In-flight XOR payload toggling needs ≥ 2 cores per node plus dual-rail signaling.

## 8. Radiation Hardness

**VERDICT: SOUND (for the magnetic state itself; MARGINAL for the polymer matrix, which fails first).**

Stored state: the remanent barrier is ~100 MeV of coherent magnetic work over ~10¹⁴ coupled spins; a heavy-ion track affects < 10⁻⁷ of core volume and re-pins on cooling — direct SEU bit-flips are physically zero. Fe-BMG is already amorphous: coercivity drifts < 10% to 10¹⁶ n/cm².

Degradation order: (1) ~10–100 kRad — dielectric charging of resin/aerogel → ESD arcs (H > 3000 A/m) overwrite cores along a trace; fix: sub-percolation antistatic doping to ρ ~ 10⁹–10¹⁰ Ω·cm. (2) ~0.5–5 MRad — radiolysis shrinkage stress (10–40 MPa) via Villari shifts effective H_c from 44 to > 1500 A/m, locking cores; fix: zero-magnetostriction Co-Fe-BMG for logic cores (λ_s < 0.3 ppm, H_c ≈ 2–5 A/m) or compliant micro-cavity encapsulation. (3) > 20 MRad — CNT-polymer tunneling junction resistance drift 20–50% (solid Cu traces are immune past 1 GRad). (4) > 100 MRad — intrinsic Fe-MG degradation.

## The Three Claims to Strike First (Argon's list)

1. **Single-core flux-window XOR and passive core-to-core cascading** — replace with a 2-phase clock-pumped core-diode architecture; INHIBIT windings on two cores implement XOR; the clock restores flux levels at every hop.
2. **Single-frequency acoustic separation of CNTs to lines / Fe-MG to vertices, and 3D volumetric CAL on 50 mm tiles** — switch to top-down 2D projection mask lithography and magnetic template pinning at vertices.
3. **Dynamic imbuuid header routing at 1-core junctions with unclocked τ = L/v coincidence** — reframe as a 2-phase synchronous cellular array (logic) and a Villari magnetoelastic time-of-flight / threshold path integrator (sensing).
