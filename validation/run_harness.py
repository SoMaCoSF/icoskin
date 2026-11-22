#!/usr/bin/env python3
"""Wolfram validation harness (SOM-DOC-10915).
Compares each recorded claim against its recorded WolframAlpha result and
prints the live Wolfram URL for re-runs. WolframAlpha has no keyless API;
re-runs go through wolframalpha.com (browser) and the new result is written
back into claims.json — the file is the receipt book, this script is the judge.
Usage: python3 run_harness.py [--url-only]
"""
import json, sys, urllib.parse, pathlib
claims = json.loads((pathlib.Path(__file__).parent / "claims.json").read_text())["claims"]
fails = 0
for c in claims:
    url = "https://www.wolframalpha.com/input?i=" + urllib.parse.quote(c["wolfram_query"])
    if "--url-only" in sys.argv:
        print(f"{c['id']}: {url}"); continue
    d = abs(c["ours"] - c["wolfram_result"])
    ok = d <= c["tolerance"]
    fails += 0 if ok else 1
    print(f"{'PASS' if ok else 'FAIL'}  {c['id']:<22} ours={c['ours']}  wolfram={c['wolfram_result']}  |d|={d:.4g} (tol {c['tolerance']})")
    print(f"      re-run: {url}")
print(f"\n{len(claims)-fails}/{len(claims)} PASS")
sys.exit(1 if fails else 0)
