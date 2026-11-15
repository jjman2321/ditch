import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ToolPage } from '@/components/ToolPage';
import { Compare, DisneyBundle, FamilySplit, MonthlyYearly, TierCompare, type TierRow } from '@/components/tools/PlanTools';
import { WhatYouGet } from '@/components/WhatYouGet';
import { formatMoney } from '@/lib/money';
import { inCountry, serviceById, verifiedPrices } from '@/lib/data';
import { allPoints, countryList, countryName, planLabel, SERVICE_TOOLS, yearlyPlanId, type Pt } from '@/lib/tools';
import { fitDesc, pageTitle, og } from '@/lib/site';
import { COUNTRIES } from '@/lib/data';

export function generateStaticParams() {
  return SERVICE_TOOLS.map((t) => ({ slug: t.slug }));
}

const tool = (slug: string) => SERVICE_TOOLS.find((t) => t.slug === slug);

export async function generateMetadata({ params }: PageProps<'/tools/[slug]'>): Promise<Metadata> {
  const t = tool((await params).slug);
  if (!t) return {};
  const ex = example(t, allPoints());
  return { title: pageTitle(t.meta), description: fitDesc(ex ?? t.desc, t.kind === 'vs' || t.kind === 'tiers' ? (t.facts?.length ? 'What each plan includes, from each company’s own page.' : 'Every plan side by side, for your country.') : `Free, with prices for ${COUNTRIES.length} countries.`, 'Prices come from each service’s own page.', 'Runs in your browser.'), alternates: { canonical: `/tools/${t.slug}` }, openGraph: og(`/tools/${t.slug}`) };
}

const m = (p: Pt, a = p.a) => formatMoney(a, p.cur, { country: p.c });
const label = (p: Pt) => planLabel(p.n, p.p);

/** Plan vs plan, one service: both plans' prices in every country that sells both (server-built, so it's in the HTML). */
function tierRows(t: (typeof SERVICE_TOOLS)[number]): TierRow[] {
  if (t.kind !== 'tiers' || !t.s || !t.ap || !t.bp) return [];
  const svc = serviceById(t.s)?.name ?? t.s;
  return verifiedPrices(t.s).flatMap((r) => {
    const ids = r.plans.map((p) => p.id);
    const side = (id: string) => {
      const p = r.plans.find((x) => x.id === id);
      if (!p || p.cycle !== 'monthly') return null;
      const y = yearlyPlanId(id, ids);
      const yp = y ? r.plans.find((x) => x.id === y && x.cycle === 'yearly') : undefined;
      return { n: planLabel(svc, p.name), m: p.amountMinor, ...(yp ? { y: yp.amountMinor } : {}) };
    };
    const a = side(t.ap!), b = side(t.bp!);
    return a && b ? [{ c: r.country, name: countryName(r.country), cur: r.currency, a, b }] : [];
  }).sort((x, y) => (x.c === 'US' ? -1 : y.c === 'US' ? 1 : x.name.localeCompare(y.name)));
}

/** Column names on "What you get": AI facts are about one plan (ChatGPT Plus, Microsoft 365 Premium), TV and music facts about the whole service. */
function headName(t: (typeof SERVICE_TOOLS)[number], svc: string, plan?: string): string {
  const name = serviceById(svc)?.name ?? svc;
  if (t.group !== 'ai' || !plan) return name;
  const p = verifiedPrices(svc).find((r) => r.country === 'US')?.plans.find((x) => x.id === plan);
  return p ? planLabel(name, p.name) : name;
}

