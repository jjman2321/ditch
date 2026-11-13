import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EmailBox } from '@/components/EmailBox';
import { YourCountryPrices, type CountryPrices } from '@/components/YourCountryPrices';
import { Logo } from '@/components/Logo';
import { ToolCard } from '@/components/ToolCard';
import { toolsFor } from '@/lib/tools';
import { COUNTRIES, COUNTRY, dateRange, inCountry, priceChanges, defaultPlan, formatDate, host, guideById, isAppStorePrice, neighbours, priceHubServices, pubDates, serviceById, verifiedPrices, type PriceRow, idOf, inWhere, slugOf } from '@/lib/data';
import { formatMoney, monthlyMinor } from '@/lib/money';
import { COMPANY, SITE, SUPPORT_EMAIL } from '@/lib/site';

export function generateStaticParams() {
  return priceHubServices().map((s) => ({ slug: slugOf(s.id) }));
}

const money = (r: PriceRow, minor: number) => formatMoney(minor, r.currency, { country: r.country, whole: true });

function range(r: PriceRow) {
  const monthly = r.plans.filter((p) => p.cycle === 'monthly').sort((a, b) => a.amountMinor - b.amountMinor);
  if (!monthly.length) {
    const p = defaultPlan(r);
    return `${money(r, p.amountMinor)} a ${p.cycle === 'yearly' ? 'year' : 'quarter'}`;
  }
  const lo = monthly[0];
  const hi = monthly[monthly.length - 1];
  return lo === hi ? `${money(r, lo.amountMinor)} a month` : `${money(r, lo.amountMinor)} to ${money(r, hi.amountMinor)} a month`;
}

function cheapest(r: PriceRow) {
  const open = r.plans.filter((p) => !/student/i.test(p.name));
  return [...(open.length ? open : r.plans)].sort((a, b) => monthlyMinor(a.amountMinor, a.cycle) - monthlyMinor(b.amountMinor, b.cycle))[0];
}

function summary(name: string, rows: PriceRow[]) {
  const pick = ['US', 'GB'].map((c) => rows.find((r) => r.country === c)).filter(Boolean) as PriceRow[];
  const use = pick.length ? pick : rows.slice(0, 2);
  const parts = use.map((r) => `${range(r)} in ${inCountry(r.country)}`);
  return `${name} costs ${parts.join(' and ')}.`;
}

/** "Netflix price 2026: from $8.99/mo in the US". The answer in the title, from the cheapest monthly plan we list. */
function titleFor(name: string, year: string, rows: PriceRow[]) {
  const r = rows.find((x) => x.country === 'US') ?? rows.find((x) => x.country === 'GB');
  const all = r?.plans.filter((p) => p.cycle === 'monthly' && !/student/i.test(p.name)).sort((a, b) => a.amountMinor - b.amountMinor) ?? [];
  // "Google AI Pro" is a tier: quote the Pro plan, not the cheaper Plus plan sold on the same page.
  const tier = name.split(' ').pop()!.toLowerCase();
  const named = ['pro', 'plus', 'premium', 'max', 'ultra'].includes(tier) ? all.filter((p) => p.name.toLowerCase().split(/\s+/).includes(tier)) : [];
  const monthly = named[0] ?? all[0];
  if (!r || !monthly) return `${name} price ${year} ${inWhere(rows)}`;
  const where = r.country === 'US' ? 'the US' : 'the UK';
  const amt = formatMoney(monthly.amountMinor, r.currency, { country: r.country });
  return named[0] ? `${name} price ${year}: ${amt}/mo in ${where}` : `${name} price ${year}: from ${amt}/mo in ${where}`;
}

export async function generateMetadata({ params }: PageProps<'/prices/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const id = idOf(slug) ?? '';
  const s = serviceById(id);
  const rows = verifiedPrices(id);
  if (!s || !priceHubServices().some((x) => x.id === s.id)) return {};
  const latest = rows.map((r) => r.checked).sort().pop()!;
  return {
    title: titleFor(s.name, latest.slice(0, 4), rows),
    description: `${summary(s.name, rows)} Main plans ${inWhere(rows)}, checked ${dateRange(rows.map((r) => r.checked))}.`,
    alternates: { canonical: `/prices/${slugOf(s.id)}` },
    openGraph: { title: `${s.name} prices ${inWhere(rows)}`, url: `/prices/${slugOf(s.id)}`, type: 'article', siteName: 'Ditch: Subscription Tracker', locale: 'en_US', images: [{ url: '/og/prices.png', width: 1200, height: 630, alt: `Subscription prices in ${COUNTRIES.length} countries` }] },
    twitter: { card: 'summary_large_image', images: ['/og/prices.png'] },
  };
}

