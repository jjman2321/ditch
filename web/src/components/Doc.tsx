/** Layout for legal and info pages: small effective line, H1, optional "short version", then the text in a 680px column.
 *  kind="legal" (privacy, terms): plain policy look like ankidecks.ai (owner, Nov 20): H1, "Last updated" under it, then the text. */
export function Doc({ effective, title, short, children, kind }: { effective?: string; title: string; short?: { t: string; d: string }[]; children: React.ReactNode; kind?: string }) {
  return (
    <div className={`wrap doc v4${kind ? ` ${kind}` : ''}`}>
      {effective && kind !== 'legal' ? <p className="effective">{effective}</p> : null}
      <h1>{title}</h1>
      {effective && kind === 'legal' ? <p className="updated">{effective}</p> : null}
      {short ? (
        <div className="short">
          <ul className="ticks" style={{ marginTop: 0 }}>
            {short.map((s) => (
              <li key={s.t}>
                {s.t}
                <span>{s.d}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="prose">{children}</div>
    </div>
  );
}