/** "Good to know" on comparison pages, worked out from our checked prices only (never opinions). */
function pairFacts(t: (typeof SERVICE_TOOLS)[number], pts: Pt[]): string[] {
  const out: string[] = [];
  if (t.kind === 'tiers') {
    const tr = tierRows(t);
    if (!tr.length) return out;
    const us = tr.find((r) => r.c === 'US');
    if (us) {
      const f = (a: number) => formatMoney(a, us.cur, { country: 'US' });
      const gap = Math.abs(us.b.m - us.a.m);
      if (gap) out.push(`In the US the gap is ${f(gap)} a month, or ${f(gap * 12)} over a year.`);
      const ys = [us.a, us.b].filter((x) => x.y !== undefined);
      if (ys.length) out.push(`${ys.map((x) => x.n).join(' and ')} ${ys.length > 1 ? 'both have' : 'has'} a yearly plan: ${ys.map((x) => `${f(x.y!)} a year (${f(Math.round(x.y! / 12))} a month)`).join(' and ')}.`);
    }
    if (tr.length > 1) out.push(`We have both prices for ${tr.length} countries, in the table below.`);
    return out;
  }
  if (!t.a || !t.b) return out;
  const A = pts.find((p) => p.s === t.a)?.n ?? t.a, B = pts.find((p) => p.s === t.b)?.n ?? t.b;
  const codes = new Set(pts.filter((p) => p.s === t.a).map((p) => p.c));
  const both = new Set(pts.filter((p) => p.s === t.b && codes.has(p.c)).map((p) => p.c));
  const us = (s: string) => pts.filter((p) => p.s === s && p.c === 'US' && !/student|bundle/i.test(p.p));
  const ua = us(t.a), ub = us(t.b);
  if (ua.length && ub.length) {
    const cheap = (ps: Pt[]) => [...ps].filter((p) => p.cy === 'monthly').sort((x, y) => x.a - y.a)[0];
    const ca = cheap(ua), cb = cheap(ub);
    if (ca && cb) out.push(`Cheapest monthly plan in the US: ${label(ca)} at ${m(ca)}, ${label(cb)} at ${m(cb)}.`);
    const ya = ua.some((p) => p.cy === 'yearly'), yb = ub.some((p) => p.cy === 'yearly');
    out.push(ya && yb ? `Both sell a yearly plan in the US.` : ya ? `${A} sells a yearly plan in the US; ${B} doesn’t.` : yb ? `${B} sells a yearly plan in the US; ${A} doesn’t.` : `Neither sells a yearly plan in the US, so it’s monthly either way.`);
  }
  if (both.size > 1) out.push(`We have prices for both in ${both.size} countries, in the table below.`);
  return out;
}

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
  if (t.kind === 'tiers') {
    const r = tierRows(t)[0];
    if (!r) return null;
    const f = (a: number) => formatMoney(a, r.cur, { country: r.c });
    return `${r.c === 'US' ? 'In the US' : `In ${inCountry(r.c)}`}, ${r.a.n} is ${f(r.a.m)} a month and ${r.b.n} is ${f(r.b.m)}.`;
  }
  if (t.kind === 'myr' && t.s) {
    const ps = pts.filter((p) => p.s === t.s && p.c === 'US');
    const mo = ps.find((p) => p.cy === 'monthly'), yr = ps.find((p) => p.cy === 'yearly');
    if (!mo || !yr) return null;
    return `In the US, 12 months of monthly ${mo.n} is ${m(mo, mo.a * 12)}; yearly is ${m(yr)}, so ${m(yr, mo.a * 12 - yr.a)} less.`;
  }
  if (t.kind === 'bundle') {
    const us = (sv: string, re: RegExp) => pts.find((p) => p.c === 'US' && p.s === sv && p.cy === 'monthly' && re.test(p.p));
    const d = us('disney-plus', /with ads/i), h = us('hulu', /^hulu \(with ads\)$/i), b = us('disney-plus', /^disney\+, hulu bundle( \(with ads\))?$/i);
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
    const cheap = (s: string, c: string) => pts.filter((p) => p.s === s && p.c === c && p.cy === 'monthly' && !/student|bundle|live tv|tnt sports/i.test(p.p)).sort((x, y) => x.a - y.a)[0];
    const A = pts.find((p) => p.s === t.a)?.n ?? t.a, B = pts.find((p) => p.s === t.b)?.n ?? t.b;
    const rows = codes.flatMap((c) => { const a = cheap(t.a!, c), b = cheap(t.b!, c); return a && b ? [[where(c), `${m(a)} (${a.p})`, `${m(b)} (${b.p})`]] : []; });
    return rows.length ? { title: `Cheapest monthly plan by country: ${A} vs ${B}`, head: ['Country', A, B], rows } : null;
  }
  if (t.kind === 'tiers') {
    const tr = tierRows(t);
    if (tr.length < 2) return null;
    const f = (r: TierRow, a: number) => formatMoney(a, r.cur, { country: r.c });
    const svc = serviceById(t.s!)?.name ?? '';
    const short = (n: string) => n.replace(new RegExp(`^${svc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i'), '') || n;
    return { title: `${tr[0].a.n} vs ${tr[0].b.n} by country`, head: ['Country', short(tr[0].a.n), short(tr[0].b.n), 'Gap'], rows: tr.map((r) => [r.name, f(r, r.a.m), f(r, r.b.m), f(r, Math.abs(r.b.m - r.a.m))]) };
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
    t.kind === 'tiers' ? ['Pick your country.', 'See both plans, monthly and yearly.', 'Read what the bigger plan adds, from the company’s own page.'] :
    ['Pick with ads or without.', 'See both services next to the bundle.'];
  const ids = [t.s, t.a, t.b, ...(t.kind === 'bundle' ? ['disney-plus', 'hulu'] : [])].filter((x): x is string => Boolean(x));
  const rows = ids.flatMap((id) => verifiedPrices(id));
  const us = ids.map((id) => verifiedPrices(id).find((r) => r.country === 'US')?.source).filter((x): x is string => Boolean(x));
  // One link per page: the same URL with or without a trailing slash, a #fragment or spaces counts once.
  const norm = (u: string) => u.trim().replace(/#.*$/, '').replace(/\/$/, '').replace(/^http:/, 'https:');
  const sources = [...new Map([...(t.sources ?? []), ...us].map((u) => [norm(u).replace(/^https:\/\/www\./, 'https://'), norm(u)])).values()];
  const lead = (t.kind === 'vs' || t.kind === 'tiers') && ex ? ex : t.desc;
  const good = ex && lead !== ex ? [ex] : t.kind === 'vs' || t.kind === 'tiers' ? pairFacts(t, pts) : [];
  const countries = countryList();
  const tbl = byCountry(t, pts);
  // A third, always-true question per kind, so each page answers what people ask next.
  const moreFaq =
    t.kind === 'split'
      ? [{ q: 'How is the split worked out?', a: 'The plan price divided by the number of people sharing it, using the price for your country. The share is rounded once, at the end.' }]
      : t.kind === 'vs' || t.kind === 'tiers'
        ? [{ q: 'Is the price different in the iPhone app?', a: 'It can be. A plan you buy inside a service’s iPhone app is billed by Apple at Apple’s price, which isn’t always the website price. Check the price on the App Store before you subscribe.' }]
        : [];
  const extra = tbl ? (
    <section className="v4-sec" aria-labelledby="by-country">
      <h2 id="by-country">{tbl.title}</h2>
      <div className="tbl-scroll" role="region" aria-label={tbl.title} tabIndex={0}>
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
      <p className="g-src">Each country’s own money, monthly plans. Prices from each service’s own page{t.kind === 'split' ? '; shares are rounded once, at the end' : ''}.</p>
    </section>
  ) : null;
  const tr = t.kind === 'tiers' ? tierRows(t)[0] : undefined;
  const heads: [{ name: string; logo?: string }, { name: string; logo?: string }] | null =
    t.kind === 'tiers' && tr ? [{ name: tr.a.n }, { name: tr.b.n }] : t.a && t.b ? [{ name: headName(t, t.a, t.ap), logo: t.a }, { name: headName(t, t.b, t.bp), logo: t.b }] : null;
  const facts = t.facts?.length && heads ? (
    <WhatYouGet
      title={t.kind === 'tiers' ? `What ${tr!.b.n} adds` : 'What you get'}
      heads={heads}
      rows={t.facts}
      note={`From ${t.kind === 'tiers' ? 'the company’s' : 'each company’s'} own plan and help pages. “Not stated” means the page doesn’t say.`}
    />
  ) : null;
  const checked = [...rows.map((r) => r.checked), ...(t.factsChecked ? [t.factsChecked] : [])];
  return (
    <ToolPage slug={`tools/${t.slug}`} title={t.name} lead={lead} how={how} good={good} faq={[...t.faq, ...moreFaq]} sources={sources} wide={t.kind === 'vs' || t.kind === 'tiers'} checked={checked} facts={facts} extra={extra} cta={t.kind === 'split' ? 'Know before the family plan renews' : undefined}>
      {t.kind === 'split' ? <FamilySplit countries={countries} only={t.s} all={t.s === 'netflix'} /> : t.kind === 'vs' ? <Compare countries={countries} first={t.a} second={t.b} fixed /> : t.kind === 'myr' ? <MonthlyYearly countries={countries} only={t.s} /> : t.kind === 'tiers' ? <TierCompare rows={tierRows(t)} service={serviceById(t.s!)?.name ?? ''} /> : <DisneyBundle />}
    </ToolPage>
  );
}
