import type { Metadata } from 'next';
import Link from 'next/link';

import { EmailBox } from '@/components/EmailBox';
import { Logo } from '@/components/Logo';
import { COUNTRY, formatDate, guideById, inCountry, priceChanges, priceChangesChecked, priceHubServices, slugOf } from '@/lib/data';
import { formatMoney } from '@/lib/money';
import { planLabel } from '@/lib/tools';
import { SITE } from '@/lib/site';

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Subscription price increases ${YEAR}: every rise, dated`,
  description: 'Netflix, Spotify, Disney+, YouTube and more: every subscription price rise we could confirm since 2024, with the old and new price, the date and the source.',
  alternates: { canonical: '/price-changes' },
};

const per = (cy: string) => (cy === 'yearly' ? 'a year' : cy === 'quarterly' ? 'every 3 months' : cy === 'weekly' ? 'a week' : 'a month');
const monthKey = (d: string) => d.slice(0, 7);
const monthName = (k: string) => new Date(`${k}-01T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];

/**
 * Price changes (owner pick, Nov 13): a dated list of real price rises, newest first, each with old → new,
 * the rise in %, when it applies and the page that says so. Same v4 layout as the guides.
 */
export default function PriceChanges() {
  const all = priceChanges();
  const rises = all.filter((c) => c.pct > 0);
  const checked = priceChangesChecked();
  const biggest = [...rises].sort((a, b) => b.pct - a.pct)[0];
  const services = [...new Set(all.map((c) => c.serviceId))];
  const months = [...new Set(all.map((c) => monthKey(c.when)))];
  const latest = rises[0];
  const faq = all.length
    ? [
        { q: `Which subscription went up the most?`, a: `${planLabel(biggest.name, biggest.plan)} in ${inCountry(biggest.country)}: ${formatMoney(biggest.oldPrice, biggest.currency, { country: biggest.country })} to ${formatMoney(biggest.newPrice, biggest.currency, { country: biggest.country })} ${per(biggest.cycle)}, ${Math.round(biggest.pct)}% more, from ${formatDate(biggest.when)}.` },
        { q: 'What was the latest price rise?', a: `${planLabel(latest.name, latest.plan)} in ${inCountry(latest.country)} went from ${formatMoney(latest.oldPrice, latest.currency, { country: latest.country })} to ${formatMoney(latest.newPrice, latest.currency, { country: latest.country })} ${per(latest.cycle)} on ${formatDate(latest.when)}.` },
        { q: 'Do price rises apply to people who already pay?', a: 'Usually, yes, but often later than for new subscribers. Each row shows both dates when the company gave them.' },
      ]
    : [];
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: `Subscription price increases ${YEAR}`, dateModified: checked ?? undefined, author: { '@id': `${SITE}/#org` }, publisher: { '@id': `${SITE}/#org` }, mainEntityOfPage: `${SITE}/price-changes` },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Prices', item: `${SITE}/prices` }, { '@type': 'ListItem', position: 2, name: 'Price changes', item: `${SITE}/price-changes` }] },
    ...(faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
  ];
  const hubs = new Set(priceHubServices().map((s) => s.id));

  return (
    <div className="wrap v4 gv3 guide4 pchg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/prices">Prices</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">Price changes</span>
      </nav>
      <header className="v4-hero solo">
        <div>
          <h1>Subscription price increases {YEAR}</h1>
          <p className="lead">
            {all.length
              ? `${rises.length} price rises across ${services.length} subscriptions since 2024, newest first, and the odd price cut. Each one has the old price, the new price, the date and the page that says so.`
              : 'Every subscription price rise we can confirm, with the old price, the new price, the date and the page that says so. The first list is on its way.'}
          </p>
        </div>
      </header>

      {all.length ? (
        <>
          <div className="ch-stats" role="list">
            <div role="listitem">
              <b className="num">{rises.length}</b>
              <span>price rises</span>
            </div>
            <div role="listitem">
              <b className="num">{services.length}</b>
              <span>subscriptions</span>
            </div>
            <div role="listitem">
              <b className="num">+{Math.round(biggest.pct)}%</b>
              <span>
                biggest: {planLabel(biggest.name, biggest.plan)}
              </span>
            </div>
          </div>

          {months.map((m) => (
            <section key={m} className="v4-sec ch-month" aria-labelledby={`m-${m}`}>
              <h2 id={`m-${m}`}>{monthName(m)}</h2>
              <ul className="ch-list">
                {all
                  .filter((c) => monthKey(c.when) === m)
                  .map((c) => (
                    <li key={`${c.serviceId}-${c.country}-${c.plan}-${c.when}`} id={`${slugOf(c.serviceId)}-${c.country.toLowerCase()}-${c.when}`}>
                      <Logo id={c.serviceId} size={44} />
                      <div className="ch-main">
                        <h3>
                          {planLabel(c.name, c.plan)} <span className="ch-c">{COUNTRY[c.country].short ?? c.country}</span>
                        </h3>
                        <p className="ch-price">
                          <s className="num">{formatMoney(c.oldPrice, c.currency, { country: c.country })}</s> <span aria-hidden>→</span>
                          <span className="sr"> to </span>
                          <b className="num">{formatMoney(c.newPrice, c.currency, { country: c.country })}</b> {per(c.cycle)}
                        </p>
                        <p className="ch-when">
                          {c.effectiveNew ? <>New subscribers from {formatDate(c.effectiveNew)}</> : c.announcedOn ? <>Announced {formatDate(c.announcedOn)}</> : null}
                          {c.effectiveExisting ? <> · people already paying from {formatDate(c.effectiveExisting)}</> : null}
                          {' · '}
                          <a href={c.source} rel="noopener">
                            {c.sourceType === 'official' ? `${c.name}’s own page` : host(c.source)}
                          </a>
                        </p>
                      </div>
                      <span className={`ch-pct num${c.pct < 0 ? ' down' : ''}`} aria-label={c.pct < 0 ? `${Math.round(-c.pct)}% less` : `${Math.round(c.pct)}% more`}>
                        {c.pct < 0 ? '−' : '+'}
                        {Math.round(Math.abs(c.pct))}%
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          ))}

          <section className="v4-sec" aria-labelledby="what-now">
            <h2 id="what-now">One of yours went up?</h2>
            <ol className="steps3">
              <li>
                <span className="n" aria-hidden>1</span>
                <span>Check what you pay now on the service’s account page. Price rises often reach people already paying a month or two later.</span>
              </li>
              <li>
                <span className="n" aria-hidden>2</span>
                <span>Look for a cheaper plan: most services now sell a plan with ads, or a yearly plan for less than 12 months of monthly.</span>
              </li>
              <li>
                <span className="n" aria-hidden>3</span>
                <span>
                  Not worth it any more? Each service has a <Link href="/cancel">cancel guide</Link>.
                </span>
              </li>
            </ol>
          </section>

          <section className="v4-sec" aria-labelledby="faq">
            <h2 id="faq">Questions</h2>
            <div className="faq2">
              {faq.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      <section className="v4-cta" aria-labelledby="pc-cta-h" data-has-cta>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/duck.webp" alt="" width={96} height={56} className="duck" />
        <div>
          <h2 id="pc-cta-h">Know before the next charge</h2>
          <p>3 days and 1 day before. Free for 3 subscriptions, Pro covers the rest. iPhone app, coming soon.</p>
        </div>
        <EmailBox source="price-changes" bare />
      </section>

      {all.length ? (
        <section className="v4-sec" aria-labelledby="more">
          <h2 id="more">Prices and cancel guides</h2>
          <div className="tgrid">
            {services.slice(0, 6).map((id) => {
              const name = all.find((c) => c.serviceId === id)!.name;
              const href = hubs.has(id) ? `/prices/${slugOf(id)}` : guideById(id) ? `/cancel/${slugOf(id)}` : null;
              return href ? (
                <Link key={id} className="tcard" href={href}>
                  <Logo id={id} size={44} />
                  <span>
                    <b>{hubs.has(id) ? `${name} prices` : `Cancel ${name}`}</b>
                    <small>{hubs.has(id) ? 'Every plan, every country we check' : 'Official steps, dated'}</small>
                  </span>
                </Link>
              ) : null;
            })}
          </div>
        </section>
      ) : null}

      <section className="g4-foot">
        <p className="disc">
          {checked ? <>Checked {formatDate(checked)}. </> : null}
          Each rise comes from the company’s own page where it published one, otherwise from a major news outlet that quotes both prices. Prices can change again; the service’s own page is always right. <Link href="/how-we-check">How we check</Link>.
        </p>
      </section>
    </div>
  );
}