export default async function PriceHub({ params }: PageProps<'/prices/[slug]'>) {
  const { slug } = await params;
  const id = idOf(slug) ?? '';
  const s = serviceById(id);
  const rows = verifiedPrices(id);
  if (!s || !priceHubServices().some((x) => x.id === s.id)) notFound();
  const latest = rows.map((r) => r.checked).sort().pop()!;
  const guide = guideById(s.id);
  // Research notes stay in the data. The page says only what a reader needs.
  const appRows = rows.filter(isAppStorePrice);
  const appShare = appRows.length / rows.length;
  const notes: { c: string; n: string }[] = [];
  if (appRows.length) notes.push({ c: 'iPhone app prices', n: appShare > 0.5 ? `Most prices here are what ${s.name} charges when you subscribe in its iPhone app, from Apple’s in-app price list. Prices on ${s.name}’s website can be different.` : `Rows marked “iPhone app price” are what you pay when you subscribe in the iPhone app. Prices on the website can be different.` });
  if (rows.some((r) => ['AE', 'SA', 'EG'].includes(r.country))) notes.push({ c: 'Middle East', n: 'Some services don’t say whether VAT is included. Where Apple bills you, its prices include VAT.' });
  const taxNote = rows.some((r) => ['US', 'CA'].includes(r.country)) ? ` ${rows.some((r) => r.country === 'CA') ? 'US and Canada prices are' : 'US prices are'} before sales tax.` : '';
  const ans = `${summary(s.name, rows)}${appShare > 0.5 ? ' These are iPhone app prices.' : ''}${taxNote} Checked ${dateRange(rows.map((r) => r.checked))}.`;
  const others = neighbours(priceHubServices().filter((x) => x.category === s.category), s.id, 5);

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${s.name} prices ${inWhere(rows)}`,
      description: ans,
      ...pubDates(latest),
      author: { '@type': 'Organization', '@id': `${SITE}/#org`, name: COMPANY, url: SITE },
      publisher: { '@type': 'Organization', name: COMPANY, url: SITE },
      mainEntityOfPage: `${SITE}/prices/${slugOf(s.id)}`,
      citation: [...new Set(rows.map((r) => r.source))],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Prices', item: `${SITE}/prices` },
        { '@type': 'ListItem', position: 3, name: s.name, item: `${SITE}/prices/${slugOf(s.id)}` },
      ],
    },
  ];

  const cards: CountryPrices[] = rows.map((r) => ({ country: r.country, name: COUNTRY[r.country].name, tax: COUNTRY[r.country].tax, currency: r.currency, checked: formatDate(r.checked), source: r.source, sourceLabel: isAppStorePrice(r) ? 'App Store' : host(r.source), appStore: isAppStorePrice(r), plans: r.plans.map((p) => ({ id: p.id, name: p.name, amountMinor: p.amountMinor, cycle: p.cycle })) }));
  const many = rows.length > 1;

  const history = priceChanges().filter((c) => c.serviceId === s.id);
  const home = rows.find((r) => r.country === 'US') ?? rows[0];
  const homeCheap = home ? cheapest(home) : undefined;
  const toc = [
    { id: 'ycp-h', label: 'Your country' },
    ...(many ? [{ id: 'all', label: 'Price by country' }, { id: 'cheapest', label: 'Cheapest plan in each country' }] : []),
    ...(history.length ? [{ id: 'history', label: 'Price history' }] : []),
    ...(notes.length ? [{ id: 'notes', label: 'Good to know' }] : []),
    ...(guide || others.length ? [{ id: 'more', label: 'Related' }] : []),
  ];

  return (
    <div className="wrap guide gv3 v4 guide4 pricepage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/prices">Prices</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">{s.name}</span>
      </nav>
      <div className="g4">
        <article className="g4-main">
          <div className="kick">
            <Logo id={s.id} size={40} />
            <span>
              Checked <time dateTime={latest}>{dateRange(rows.map((r) => r.checked))}</time>
              {appShare > 0.5 ? ' · App Store prices' : ''}
            </span>
          </div>
          <h1>
            {s.name} price {latest.slice(0, 4)}
          </h1>
          <p className="lead">{ans.replace(/ Checked [^.]*\.$/, '')}</p>

          <YourCountryPrices service={s.name} rows={cards} />

          {many ? (
            <>
              <section className="v4-sec" aria-labelledby="all">
                <h2 id="all">{s.name} price by country</h2>
                <div className="ctbl" role="table" aria-label={`${s.name} plans by country`}>
                  {rows.map((r) => (
                    <div className="ctr" role="row" id={COUNTRY[r.country].slug} key={r.country}>
                      <div className="cc" role="rowheader">
                        <b>{COUNTRY[r.country].name}</b>
                        <small>
                          {isAppStorePrice(r) ? 'iPhone app · ' : ''}
                          {COUNTRY[r.country].tax}
                        </small>
                      </div>
                      <div className="cp" role="cell">
                        {r.plans.map((p) => (
                          <span key={p.id}>
                            {p.name} <b className="num">{formatMoney(p.amountMinor, r.currency, { country: r.country })}{p.cycle === 'monthly' ? '/mo' : p.cycle === 'yearly' ? '/yr' : p.cycle === 'quarterly' ? '/qtr' : '/wk'}</b>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="g-src">
                  Each country’s own money; we never add different currencies together. <Link href="/how-we-check">How we check prices</Link>.
                </p>
              </section>

              <section className="v4-sec" aria-labelledby="cheapest">
                <h2 id="cheapest">The cheapest {s.name} plan in each country</h2>
                <ul className="good">
                  {rows.map((r) => {
                    const p = cheapest(r);
                    return (
                      <li key={r.country}>
                        {s.name} price in {inCountry(r.country)}: {p.name}, {formatMoney(p.amountMinor, r.currency, { country: r.country, whole: true })} {p.cycle === 'monthly' ? 'a month' : p.cycle === 'yearly' ? 'a year' : 'every 3 months'}.
                      </li>
                    );
                  })}
                </ul>
              </section>
            </>
          ) : null}

          {history.length ? (
            <section className="v4-sec" aria-labelledby="history">
              <h2 id="history">{s.name} price history</h2>
              <ul className="good">
                {history.map((c) => (
                  <li key={`${c.country}-${c.plan}-${c.when}`}>
                    <b>{formatDate(c.when)}</b>, {c.plan} in {inCountry(c.country)}: {formatMoney(c.oldPrice, c.currency, { country: c.country })} → {formatMoney(c.newPrice, c.currency, { country: c.country })} ({c.pct < 0 ? '−' : '+'}{Math.round(Math.abs(c.pct))}%).{' '}
                    <a href={c.source} rel="noopener" className="src-a">
                      Source
                    </a>
                  </li>
                ))}
              </ul>
              <p className="g-src">
                <Link href="/price-changes">Every subscription price increase →</Link>
              </p>
            </section>
          ) : null}

          {notes.length ? (
            <section className="v4-sec" aria-labelledby="notes">
              <h2 id="notes">Good to know</h2>
              <ul className="good">
                {notes.map((x) => (
                  <li key={x.c + x.n}>
                    <b>{x.c}:</b> {x.n}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="g-feedback">
            <b>Spotted a different price?</b> <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${s.name} price changed`)}&body=${encodeURIComponent('Country:\nPlan:\nPrice you saw:\nWhere:\n')}`}>Tell us</a>
            <span className="g-hint"> Opens your email app.</span>
          </p>
        </article>

        <aside className="g4-side" aria-label="Summary">
          <div className="g4-stick">
            {homeCheap && home ? (
              <div className="qa-card">
                <p className="k">Cheapest in {home.country === 'US' ? 'the US' : COUNTRY[home.country].name}</p>
                <p>
                  <b className="num big-s">{formatMoney(homeCheap.amountMinor, home.currency, { country: home.country })}</b> {homeCheap.cycle === 'monthly' ? 'a month' : homeCheap.cycle === 'yearly' ? 'a year' : 'every 3 months'} for {homeCheap.name}.
                </p>
                <a className="btn" href="#remind">
                  Get a reminder before it renews
                </a>
              </div>
            ) : null}
            <nav className="toc4" aria-label="On this page">
              <p className="k">On this page</p>
              {toc.map((x) => (
                <a key={x.id} href={`#${x.id}`}>
                  {x.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      <section className="v4-cta" id="remind" aria-labelledby="remind-h" data-has-cta>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/duck.webp" alt="" width={96} height={56} className="duck" />
        <div>
          <h2 id="remind-h">Paying for {s.name}?</h2>
          <p>Ditch reminds you 3 days and 1 day before it renews, so you can decide before you pay.</p>
        </div>
        <EmailBox source={`prices-${s.id}`} bare />
      </section>

      {guide || others.length ? (
        <section className="v4-sec" aria-labelledby="more">
          <h2 id="more">Related</h2>
          <div className="tgrid">
            {toolsFor(s.id).slice(0, 2).map((t) => (
              <ToolCard key={t.href} item={t} />
            ))}
            {guide ? (
              <Link className="tcard" href={`/cancel/${slugOf(s.id)}`}>
                <Logo id={s.id} size={44} />
                <span>
                  <b>How to cancel {s.name}</b>
                  <small>Official steps, dated</small>
                </span>
              </Link>
            ) : null}
            {others.slice(0, Math.max(2, 5 - toolsFor(s.id).slice(0, 2).length)).map((o) => (
              <Link key={o.id} className="tcard" href={`/prices/${slugOf(o.id)}`}>
                <Logo id={o.id} size={44} />
                <span>
                  <b>{o.name} prices</b>
                  <small>Every plan, every country we check</small>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="g4-foot">
        <p className="disc">
          {s.name} is a trademark of its owner. Ditch isn’t affiliated with or endorsed by {s.name}. Prices can change at any time; the service’s own page is always right. © {latest.slice(0, 4)} {COMPANY}.
        </p>
      </section>
    </div>
  );
}
