import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ToolPage } from '@/components/ToolPage';
import { Compare, DisneyBundle, FamilySplit, MonthlyYearly } from '@/components/tools/PlanTools';
import { formatMoney } from '@/lib/money';
import { inCountry, verifiedPrices } from '@/lib/data';
import { allPoints, countryList, countryName, planLabel, SERVICE_TOOLS, type Pt } from '@/lib/tools';

export function generateStaticParams() {
  return SERVICE_TOOLS.map((t) => ({ slug: t.slug }));
}

const tool = (slug: string) => SERVICE_TOOLS.find((t) => t.slug === slug);

export async function generateMetadata({ params }: PageProps<'/tools/[slug]'>): Promise<Metadata> {
  const t = tool((await params).slug);
  if (!t) return {};
  const ex = example(t, allPoints());
  return { title: t.meta, description: ex ? `${ex} ${t.kind === 'vs' ? 'Every plan side by side, for your country.' : 'Free, for your country.'}` : `${t.desc} Free, with prices from each service’s own page.`, alternates: { canonical: `/tools/${t.slug}` } };
}

const m = (p: Pt, a = p.a) => formatMoney(a, p.cur, { country: p.c });
const label = (p: Pt) => planLabel(p.n, p.p);

/** One sentence from real prices, so the page answers the search even before anyone taps. */
function example(t: (typeof SERVICE_TOOLS)[number], pts: Pt[]): string | null {
  const home = (s: string) => pts.filter((p) => p.s === s && p.c === 'US').length ? 'US' : pts.find((p) => p.s === s)?.c;
  if (t.kind === 'split' && t.s) {
    const c = home(t.s);
    const fam = pts.filter((p) => p.s === t.s && p.c === c && p.cy === 'monthly' && (t.s === 'netflix' ? /premium/i.test(p.p) : /family/i.test(p.p)))[0];
    if (!fam) return null;
    const n = t.s === 'netflix' ? 4 : 6;
    return `${label(fam)} is ${m(fam)} a month in ${inCountry(c!)}: ${m(fam, Math.round(fam.a / n))} each for ${n} people.`;
  }
  if (t.kind === 'vs' && t.a && t.b) {
    const c = home(t.a);
    // The plan people compare: the named one (e.g. ChatGPT Plus), else the usual plan. Never Student or ad-free extras.
    const pick = (s: string, want?: string) => { const ps = pts.filter((p) => p.s === s && p.c === c && p.cy === 'monthly' && !/student/i.test(p.p)); return (want && ps.find((p) => p.p.toLowerCase().startsWith(want))) || ps.find((p) => p.d) || ps[0]; };
    const A = pick(t.a, t.ap), B = pick(t.b, t.bp);
    if (!A || !B) return null;
    return `In the US, ${label(A)} is ${m(A)} a month and ${label(B)} is ${m(B)}.`;
  }
  if (t.kind === 'myr' && t.s) {
    const ps = pts.filter((p) => p.s === t.s && p.c === 'US');
    const mo = ps.find((p) => p.cy === 'monthly'), yr = ps.find((p) => p.cy === 'yearly');
    if (!mo || !yr) return null;
    return `In the US, 12 months of monthly ${mo.n} is ${m(mo, mo.a * 12)}; yearly is ${m(yr)}, so ${m(yr, mo.a * 12 - yr.a)} less.`;
  }
  if (t.kind === 'bundle') {
    const us = (sv: string, re: RegExp) => pts.find((p) => p.c === 'US' && p.s === sv && p.cy === 'monthly' && re.test(p.p));
    const d = us('disney-plus', /with ads/i), h = us('hulu', /^hulu \(with ads\)$/i), b = us('disney-plus', /bundle \(with ads\)/i);
    if (!d || !h || !b) return null;
    return `With ads in the US: Disney+ ${m(d)} + Hulu ${m(h)} = ${m(d, d.a + h.a)} a month. The bundle is ${m(b)}.`;
  }
  return null;
}


