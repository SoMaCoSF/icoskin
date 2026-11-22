"""
ISM-SCS field fix (Witness, 2026-11-22) — patch layer over ism_scs_engine.py.

As shipped, CymaticCircuitCompiler.compute_chladni_field applies a second
cos() transform with a frequency phase shift to the eigenmode superposition.
That moves the extracted "nodal" set off the true nodal lines (Z = 0) onto a
non-zero level set of Z. Level sets of a smooth field do not intersect, so the
skeleton has zero degree>=3 junctions at every threshold (measured:
0 core nodes at thr 0.2-0.72) and every downstream artifact (core nodes,
SPICE netlist) degenerates.

Fix: nodal potential from the raw eigenmode superposition, exp(-Z^2/0.015).
Measured after fix (default tile S3:F14:H05, N5 M3, thr 0.72):
skeleton 3,541 px, 24 Fe-MG core nodes. See example_run_receipt.json.
"""
import numpy as np
from scipy.ndimage import gaussian_filter
import ism_scs_engine as _e


def compute_chladni_field_fixed(self):
    lin = np.linspace(-np.pi, np.pi, self.grid_size)
    X, Y = np.meshgrid(lin, lin)
    n, m = self.cfg.mode_n, self.cfg.mode_m
    wave = np.cos(n * X) * np.cos(m * Y) - np.cos(m * X) * np.cos(n * Y)
    nodal_potential = np.exp(-(wave ** 2) / 0.015)
    nodal_potential = gaussian_filter(nodal_potential, sigma=1.2)
    nodal_potential[~self.hex_mask] = 0.0
    return nodal_potential


def apply():
    _e.CymaticCircuitCompiler.compute_chladni_field = compute_chladni_field_fixed
    return _e
