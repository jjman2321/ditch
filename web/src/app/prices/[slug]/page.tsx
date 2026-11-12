import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EmailBox } from '@/components/EmailBox';
import { Logo } from '@/components/Logo';
import { PriceTable } from '@/components/PriceTable';
import { COUNTRY, dateRange, defaultPlan, guideById, isAppStorePrice, neighbours, priceHubServices, pubDates, serviceById, verifiedPrices, type PriceRow } from '@/lib/data';
import { formatMoney, monthlyMinor } from '@/lib/money';
import { AUTHOR, COMPANY, SITE, SUPPORT_EMAIL } from '@/lib/site';

export function generateStaticParams() {
  return priceHubServices().map((s) => ({ slug: s.id }));
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

export async function generateMetadata({ params }: PageProps<'/prices/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceById(slug);
  const rows = verifiedPrices(slug);
  if (!s || rows.length < 6) return {};
  const latest = rows.map((r) => r.checked).sort().pop()!;
  return {
    title: `${s.name} price ${latest.slice(0, 4)} in ${rows.length} countries`,
    description: `${summary(s.name, rows)} Main plans in ${rows.length} countries, checked ${dateRange(rows.map((r) => r.checked))}.`,
    alternates: { canonical: `/prices/${s.id}` },
    openGraph: { title: `${s.name} prices in ${rows.length} countries`, url: `/prices/${s.id}`, type: 'article', siteName: 'Ditch: Subscription Tracker', locale: 'en_US', images: [{ url: '/og/prices.png', width: 1200, height: 630, alt: 'Subscription prices in 17 countries' }] },
    twitter: { card: 'summary_large_image', images: ['/og/prices.png'] },
  };
}

export default async function PriceHub({ params }: PageProps<'/prices/[slug]'>) {
  const { slug } = await params;
  const s = serviceById(slug);
  const rows = verifiedPrices(slug);
  if (!s || rows.length < 6) notFound();
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
      headline: `${s.name} prices in ${rows.length} countries`,
      description: ans,
      ...pubDates(latest),
      author: { '@type': 'Person', name: AUTHOR.name, url: `${SITE}${AUTHOR.url}` },
      publisher: { '@type': 'Organization', name: COMPANY, url: SITE },
      mainEntityOfPage: `${SITE}/prices/${s.id}`,
      citation: [...new Set(rows.map((r) => r.source))],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Prices', item: `${SITE}/prices` },
        { '@type': 'ListItem', position: 3, name: s.name, item: `${SITE}/prices/${s.id}` },
      ],
    },
  ];

  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>›</span>
        <Link href="/prices">Prices</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">{s.name}</span>
      </nav>
      <div className="art">
        <article>
          <div className="title-row">
            <Logo id={s.id} size={48} />
            <span className="pill">{s.category}</span>
          </div>
          <h1>
            {s.name} prices in {latest.slice(0, 4)}
          </h1>
          <div className="metarow">
            <span className="pill ok">
              Prices checked <time dateTime={latest}>{dateRange(rows.map((r) => r.checked))}</time>
            </span>
            <span>
              {appShare > 0.5 ? 'from Apple’s in-app price list' : `on ${s.name}’s own pages`} · By <Link href={AUTHOR.url}>{AUTHOR.name}</Link>
            </span>
          </div>
          <div className="answer">
            <span className="lbl">Short answer</span>
            <p>{ans}</p>
          </div>

          <nav className="cstrip" aria-label="Jump to a country">
            {rows.map((r) => (
              <a key={r.country} href={`#${COUNTRY[r.country].slug}`}>
                {COUNTRY[r.country].short}
              </a>
            ))}
          </nav>
          <h2 id="all" style={{ marginTop: 20 }}>
            {s.name} price by country
          </h2>
          <PriceTable serviceId={s.id} caption={`${s.name}’s main plans by country. Each country links to the page we checked.`} />
          <p className="meta" style={{ marginTop: 12 }}>
            A year = monthly × 12, every 3 months × 4, yearly as charged. Prices are in each country’s own money, and we never add different currencies together. <Link href="/how-we-check">How we check prices</Link>.
          </p>

          <h2 id="cheapest">The cheapest {s.name} plan in each country</h2>
          <ul className="plain">
            {rows.map((r) => {
              const p = cheapest(r);
              return (
                <li key={r.country}>
                  <span>
                    {s.name} price in {COUNTRY[r.country].name}: {p.name}
                  </span>
                  <span>
                    {formatMoney(p.amountMinor, r.currency, { country: r.country, whole: true })} {p.cycle === 'monthly' ? 'a month' : p.cycle === 'yearly' ? 'a year' : 'every 3 months'}
                  </span>
                </li>
              );
            })}
          </ul>

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

          <div className="appcard" data-has-cta>
            <div>
              <h2 className="h3" style={{ margin: 0 }}>
                Paying for {s.name}?
              </h2>
              <p>Ditch reminds you 3 days and 1 day before it renews, so a charge never surprises you.</p>
              <EmailBox source={`prices-${s.id}`} compact />
            </div>
          </div>

          {guide ? (
            <>
              <h2 id="cancel">Want out?</h2>
              <div className="related" style={{ gridTemplateColumns: 'minmax(0, 1fr)', maxWidth: 420 }}>
                <Link href={`/cancel/${s.id}`}>
                  <Logo id={s.id} size={36} />
                  How to cancel {s.name} →
                </Link>
              </div>
            </>
          ) : null}

          {others.length ? (
            <>
              <h2 id="more">More {s.category.toLowerCase()} prices</h2>
              <div className="related">
                {others.map((o) => (
                  <Link key={o.id} href={`/prices/${o.id}`}>
                    <Logo id={o.id} size={36} />
                    {o.name}
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          <div className="feedback">
            <b>Spotted a different price?</b>
            <a className="btn sm ghost" href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${s.name} price changed`)}&body=${encodeURIComponent('Country:\nPlan:\nPrice you saw:\nWhere:\n')}`}>
              Tell us
            </a>
            <span className="meta">This opens your email app. We re-check it by hand.</span>
          </div>

          <p className="disc">
            {s.name} is a trademark of its owner. Ditch isn’t affiliated with or endorsed by {s.name}. Prices can change at any time; the service’s own page is always right. © {latest.slice(0, 4)} {COMPANY}.
          </p>
        </article>
        <aside>
          <nav className="side-toc" aria-label="On this page">
            <p className="ttl">On this page</p>
            <a href="#all">Price by country</a>
            <a href="#cheapest">Cheapest plan per country</a>
            {notes.length ? <a href="#notes">Good to know</a> : null}
            {guide ? <a href="#cancel">How to cancel</a> : null}
          </nav>
          <div className="side-card">
            <p className="h3">Never get surprised</p>
            <p>A reminder 3 days and 1 day before each charge. Free on 3 subscriptions.</p>
            <Link className="btn block sm" href="/#join">
              Join the waitlist
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
