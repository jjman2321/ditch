import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EmailBox } from '@/components/EmailBox';
import { YourCountryPrices, type CountryPrices } from '@/components/YourCountryPrices';
import { Logo } from '@/components/Logo';
import { ToolCard } from '@/components/ToolCard';
import { comparesFor, planLabel, toolsFor } from '@/lib/tools';
import { PriceGrid, type GridCol, type GridRow } from '@/components/PriceGrid';
import { priceText } from '@/lib/priceText';
import { PRICE_SEARCH } from '@/lib/searchNames';
import { COUNTRIES, COUNTRY, dateRange, inCountry, priceChanges, defaultPlan, formatDate, host, guideById, isAppStorePrice, isExtraPlan, neighbours, priceHubServices, pubDates, serviceById, verifiedPrices, type PriceRow, idOf, inWhere, slugOf } from '@/lib/data';
import { CYCLE_WORD, formatMoney, monthlyMinor } from '@/lib/money';
import { COMPANY, SITE, SUPPORT_EMAIL, fitDesc, pageTitle, shareImage } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';

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

const CYCLE_WORDS = /\b(monthly|yearly|annual|billed|months?|years?|quarterly)\b/i;

/** Plans as columns (same plan id in every country), countries as rows. Names lose cycle words; the column says the cycle. */
function buildGrid(service: string, rows: PriceRow[]): { cols: GridCol[]; rows: GridRow[] } {
  const seen = new Map<string, { cy: string; names: Map<string, number> }>();
  for (const r of rows)
    for (const p of r.plans) {
      const e = seen.get(p.id) ?? { cy: p.cycle, names: new Map() };
      e.names.set(p.name, (e.names.get(p.name) ?? 0) + 1);
      seen.set(p.id, e);
    }
  const brand = service.replace(/\s*\(.*\)/, '');
  const esc = brand.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');
  const clean = (n: string) =>
    n
      .replace(new RegExp('^' + esc + '\\s+', 'i'), '')
      .replace(/\s*\(([^)]*)\)/g, (_m, inner: string) => {
        const rest = inner.split(',').map((x) => x.trim()).filter((x) => !CYCLE_WORDS.test(x));
        return rest.length ? ` (${rest.join(', ')})` : '';
      })
      .replace(/^\((.*)\)$/, '$1')
      .trim();
  const cols: GridCol[] = [...seen].map(([id, e]) => {
    const top = [...e.names].sort((a, b) => b[1] - a[1])[0][0];
    const name = clean(top) || (e.cy === 'yearly' ? 'Yearly' : 'Monthly');
    return { id, name, cy: e.cy };
  });
  return {
    cols,
    rows: rows.map((r) => {
      const low = cheapest(r);
      return {
        country: r.country,
        name: COUNTRY[r.country].name,
        slug: COUNTRY[r.country].slug,
        note: `${r.currency} · ${isAppStorePrice(r) ? 'iPhone app, ' : ''}${COUNTRY[r.country].tax}`,
        cells: cols.map((c) => {
          const p = r.plans.find((x) => x.id === c.id);
          return p ? formatMoney(p.amountMinor, r.currency, { country: r.country }) : null;
        }),
        low: cols.findIndex((c) => c.id === low.id),
        // cheapest within each billing cycle, for when the table shows one cycle at a time
        lowBy: Object.fromEntries(
          [...new Set(cols.map((c) => c.cy))].map((cy) => {
            const inCy = r.plans.filter((p) => p.cycle === cy);
            const open = inCy.filter((p) => !/student/i.test(p.name));
            const best = [...(open.length ? open : inCy)].sort((a, b) => a.amountMinor - b.amountMinor)[0];
            return [cy, best ? cols.findIndex((c) => c.id === best.id) : -1];
          }),
        ),
      };
    }),
  };
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
  // One clean pattern (owner, Nov 15): "Netflix prices 2026: every plan, 29 countries | Ditch".
  const n = rows.length;
  const plans = new Set(rows.flatMap((r) => r.plans.map((p) => p.id))).size;
  const where = n > 1 ? `${n} countries` : inWhere(rows).replace(/^in /, '');
  const tries = n === 1 ? [`${name} ${plans > 1 ? 'prices' : 'price'} ${year} ${inWhere(rows)}`, `${name} ${plans > 1 ? 'prices' : 'price'} ${year}`] : plans > 1 ? [`${name} prices ${year}: every plan, ${where}`, `${name} prices ${year}: every plan`] : [`${name} price ${year} in ${where}`, `${name} price ${year}`];
  return tries.find((t) => t.length + 8 <= 60) ?? tries[tries.length - 1];
}

/** The service's own plans (bundles and live TV are listed in their own section). */
const core = (id: string) => verifiedPrices(id).map((r) => ({ ...r, plans: r.plans.filter((p) => !isExtraPlan(id, p)) })).filter((r) => r.plans.length);