/** A real table in the HTML for every country we have, so readers and crawlers get numbers without JavaScript. */
function byCountry(t: (typeof SERVICE_TOOLS)[number], pts: Pt[]): { title: string; head: string[]; rows: string[][] } | null {
  const codes = [...new Set(pts.map((p) => p.c))];
  const where = (c: string) => countryName(c);
  if (t.kind === 'split' && t.s) {
    const n = t.s === 'netflix' ? 4 : 6;
    const rows = codes.flatMap((c) => {
      const fam = pts.filter((p) => p.s === t.s && p.c === c && p.cy === 'monthly' && (t.s === 'netflix' ? /premium/i.test(p.p) : /family/i.test(p.p)))[0];
      return fam ? [[where(c), m(fam), m(fam, Math.round(fam.a / n))]] : [];
    });
    return rows.length > 1 ? { title: `${t.name.replace(/ (split|cost per person) calculator$/i, '')} price by country`, head: ['Country', 'A month', `Each, for ${n}`], rows } : null;
  }
  if (t.kind === 'vs' && t.a && t.b) {
    const cheap = (s: string, c: string) => pts.filter((p) => p.s === s && p.c === c && p.cy === 'monthly' && !/student|bundle/i.test(p.p)).sort((x, y) => x.a - y.a)[0];
    const A = pts.find((p) => p.s === t.a)?.n ?? t.a, B = pts.find((p) => p.s === t.b)?.n ?? t.b;
    const rows = codes.flatMap((c) => { const a = cheap(t.a!, c), b = cheap(t.b!, c); return a && b ? [[where(c), `${m(a)} (${a.p})`, `${m(b)} (${b.p})`]] : []; });
    return rows.length ? { title: `Cheapest monthly plan by country: ${A} vs ${B}`, head: ['Country', A, B], rows } : null;
  }
  if (t.kind === 'myr' && t.s) {
    const rows = codes.flatMap((c) => {
      const ps = pts.filter((p) => p.s === t.s && p.c === c);
      const mo = ps.find((p) => p.cy === 'monthly'), yr = ps.find((p) => p.cy === 'yearly');
      return mo && yr ? [[where(c), m(mo, mo.a * 12), m(yr), m(yr, mo.a * 12 - yr.a)]] : [];
    });
    return rows.length > 1 ? { title: `${pts.find((p) => p.s === t.s)?.n ?? ''} monthly vs yearly, by country`, head: ['Country', '12 × monthly', 'Yearly', 'Yearly is less by'], rows } : null;
  }
  return null;
}

export default async function Page({ params }: PageProps<'/tools/[slug]'>) {
  const t = tool((await params).slug);
  if (!t) notFound();
  const pts = allPoints();
  const ex = example(t, pts);
  const how =
    t.kind === 'split' ? ['Pick your country and the plan.', 'Pick how many people share it.', 'See what each person pays.'] :
    t.kind === 'vs' ? ['Pick your country.', 'See the cheapest and the usual plan of each, side by side.', 'Switch to “A year” to see the yearly cost.'] :
    t.kind === 'myr' ? ['Pick your country.', 'See 12 months of monthly next to yearly.'] :
    ['Pick with ads or without.', 'See both services next to the bundle.'];
  const ids = [t.s, t.a, t.b, ...(t.kind === 'bundle' ? ['disney-plus', 'hulu'] : [])].filter((x): x is string => Boolean(x));
  const rows = ids.flatMap((id) => verifiedPrices(id));
  const us = ids.map((id) => verifiedPrices(id).find((r) => r.country === 'US')?.source).filter((x): x is string => Boolean(x));
  const sources = [...new Set([...(t.sources ?? []), ...us])];
  const lead = t.kind === 'vs' && ex ? ex : t.desc;
  const good = ex && lead !== ex ? [ex] : [];
  const countries = countryList();
  const tbl = byCountry(t, pts);
  // A third, always-true question per kind, so each page answers what people ask next.
  const moreFaq =
    t.kind === 'split'
      ? [{ q: 'How is the split worked out?', a: 'The plan price divided by the number of people sharing it, using the price for your country. The share is rounded once, at the end.' }]
      : t.kind === 'vs'
        ? [{ q: 'Is the price different in the iPhone app?', a: 'It can be. A plan you buy inside a service’s iPhone app is billed by Apple at Apple’s price, which isn’t always the website price. Check the price on the App Store before you subscribe.' }]
        : [];
  const extra = tbl ? (
    <section className="v4-sec" aria-labelledby="by-country">
      <h2 id="by-country">{tbl.title}</h2>
      <div className="tbl-scroll">
        <table className="ttable wide-t">
          <thead>
            <tr>
              {tbl.head.map((h, i) => (
                <th key={h} scope="col" className={i ? 'r' : undefined}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tbl.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((v, i) => (i ? <td key={i} className="r num">{v}</td> : <th key={i} scope="row">{v}</th>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="g-src">Each country’s own money. Prices from each service’s own page{t.kind === 'split' ? '; shares are rounded once, at the end' : ''}.</p>
    </section>
  ) : null;
  return (
    <ToolPage slug={`tools/${t.slug}`} title={t.name} lead={lead} how={how} good={good} faq={[...t.faq, ...moreFaq]} sources={sources} wide={t.kind === 'vs'} checked={rows.map((r) => r.checked)} extra={extra} cta={t.kind === 'split' ? 'Know before the family plan renews' : undefined}>
      {t.kind === 'split' ? <FamilySplit countries={countries} only={t.s} all={t.s === 'netflix'} /> : t.kind === 'vs' ? <Compare countries={countries} first={t.a} second={t.b} fixed /> : t.kind === 'myr' ? <MonthlyYearly countries={countries} only={t.s} /> : <DisneyBundle />}
    </ToolPage>
  );
}
