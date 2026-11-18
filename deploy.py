#!/usr/bin/env python3
"""Deploy icoskin.somacosf.com: git-linked Vercel project over SoMaCoSF/icoskin.
Creates the project (framework nextjs, gitRepository link) if missing, attaches
the domain, creates a production deployment from git main, polls to READY.
One attempt per call; a 402 is reported, not retried.
"""
import json, subprocess, sys, time

TEAM = "team_MJNSdIKAxPJySa21R8pNNlXZ"
CLI = "/opt/hatch/bin/vercel"
DOMAIN = "icoskin.somacosf.com"
NAME = "icoskin"
REPO = "SoMaCoSF/icoskin"
REPO_ID = 1463386540


def call(tool, args):
    r = subprocess.run([CLI, "call-tool", "--name", tool, "--arguments-json", json.dumps(args)],
                       capture_output=True, text=True, timeout=900)
    return r.stdout, r.stderr


def result_of(out):
    try:
        d = json.loads(out)
        r = d.get("result", d)
        if isinstance(r, dict) and "content" in r:
            inner = json.loads(r["content"][0]["text"])
            return inner.get("result", inner)
        return r
    except Exception:
        return {}


def main():
    out, err = call("get_project", {"idOrName": NAME, "teamId": TEAM})
    proj = result_of(out)
    pid = proj.get("id") if isinstance(proj, dict) else None
    if not pid:
        print("get_project: no icoskin project yet; creating (git-linked)")
        out, err = call("create_project", {
            "requestBody": {"name": NAME, "framework": "nextjs",
                            "gitRepository": {"type": "github", "repo": REPO,
                                              "productionBranch": "main"}},
            "teamId": TEAM})
        proj = result_of(out)
        pid = proj.get("id") if isinstance(proj, dict) else None
        print("create_project stdout:", out[:800])
        if err.strip():
            print("create_project STDERR:", err[:400])
    assert pid, "no project id — STOP"
    print("project:", pid)

    out, err = call("add_project_domain", {
        "idOrName": pid, "teamId": TEAM, "requestBody": {"name": DOMAIN}})
    print("add_project_domain:", out[:300])
    if err.strip():
        print("domain STDERR:", err[:300])

    out, err = call("create_deployment", {
        "requestBody": {"name": NAME, "project": pid, "target": "production",
                        "gitSource": {"type": "github", "repoId": REPO_ID, "ref": "main"}},
        "teamId": TEAM})
    print("create_deployment STDOUT:", out[:1200])
    if err.strip():
        print("create_deployment STDERR:", err[:500])
    dep = result_of(out)
    did = dep.get("id")
    print("DEPLOYMENT:", did, dep.get("url"), dep.get("readyState"))
    if not did:
        print("no deployment id — STOP")
        sys.exit(1)

    for i in range(40):
        time.sleep(15)
        out, _ = call("get_deployment", {"idOrUrl": did, "teamId": TEAM})
        d = result_of(out)
        state = d.get("readyState")
        print(f"poll {i}: {state}")
        if state in ("READY", "ERROR", "CANCELED"):
            print("FINAL:", did, d.get("url"), state)
            break


if __name__ == "__main__":
    main()
