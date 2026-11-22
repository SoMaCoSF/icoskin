#!/usr/bin/env python3
"""ISM-SCS vendor bucket: validate + compute fit scores (SOM-DOC-10914).

fit_score = weighted mean of five evidence-linked dimensions.
Hard rules (the template's failure modes, made impossible):
  - placeholder/.example emails are rejected
  - every dimension needs an evidence_url
  - fit_score is computed here, never trusted from the file
Usage: python3 rate.py targets.json
"""
import json, sys

WEIGHTS = {"capability_match": 0.35, "scale_fit": 0.20, "materials_access": 0.20,
           "evidence_quality": 0.15, "reachability": 0.10}

def validate(t):
    errs = []
    em = t.get("contact", {}).get("email")
    if em is None:
        # null email is honest when the vendor publishes none (form only) —
        # but then the contact must be marked unverified with a source.
        if t.get("contact", {}).get("email_verified"):
            errs.append(f"{t.get('name')}: null email but email_verified=true")
    elif ".example" in em or "example." in em or not em:
        errs.append(f"{t.get('name')}: placeholder email")
    if not t.get("contact", {}).get("source_url"):
        errs.append(f"{t.get('name')}: contact has no source_url")
    dims = t.get("rating", {}).get("dimensions", {})
    for k in WEIGHTS:
        d = dims.get(k)
        if not d: errs.append(f"{t.get('name')}: missing dimension {k}")
        elif not d.get("evidence_url"): errs.append(f"{t.get('name')}: dimension {k} has no evidence_url")
    return errs

def fit_score(t):
    dims = t["rating"]["dimensions"]
    return round(sum(dims[k]["score"] * w for k, w in WEIGHTS.items()), 2)

if __name__ == "__main__":
    data = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "targets.json"))
    bad = 0
    for t in data["targets"]:
        errs = validate(t)
        if errs:
            bad += 1; [print("REJECT:", e) for e in errs]; continue
        print(f"{t['name']}: fit_score = {fit_score(t)} (computed) · status {t['status']}")
    print(f"{len(data['targets'])} targets, {bad} rejected")
