#!/usr/bin/env python3
"""Run the ISM-SCS compiler (with the field fix applied) and emit receipts.
Usage: .venv/bin/python run_compile.py [imbuuid] [mode_n] [mode_m] [freq_hz]
Outputs: examples/<imbuuid>_receipt.json, _netlist.cir, _sinogram.png
"""
import sys, os, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import ism_scs_field_fix as fix
eng = fix.apply()

imbuuid = sys.argv[1] if len(sys.argv) > 1 else "S3:F14:H05"
mode_n = int(sys.argv[2]) if len(sys.argv) > 2 else 5
mode_m = int(sys.argv[3]) if len(sys.argv) > 3 else 3
freq = float(sys.argv[4]) if len(sys.argv) > 4 else 432.0

cfg = eng.GeoHexTileConfig(imbuuid=imbuuid, normal_vector=(0.577, 0.577, 0.577),
                           radius_mm=25.0, freq_hz=freq, mode_n=mode_n, mode_m=mode_m)
t0 = time.time()
c = eng.CymaticCircuitCompiler(cfg)
pot = c.compute_chladni_field()
g = c.extract_mycelial_graph(pot)
spice = c.generate_spice_netlist(g)
sino = c.generate_cal_tomographic_sinogram(g["skeleton_mask"])
dt = time.time() - t0

os.makedirs("examples", exist_ok=True)
slug = imbuuid.replace(":", "-")
receipt = {"imbuuid": imbuuid, "mode_n": mode_n, "mode_m": mode_m, "freq_hz": freq,
           "field_fix": "raw eigenmode superposition (ism_scs_field_fix.py)",
           "skeleton_px": int(g["skeleton_mask"].sum()),
           "core_nodes": len(g["fe_mg_core_nodes"]),
           "sinogram_shape": list(sino.shape), "spice_lines": len(spice.splitlines()),
           "compile_time_s": round(dt, 2)}
open(f"examples/{slug}_receipt.json", "w").write(json.dumps(receipt, indent=1))
open(f"examples/{slug}_netlist.cir", "w").write(spice)
try:
    from PIL import Image
    Image.fromarray(sino).save(f"examples/{slug}_sinogram.png")
except ImportError:
    np.save(f"examples/{slug}_sinogram.npy", sino)
print(json.dumps(receipt, indent=1))