export async function generateMetadata({ params }: PageProps<'/prices/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const id = idOf(slug) ?? '';
  const s = serviceById(id);
  const rows = core(id);
  if (!s || !priceHubServices().some((x) => x.id === s.id)) return {};
  const latest = rows.map((r) => r.checked).sort().pop()!;
  const share = shareImage(`p/${slugOf(s.id)}`, `${s.name} prices ${latest.slice(0, 4)}`, 'prices');
  return {
    title: pageTitle(PRICE_SEARCH[s.id]?.title(rows.length) ?? titleFor(s.name, latest.slice(0, 4), rows)),
    description: fitDesc(`${summary(PRICE_SEARCH[s.id]?.who ?? s.name, rows)} Main plans ${inWhere(rows)}, checked ${dateRange(rows.map((r) => r.checked))}.`, `Every price from ${s.name}’s own page.`, guideById(s.id) ? `Plus how to cancel ${s.name}.` : ''),
    alternates: { canonical: `/prices/${slugOf(s.id)}` },
    openGraph: { title: `${s.name} prices ${inWhere(rows)}`, url: `/prices/${slugOf(s.id)}`, type: 'article', siteName: 'Ditch: Subscription Tracker', locale: 'en_US', images: share.images },
    twitter: share.twitter,
  };
}

