/**
 * Small drawn diagrams for the cancel guides, so the page shows instead of tells (owner, Nov 13).
 * All text inside them is real page text: crawlable, read by screen readers, nothing hidden.
 */

/** "Who bills you?" as a bank statement: the line people actually see, pointing to the right section. */
export function StatementDiagram({ name, apple, google, appleOnly = false }: { name: string; apple: boolean; google: boolean; appleOnly?: boolean }) {
  const rows = [
    appleOnly ? { line: 'APPLE.COM/BILL', who: 'Apple', href: '#direct' } : { line: `${name.toUpperCase()}…`, who: name, href: '#direct' },
    ...(apple ? [{ line: 'APPLE.COM/BILL', who: 'Apple', href: '#apple' }] : []),
    ...(google ? [{ line: 'GOOGLE *…', who: 'Google Play', href: '#google' }] : []),
    { line: 'Your phone, internet or TV company', who: 'Someone else', href: '#partner', plain: true },
  ];
  return (
    <figure className="stmt" aria-labelledby="stmt-cap">
      <figcaption id="stmt-cap">
        <b>Who bills you?</b> Find the charge on your bank statement.
      </figcaption>
      <ul>
        {rows.map((r) => (
          <li key={r.who}>
            <a href={r.href}>
              <span className={r.plain ? 'ln plain' : 'ln'}>{r.line}</span>
              <span className="arrow" aria-hidden>
                →
              </span>
              <span className="who">{r.who}</span>
            </a>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** "Have this ready" as two chips. */
export function ReadyChips({ email }: { email: string }) {
  return (
    <ul className="ready">
      <li>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        <span>
          <b>{email}</b>
          <small>Check your inbox for receipts</small>
        </span>
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M2.5 10h19M6 15h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>
          <b>The card it charges</b>
          <small>Handy if you have two accounts</small>
        </span>
      </li>
    </ul>
  );
}

/** The iPhone tap path, drawn as Settings chips. Same words as Apple's steps. */
export function ApplePath({ name }: { name: string }) {
  const chips = ['Settings', 'Your name', 'Subscriptions', name, 'Cancel Subscription'];
  return (
    <ol className="tap-path" aria-label="On your iPhone">
      {chips.map((c, i) => (
        <li key={c} className={i === chips.length - 1 ? 'last' : undefined}>
          {i === 0 ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : null}
          {c}
        </li>
      ))}
    </ol>
  );
}

/** "What happens after you cancel" as a short timeline. Each step keeps its source. */
export function AfterTimeline({ items, src }: { items: { label: string; text: string; source: string }[]; src: (u: string) => React.ReactNode }) {
  return (
    <ol className="tline">
      {items.map((x) => (
        <li key={x.label}>
          <span className="dot" aria-hidden />
          <b>{x.label}</b>
          <p>
            {x.text}
            <span className="g-src">From {src(x.source)}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}
