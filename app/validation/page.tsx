import Tabs from '../Tabs';
import harness from '../../validation/claims.json';

type Claim = { id: string; claim: string; ours: number; unit: string; source_ours: string; wolfram_query: string; wolfram_result: number; tolerance: number; verdict: string };
const claims = (harness as { claims: Claim[] }).claims;
const wa = (q: string) => 'https://www.wolframalpha.com/input?i=' + encodeURIComponent(q);

export default function Validation() {
  const pass = claims.filter((c) => c.verdict === 'PASS').length;
  return (
    <div className="wrap">
      <header className="top">
        <div className="wordmark">
          <div className="logo" />
          <div>
            <div style={{ fontSize: '1.3rem', color: 'var(--fg)', letterSpacing: '0.06em', fontWeight: 600 }}>ICOSKIN</div>
            <div className="subtitle">Validation — WolframAlpha test harness</div>
          </div>
        </div>
        <div className="stats"><span className="ok">{pass}/{claims.length} PASS</span><span className="faint">SOMACOSF</span></div>
      </header>
      <Tabs active="validation" />
      <section className="panel">
        <h2>WOLFRAM VALIDATION HARNESS (SOM-DOC-10915)</h2>
        <p>
          Every load-bearing number in the model, checked against an independent arithmetic engine.
          WolframAlpha results were recorded verbatim from wolframalpha.com runs on 2026-11-22;
          the harness (<span className="mono">validation/run_harness.py</span>) re-judges the recorded
          values against tolerance and prints a re-run link per claim. A number that cannot survive
          this table does not ship in the brief.
        </p>
        <table>
          <thead><tr><th>Claim</th><th className="n">Ours</th><th className="n">WolframAlpha</th><th>Verdict</th><th></th></tr></thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id}>
                <td><b>{c.id}</b><div>{c.claim}</div><div className="faint" style={{ fontSize: '0.8em' }}>{c.source_ours}</div></td>
                <td className="n">{c.ours} {c.unit}</td>
                <td className="n">{c.wolfram_result} {c.unit}</td>
                <td><span className="tag ok">{c.verdict}</span></td>
                <td><a href={wa(c.wolfram_query)}>re-run</a></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="faint">
          Independent review layer: Argon physics review (verdicts FICTION / MARGINAL / SOUND per claim)
          is filed in the repo at reviews/argon-corelogic-review.md (SOM-DOC-10913) and summarised in §11 of the brief.
        </p>
      </section>
    </div>
  );
}
