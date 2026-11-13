import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EmailBox } from '@/components/EmailBox';
import { YourCountryPrices, type CountryPrices } from '@/components/YourCountryPrices';
import { Logo } from '@/components/Logo';
import { COUNTRIES, COUNTRY, dateRange, defaultPlan, formatDate, host, guideById, isAppStorePrice, neighbours, priceHubServices, pubDates, serviceById, verifiedPrices, type PriceRow, idOf, inWhere, slugOf } from '@/lib/data';
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
  return [...r.plans].sort((a, b) => monthlyMinor(a.amountMinor, a.cycle) - monthlyMinor(b.amountMinor, b.cycle))[0];
}

function summary(name: string, rows: PriceRow[]) {
  const pick = ['US', 'GB'].map((c) => rows.find((r) => r.country === c)).filter(Boolean) as PriceRow[];
  const use = pick.length ? pick : rows.slice(0, 2);
  const parts = use.map((r) => `${range(r)} in ${r.country === 'US' ? 'the US' : r.country === 'GB' ? 'the UK' : COUNTRY[r.country].name}`);
  return `${name} costs ${parts.join(' and ')}.`;
}

/** "Netflix price 2026: from $8.99/mo in the US". The answer in the title, from the cheapest monthly plan we list. */
function titleFor(name: string, year: string, rows: PriceRow[]) {
  const r = rows.find((x) => x.country === 'US') ?? rows.find((x) => x.country === 'GB');
  const monthly = r?.plans.filter((p) => p.cycle === 'monthly').sort((a, b) => a.amountMinor - b.amountMinor)[0];
  if (!r || !monthly) return `${name} price ${year} ${inWhere(rows)}`;
  const where = r.country === 'US' ? 'the US' : 'the UK';
  return `${name} price ${year}: from ${formatMoney(monthly.amountMinor, r.currency, { country: r.country })}/mo in ${where}`;
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
  const others = neighbours(priceHubServices().filter((x) => x.category === s.category), s.id, 4);

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

  return (
    <div className="wrap guide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/" prefetch={false}>Home</Link>
        <span aria-hidden>›</span>
        <Link href="/prices">Prices</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">{s.name}</span>
      </nav>
      <div className="art">
        <article>
          <header className="g-head">
            <Logo id={s.id} size={56} />
            <h1>
              {s.name} price {latest.slice(0, 4)}
            </h1>
            <p className="g-meta">
              Checked <time dateTime={latest}>{dateRange(rows.map((r) => r.checked))}</time> {appShare > 0.5 ? '· App Store prices' : ''}
            </p>
          </header>
          <p className="g-lead">{ans.replace(/ Checked [^.]*\.$/, '')}</p>

          <YourCountryPrices service={s.name} rows={cards} />

          {many ? (
            <>
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

              <h2 id="cheapest">The cheapest {s.name} plan in each country</h2>
              <ul className="g-list">
                {rows.map((r) => {
                  const p = cheapest(r);
                  return (
                    <li key={r.country}>
                      {s.name} price in {r.country === 'US' ? 'the US' : r.country === 'GB' ? 'the UK' : COUNTRY[r.country].name}: {p.name}, {formatMoney(p.amountMinor, r.currency, { country: r.country, whole: true })} {p.cycle === 'monthly' ? 'a month' : p.cycle === 'yearly' ? 'a year' : 'every 3 months'}.
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}

          {notes.length ? (
            <>
              <h2 id="notes">Good to know</h2>
              {notes.map((x) => (
                <p key={x.c + x.n}>
                  <b>{x.c}:</b> {x.n}
                </p>
              ))}
            </>
          ) : null}

          <section className="appcard" id="remind" aria-labelledby="remind-h" data-has-cta>
            <h2 id="remind-h" className="h3">
              Paying for {s.name}?
            </h2>
            <p>Ditch reminds you 3 days and 1 day before it renews, so you can decide before you pay.</p>
            <EmailBox source={`prices-${s.id}`} bare />
          </section>

          <p className="g-feedback">
            <b>Spotted a different price?</b> <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${s.name} price changed`)}&body=${encodeURIComponent('Country:\nPlan:\nPrice you saw:\nWhere:\n')}`}>Tell us</a>
            <span className="g-hint">Opens your email app.</span>
          </p>

          {guide || others.length ? (
            <>
              <h2 id="more" className="g-more-h">Related</h2>
              <ul className="g-related">
                {guide ? (
                  <li>
                    <Link href={`/cancel/${slugOf(s.id)}`}>
                      <Logo id={s.id} size={28} />
                      How to cancel {s.name}
                    </Link>
                  </li>
                ) : null}
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={`/prices/${slugOf(o.id)}`}>
                      <Logo id={o.id} size={28} />
                      {o.name} prices
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <p className="disc">
            {s.name} is a trademark of its owner. Ditch isn’t affiliated with or endorsed by {s.name}. Prices can change at any time; the service’s own page is always right. © {latest.slice(0, 4)} {COMPANY}.
          </p>
        </article>
        <aside>
          <nav className="side-toc" aria-label="On this page">
            <p className="ttl">On this page</p>
            <a href="#ycp-h">Your country</a>
            {many ? <a href="#all">Price by country</a> : null}
            {many ? <a href="#cheapest">Cheapest plan per country</a> : null}
            {notes.length ? <a href="#notes">Good to know</a> : null}
            {guide ? <a href="#more">How to cancel</a> : null}
          </nav>
          <a className="side-cta" href="#remind">
            Get a reminder before {s.name} renews →
          </a>
        </aside>
      </div>
    </div>
  );
}
