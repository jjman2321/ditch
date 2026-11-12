/** Layout for legal and info pages: small effective line, H1, optional "short version", then the text in a 680px column. */
export function Doc({ effective, title, short, children }: { effective?: string; title: string; short?: { t: string; d: string }[]; children: React.ReactNode }) {
  return (
    <div className="wrap doc">
      {effective ? <p className="effective">{effective}</p> : null}
      <h1>{title}</h1>
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
