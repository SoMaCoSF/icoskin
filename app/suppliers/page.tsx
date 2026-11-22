import Tabs from '../Tabs';
import bucket from '../../outreach/targets.json';
import knowledge from '../../engine/knowledge/ism_scs_scraped_knowledge.json';

type Dim = { score: number; evidence_url: string; note?: string };
type Target = {
  name: string; sector: string; capabilities: string[];
  contact: { email: string | null; email_verified: boolean; source_url: string };
  rating: { dimensions: Record<string, Dim>; fit_score: number };
  status: string; notes: string;
};
const targets = (bucket as { targets: Target[] }).targets;
const DIM_LABEL: Record<string, string> = {
  capability_match: 'Capability', scale_fit: 'Scale fit', materials_access: 'Materials',
  evidence_quality: 'Evidence', reachability: 'Reachability',
};

export default function Suppliers() {
  return (
    <div className="wrap">
      <header className="top">
        <div className="wordmark">
          <div className="logo" />
          <div>
            <div style={{ fontSize: '1.3rem', color: 'var(--fg)', letterSpacing: '0.06em', fontWeight: 600 }}>ICOSKIN</div>
            <div className="subtitle">Suppliers — the capture &amp; rating bucket</div>
          </div>
        </div>
        <div className="stats"><span className="faint">SOMACOSF</span></div>
      </header>
      <Tabs active="suppliers" />
      <section className="panel">
        <h2>SUPPLIER BUCKET — CAPTURED &amp; RATED (SOM-DOC-10914)</h2>
        <p>
          Every entry validated against the bucket schema; fit score is a weighted mean of five
          evidence-linked dimensions (capability 0.35 · scale 0.20 · materials 0.20 · evidence 0.15 ·
          reachability 0.10), computed by <span className="mono">outreach/rate.py</span> — never assigned.
          Contacts are published addresses read from the vendor&apos;s own site, or honestly null.
          Nothing here has been contacted; outreach drafts wait for a founder tap.
        </p>
        <table>
          <thead><tr><th>Supplier</th><th>Sector</th><th>Contact</th><th className="n">Fit</th><th>Status</th></tr></thead>
          <tbody>
            {targets.map((t) => (
              <tr key={t.name}>
                <td><b>{t.name}</b><div className="faint" style={{ fontSize: '0.8em' }}>{t.capabilities.join(' · ')}</div></td>
                <td>{t.sector}</td>
                <td>{t.contact.email ? <>{t.contact.email}<div className="faint" style={{ fontSize: '0.8em' }}>{t.contact.email_verified ? 'verified on own site' : 'unverified'}</div></> : <span className="faint">form only — no published email</span>}</td>
                <td className="n"><b>{t.rating.fit_score.toFixed(2)}</b></td>
                <td><span className="tag ok">{t.status.toUpperCase()}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {targets.map((t) => (
          <div key={t.name} style={{ marginTop: 14 }}>
            <b>{t.name}</b> — <span className="faint">{t.notes}</span>
            <table>
              <tbody>
                {Object.entries(t.rating.dimensions).map(([k, d]) => (
                  <tr key={k}><td>{DIM_LABEL[k] || k}</td><td className="n">{d.score}/10</td><td><a href={d.evidence_url}>evidence</a>{d.note ? <span className="faint"> — {d.note}</span> : null}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>
      <section className="panel">
        <h2>INGESTED PARAMETERS — KNOWLEDGE BASE</h2>
        <p>Manufacturer-datasheet values ingested via Firecrawl (engine/knowledge/ism_scs_scraped_knowledge.json). Nulls are honest: not published as numbers, not invented.</p>
        {(knowledge as { entries: { id: string; subject: string; grade: string; properties: Record<string, unknown>; design_implication: string }[] }).entries.map((e) => (
          <div key={e.id} style={{ marginTop: 12 }}>
            <b>{e.subject}</b> <span className="tag warn">{e.grade}</span>
            <table><tbody>
              {Object.entries(e.properties).map(([k, v]) => (
                <tr key={k}><td>{k}</td><td>{v === null ? <span className="faint">not published — null</span> : String(v)}</td></tr>
              ))}
            </tbody></table>
            <p className="faint">{e.design_implication}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