export default async function PriceHub({ params }: PageProps<'/prices/[slug]'>) {
  const { slug } = await params;
  const id = idOf(slug) ?? '';
  const s = serviceById(id);
  const all = verifiedPrices(id);
  if (!s || !priceHubServices().some((x) => x.id === s.id)) notFound();
  // Bundles and live TV get their own section; everything else on the page is about the service's own plans.
  const rows = core(id);
  const extras = all.map((r) => ({ r, plans: r.plans.filter((p) => isExtraPlan(id, p)) })).filter((x) => x.plans.length);
  const latest = rows.map((r) => r.checked).sort().pop()!;
  const guide = guideById(s.id);
  // Research notes stay in the data. The page says only what a reader needs.
  const appRows = rows.filter(isAppStorePrice);
  const appShare = appRows.length / rows.length;
  const notes: { c: string; n: string }[] = [];
  if (appRows.length) notes.push({ c: 'iPhone app prices', n: appShare > 0.5 ? `Most prices here are what ${s.name} charges when you subscribe in its iPhone app, from Apple’s in-app price list. Prices on ${s.name}’s website can be different.` : `Rows marked “iPhone app price” are what you pay when you subscribe in the iPhone app. Prices on the website can be different.` });
  if (s.id === 'grok') notes.push({ c: 'Two plan lists', n: 'US prices are xAI’s website plans: Plus, Premium, Super and Ultra. The iPhone app still sells SuperGrok plans, so the other countries show those.' });
  if (rows.some((r) => ['AE', 'SA', 'EG'].includes(r.country))) notes.push({ c: 'Middle East', n: 'Some services don’t say whether VAT is included. Where Apple bills you, its prices include VAT.' });
  const taxNote = rows.some((r) => ['US', 'CA'].includes(r.country)) ? ` ${rows.some((r) => r.country === 'CA') ? 'US and Canada prices are' : 'US prices are'} before sales tax.` : '';
  // Say exactly which of the prices in the first sentence are App Store prices (Nov 15: US Claude is now from the website).
  const lead = ['US', 'GB'].map((c) => rows.find((r) => r.country === c)).filter((r): r is PriceRow => Boolean(r));
  const leadApp = lead.filter(isAppStorePrice);
  const appLine = !lead.length ? (appShare > 0.5 ? ' These are iPhone app prices.' : '') : leadApp.length === lead.length ? ' These are iPhone app prices.' : leadApp.length ? ` ${leadApp.map((r) => (r.country === 'GB' ? 'UK' : r.country)).join(' and ')} prices are from the iPhone app.` : '';
  const ans = `${summary(PRICE_SEARCH[s.id]?.who ?? s.name, rows)}${appLine}${taxNote} Checked ${dateRange(rows.map((r) => r.checked))}.`;
  const others = neighbours(priceHubServices().filter((x) => x.category === s.category), s.id, 5);

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${s.name} prices ${inWhere(rows)}`,
      description: ans,
      ...pubDates(latest),
      author: { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Ditch', legalName: COMPANY, url: SITE },
      publisher: { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Ditch', url: SITE },
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
  const grid = buildGrid(s.name, rows);

  const history = priceChanges().filter((c) => c.serviceId === s.id);
  const text = priceText(s.name, rows, history.map((c) => ({ plan: planLabel(c.name, c.plan), country: c.country, oldPrice: c.oldPrice, newPrice: c.newPrice, currency: c.currency, when: c.when })));
  return (
    <div className="wrap guide gv3 v4 guide4 g5 pricepage">
      <JsonLd data={ld} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/prices">Prices</Link>
        <span aria-hidden>›</span>
        <span aria-current="page">{s.name}</span>
      </nav>
      <header className="g5-hero p5-hero">
        <div className="g5-hero-tx">
          <div className="kick">
            <Logo id={s.id} size={40} />
            {appShare > 0.5 && leadApp.length === lead.length ? <span>App Store prices</span> : null}
          </div>
          <h1>
            {PRICE_SEARCH[s.id]?.h1 ?? `${s.name} price`} {latest.slice(0, 4)}
          </h1>
          <p className="lead">{ans.replace(/ Checked [^.]*\.$/, '')}</p>
          <div className="g5-cta-row">
            {many ? (
              <a className="btn" href="#all">
                Every country ↓
              </a>
            ) : null}
            <a className={many ? 'btn ghost' : 'btn'} href="#remind">
              Get a reminder before it renews
            </a>
          </div>
        </div>
        <div className="p5-your">
          <YourCountryPrices service={s.name} rows={cards} />
        </div>
      </header>

      {many ? (
        <section className="v4-sec" aria-labelledby="all">
          <h2 id="all">{s.name} price by country</h2>
          <p className="g5-sub">Each country in its own money, before or including tax as marked. Prices never get converted.</p>
          <PriceGrid service={s.name} cols={grid.cols} rows={grid.rows} />
          <p className="g-src">
            We never add different currencies together. <Link href="/how-we-check">How we check prices</Link>.
          </p>
        </section>
      ) : null}

      {extras.length ? (
        <section className="v4-sec" aria-labelledby="extras">
          <h2 id="extras">{s.name} bundles{extras.some((x) => x.plans.some((p) => /live/i.test(p.id))) ? ' and live TV' : ''}</h2>
          <p className="g5-sub">Plans that come with other services or live channels, from {s.name}’s own page.</p>
          {extras.map(({ r, plans }) => (
            <div key={r.country} className="tbl-scroll" role="region" aria-label={`${s.name} bundles in ${COUNTRY[r.country].name}`} tabIndex={0}>
              <table className="ttable wide-t">
                <caption className="sr">{s.name} bundles in {COUNTRY[r.country].name}</caption>
                <thead>
                  <tr>
                    <th scope="col">{extras.length > 1 ? COUNTRY[r.country].name : 'Plan'}</th>
                    <th scope="col" className="r">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[...plans].sort((a, b) => monthlyMinor(a.amountMinor, a.cycle) - monthlyMinor(b.amountMinor, b.cycle)).map((p) => (
                    <tr key={p.id}>
                      <th scope="row">{p.name}</th>
                      <td className="r num">
                        {formatMoney(p.amountMinor, r.currency, { country: r.country })} {CYCLE_WORD[p.cycle]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      ) : null}

      {text.faq.length ? (
        <section className="v4-sec p5-text" aria-labelledby="faq">
          <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: text.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
          <h2 id="faq">{s.name} prices: questions</h2>
          <div className="faq2">
            {text.faq.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {history.length || notes.length ? (
        <section className="v4-sec g5-two" aria-label={`${s.name} price history and notes`}>
          {history.length ? (
            <div id="history">
              <h2>{s.name} price history</h2>
              <ul className="good">
                {history.map((c) => (
                  <li key={`${c.country}-${c.plan}-${c.when}`}>
                    <b>{formatDate(c.when)}</b>, {c.plan} in {inCountry(c.country)}: {formatMoney(c.oldPrice, c.currency, { country: c.country })} → {formatMoney(c.newPrice, c.currency, { country: c.country })} ({c.pct < 0 ? '−' : '+'}
                    {Math.round(Math.abs(c.pct))}%).{' '}
                    <a href={c.source} rel="noopener" className="src-a">
                      Source
                    </a>
                  </li>
                ))}
              </ul>
              <p className="g-src">
                <Link href="/price-changes">Every subscription price increase →</Link>
              </p>
            </div>
          ) : null}
          {notes.length ? (
            <div id="notes" className="g5-pause">
              <h2>Good to know</h2>
              <ul className="good">
                {notes.map((x) => (
                  <li key={x.c + x.n}>
                    <b>{x.c}:</b> {x.n}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {comparesFor(s.id).length ? (
        <section className="v4-sec cmp-links" aria-labelledby="cmp-h">
          <h2 id="cmp-h">Compare {s.name}</h2>
          <nav className="chips-row" aria-label={`Compare ${s.name}`}>
            {comparesFor(s.id).map((c) => (
              <Link key={c.href} href={c.href}>
                {c.name}
              </Link>
            ))}
          </nav>
        </section>
      ) : null}

      <p className="g-feedback">
        <b>Spotted a different price?</b> <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${s.name} price changed`)}&body=${encodeURIComponent('Country:\nPlan:\nPrice you saw:\nWhere:\n')}`}>Tell us</a>
      </p>

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
            {toolsFor(s.id, false).slice(0, 2).map((t) => (
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
            {others.slice(0, Math.max(2, 5 - toolsFor(s.id, false).slice(0, 2).length)).map((o) => (
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
          Prices checked <time dateTime={latest}>{dateRange(rows.map((r) => r.checked))}</time> from official pages. {s.name} is a trademark of its owner. Ditch isn’t affiliated with or endorsed by {s.name}. Prices can change at any time; the service’s own page is always right. © {latest.slice(0, 4)} {COMPANY}.
        </p>
      </section>
    </div>
  );
}
