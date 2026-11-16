// "Your rights when you cancel" on every cancel guide (DECISIONS #60, item 5).
// The law as we read it, dated and sourced, never legal advice, and never a
// claim that Ditch enforces or cancels anything. Same data as the app.

import rights from '@/data/rights.json';
import { formatDate } from '@/lib/data';

type Link = { label: string; url: string };
type Region = { id: string; title: string; text: string; sources: Link[]; help?: Link };

const REGIONS = rights.regions as Region[];
const US = ['us', 'ca-ny'];

function Card({ r }: { r: Region }) {
  return (
    <div>
      <h3>{r.title}</h3>
      <p>{r.text}</p>
      <p className="g5-r-src">
        {r.sources.map((s, i) => (
          <span key={s.url}>
            {i ? ' · ' : 'Source: '}
            <a href={s.url} rel="noopener">
              {s.label}
            </a>
          </span>
        ))}
        {r.help ? (
          <>
            <br />
            Help:{' '}
            <a href={r.help.url} rel="noopener">
              {r.help.label}
            </a>
          </>
        ) : null}
      </p>
    </div>
  );
}

export function YourRights() {
  const us = REGIONS.filter((r) => US.includes(r.id));
  const rest = REGIONS.filter((r) => !US.includes(r.id));
  return (
    <section className="v4-sec" id="rights" aria-labelledby="rights-h">
      <h2 id="rights-h">Your rights when you cancel</h2>
      <p className="g5-sub">
        The law as we read it, checked <time dateTime={rights.about.checked}>{formatDate(rights.about.checked)}</time>. Not legal advice.
      </p>
      <div className="g5-facts g5-rights">
        {us.map((r) => (
          <Card key={r.id} r={r} />
        ))}
      </div>
      <details className="g5-rights-more">
        <summary>In the UK, the EU, Germany or France</summary>
        <div className="g5-facts g5-rights">
          {rest.map((r) => (
            <Card key={r.id} r={r} />
          ))}
        </div>
      </details>
    </section>
  );
}
