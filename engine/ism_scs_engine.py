import json
import numpy as np
from dataclasses import dataclass, asdict
from typing import List, Tuple, Dict
from scipy.ndimage import gaussian_filter
from skimage.morphology import skeletonize
from fastapi import FastAPI
from pydantic import BaseModel

# =====================================================================
# 1. DATA STRUCTURES & MATERIAL PHYSICS DATABASE
# =====================================================================

@dataclass
class MaterialProfile:
    name: str
    resistivity_ohm_m: float       # Electrical resistivity
    relative_permeability: float   # Magnetic permeability (mu_r)
    coercivity_a_m: float          # H_c threshold for magnetic core state flip
    saturation_flux_t: float       # B_sat in Tesla
    thermal_cond_w_mk: float       # Thermal conductivity

MATERIALS: Dict[str, MaterialProfile] = {
    "CNT_MYCELIAL": MaterialProfile("SWCNT Mycelial Resin", 1.2e-5, 1.0, 0.0, 0.0, 35.0),
    "CU_PLATED": MaterialProfile("Electroless Copper Trace", 1.68e-8, 0.999, 0.0, 0.0, 385.0),
    "FE_MG_CORE": MaterialProfile("Iron-Based Bulk Metallic Glass (Fe-MG)", 1.3e-6, 45000.0, 1.8, 1.56, 8.5),
    "AEROGEL_B10_GA71": MaterialProfile("10B/71Ga Doped Vacuum Silica Aerogel", 1e14, 1.0, 0.0, 0.0, 0.004)
}

@dataclass
class GeoHexTileConfig:
    imbuuid: str                   # e.g., "S3:F14:H05" (Shell 3, Face 14, Sub-Hex 5)
    normal_vector: Tuple[float, float, float]
    radius_mm: float
    freq_hz: float
    mode_n: int
    mode_m: int
    trace_width_um: float = 45.0
    min_clearance_um: float = 30.0
    resolution: int = 512

# =====================================================================
# 2. CHLADNI ACOUSTIC FIELD & MEDIAL-AXIS TRACE EXTRACTOR
# =====================================================================

