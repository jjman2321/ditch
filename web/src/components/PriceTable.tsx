import { COUNTRY, formatDate, host, verifiedPrices } from '@/lib/data';
import { CYCLE_WORD, formatMoney, yearlyMinor } from '@/lib/money';

/**
 * Every verified plan, grouped by country. Each country's header row carries its tax basis, checked date and
 * official source (PLAN.md gate 2). Yearly = exact maths on the stored amount. Currencies are never added.
 * On phones the yearly price moves under the monthly one instead of being hidden.
 */
export function PriceTable({ serviceId, countries, caption }: { serviceId: string; countries?: string[]; caption: string }) {
  const rows = verifiedPrices(serviceId).filter((r) => !countries || countries.includes(r.country));
  return (
    <>
    <p className="tbl-cap" aria-hidden>{caption}</p>
    <div className="tbl-wrap">
    <table className="tbl">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Plan</th>
          <th scope="col" className="r">
            Price
          </th>
          <th scope="col" className="r">
            A year
          </th>
        </tr>
      </thead>
      {rows.map((r) => {
        const c = COUNTRY[r.country];
        return (
          <tbody key={r.country} id={c.slug}>
            <tr className="grp">
              <th colSpan={3} scope="rowgroup">
                <span className="cn">{c.name}</span>
                <span className="sub">
                  {c.tax} · checked <time dateTime={r.checked}>{formatDate(r.checked)}</time> ·{' '}
                  <a href={r.source} rel="noopener">
                    {host(r.source)}
                  </a>
                </span>
              </th>
            </tr>
            {r.plans.map((p) => {
              const year = formatMoney(yearlyMinor(p.amountMinor, p.cycle), r.currency, { country: r.country });
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="r m">
                    {formatMoney(p.amountMinor, r.currency, { country: r.country })}
                    <span className="sr"> {CYCLE_WORD[p.cycle]}</span>
                    <span aria-hidden style={{ fontWeight: 400, color: 'var(--mute)', fontSize: 14 }}>
                      {' '}
                      {p.cycle === 'monthly' ? '/mo' : p.cycle === 'yearly' ? '/yr' : '/qtr'}
                    </span>
                    {p.cycle !== 'yearly' ? <span className="ym">{year} a year</span> : null}
                  </td>
                  <td className="r y">{year}</td>
                </tr>
              );
            })}
          </tbody>
        );
      })}
    </table>
    </div>
    </>
  );
}