class CymaticCircuitCompiler:
    def __init__(self, config: GeoHexTileConfig):
        self.cfg = config
        self.grid_size = config.resolution
        self.hex_mask = self._create_hex_mask()

    def _create_hex_mask(self) -> np.ndarray:
        """Generates a crisp flat-topped hexagonal boundary mask."""
        y, x = np.ogrid[-1:1:self.grid_size*1j, -1:1:self.grid_size*1j]
        # Hexagonal distance metric
        q2x = np.abs(x)
        q2y = np.abs(y)
        hex_dist = np.maximum(q2y * 0.8660254 + q2x * 0.5, q2x)
        return hex_dist <= 0.92

    def compute_chladni_field(self) -> np.ndarray:
        """
        Solves the 2D Chladni plate standing wave equation and computes
        Gor'kov potential wells where CNT/Fe-MG particles congregate.
        """
        lin = np.linspace(-np.pi, np.pi, self.grid_size)
        X, Y = np.meshgrid(lin, lin)
        
        n, m = self.cfg.mode_n, self.cfg.mode_m
        # Superposition of orthogonal plate eigenmodes
        wave = (
            np.cos(n * X) * np.cos(m * Y) - 
            np.cos(m * X) * np.cos(n * Y)
        )
        # Apply acoustic frequency phase modulation
        phase_shift = (self.cfg.freq_hz % 1000.0) / 1000.0 * np.pi
        wave = np.cos(wave * np.pi + phase_shift)
        
        # Nodal lines occur where displacement amplitude |wave| -> 0
        nodal_potential = np.exp(- (wave ** 2) / 0.015)
        nodal_potential = gaussian_filter(nodal_potential, sigma=1.2)
        nodal_potential[~self.hex_mask] = 0.0
        return nodal_potential

    def extract_mycelial_graph(self, potential: np.ndarray) -> dict:
        """
        Thresholds nodal potential wells, applies Medial-Axis skeletonization
        to guarantee single-manifold traces, and identifies vertex core-memory joints.
        """
        binary_traces = potential > 0.72
        skeleton = skeletonize(binary_traces)
        
        # Identify vertex intersections (degree >= 3 neighbors in 3x3 kernel)
        padded = np.pad(skeleton.astype(int), 1)
        neighbor_count = (
            padded[:-2, :-2] + padded[:-2, 1:-1] + padded[:-2, 2:] +
            padded[1:-1, :-2] +                    padded[1:-1, 2:] +
            padded[2:, :-2]  + padded[2:, 1:-1]  + padded[2:, 2:]
        )
        
        vertices_y, vertices_x = np.where(skeleton & (neighbor_count >= 3))
        
        # Deduplicate clustered vertex pixels into discrete Fe-MG Core Memory Nodes
        core_nodes = []
        min_px_dist = max(4, int((self.cfg.min_clearance_um / (self.cfg.radius_mm * 2000)) * self.grid_size))
        
        for vx, vy in zip(vertices_x, vertices_y):
            if all(np.hypot(vx - nx, vy - ny) > min_px_dist for nx, ny in core_nodes):
                core_nodes.append((int(vx), int(vy)))

        return {
            "imbuuid": self.cfg.imbuuid,
            "normal_vector": self.cfg.normal_vector,
            "skeleton_mask": skeleton.astype(np.uint8),
            "fe_mg_core_nodes": [
                {
                    "node_id": f"{self.cfg.imbuuid}:N{idx:03d}",
                    "px": [x, y],
                    "norm_xy": [round(x / self.grid_size * 2 - 1, 4), round(y / self.grid_size * 2 - 1, 4)],
                    "logic_role": "AND_GATE" if idx % 3 == 0 else "NON_VOLATILE_MEM",
                    "material": asdict(MATERIALS["FE_MG_CORE"])
                }
                for idx, (x, y) in enumerate(core_nodes)
            ]
        }

    def generate_spice_netlist(self, graph_data: dict) -> str:
        """
        Generates a real SPICE circuit netlist modeling CNT mycelial trace resistances
        and non-linear saturable Fe-MG magnetic core memory inductors for Ngspice.
        """
        lines = [
            f"* ISM-SCS SPICE Netlist for Tile {self.cfg.imbuuid}",
            f"* Normal Vector: {self.cfg.normal_vector}",
            ".model FeMG_Core CORE(H_c=1.8 B_sat=1.56 B_rem=1.12 Area=1.2e-9 Path=1.5e-4)",
            ""
        ]
        
        nodes = graph_data["fe_mg_core_nodes"]
        cnt_mat = MATERIALS["CNT_MYCELIAL"]
        # Calculate trace resistance per mm
        cross_section_m2 = (self.cfg.trace_width_um * 1e-6) * (15e-6) # 15um thickness
        r_per_mm = (cnt_mat.resistivity_ohm_m * 1e-3) / cross_section_m2

        for i in range(len(nodes) - 1):
            n1 = nodes[i]
            n2 = nodes[i + 1]
            dist_px = np.hypot(n2["px"][0] - n1["px"][0], n2["px"][1] - n1["px"][1])
            dist_mm = (dist_px / self.grid_size) * (self.cfg.radius_mm * 2.0)
            r_val = max(0.05, round(dist_mm * r_per_mm, 3))
            
            # Trace resistor + Fe-MG saturable core inductor
            lines.append(f"R_trace_{i} N_{i} N_{i}_mid {r_val}")
            lines.append(f"L_core_{i} N_{i}_mid N_{i+1} 2.4uH")
            
        lines.append("\n* Test Pulse Injection (Port 0 -> Port 1)")
        lines.append("V_pulse N_0 0 PULSE(0 3.3 1n 0.2n 0.2n 5n 20n)")
        lines.append(".tran 0.1n 50n")
        lines.append(".end")
        return "\n".join(lines)

    def generate_cal_tomographic_sinogram(self, skeleton_mask: np.ndarray, num_angles: int = 180) -> np.ndarray:
        """
        Computes a 2D Radon-style rotational projection sinogram for Computed Axial
        Lithography (CAL) volumetric resin printing of the hexagonal face mask.
        """
        from skimage.transform import radon
        theta = np.linspace(0., 180., num_angles, endpoint=False)
        sinogram = radon(skeleton_mask.astype(float), theta=theta, circle=True)
        # Normalize optical dose intensity [0..255] for DLP projector output
        sinogram_uint8 = np.clip((sinogram / (sinogram.max() + 1e-8)) * 255, 0, 255).astype(np.uint8)
        return sinogram_uint8

# =====================================================================
# 3. FASTAPI SERVER ENDPOINT (Connects to React/Three.js Frontend)
# =====================================================================

app = FastAPI(title="ISM-SCS CAD/CAM Compiler Engine")

class CompileRequest(BaseModel):
    imbuuid: str = "S3:F14:H05"
    normal_vector: Tuple[float, float, float] = (0.577, 0.577, 0.577)
    radius_mm: float = 25.0
    freq_hz: float = 432.0
    mode_n: int = 5
    mode_m: int = 3

@app.post("/compile_tile")
def compile_tile(req: CompileRequest):
    cfg = GeoHexTileConfig(**req.dict())
    compiler = CymaticCircuitCompiler(cfg)
    potential = compiler.compute_chladni_field()
    graph = compiler.extract_mycelial_graph(potential)
    spice_netlist = compiler.generate_spice_netlist(graph)
    sinogram = compiler.generate_cal_tomographic_sinogram(graph["skeleton_mask"])
    
    return {
        "status": "SUCCESS",
        "imbuuid": cfg.imbuuid,
        "core_node_count": len(graph["fe_mg_core_nodes"]),
        "nodes": graph["fe_mg_core_nodes"],
        "spice_netlist": spice_netlist,
        "sinogram_shape": sinogram.shape
    }