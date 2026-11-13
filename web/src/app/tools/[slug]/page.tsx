import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ToolPage } from '@/components/ToolPage';
import { Compare, DisneyBundle, FamilySplit, MonthlyYearly } from '@/components/tools/PlanTools';
import { formatMoney } from '@/lib/money';
import { allPoints, countryList, countryName, SERVICE_TOOLS, type Pt } from '@/lib/tools';

export function generateStaticParams() {
  return SERVICE_TOOLS.map((t) => ({ slug: t.slug }));
}

const tool = (slug: string) => SERVICE_TOOLS.find((t) => t.slug === slug);

export async function generateMetadata({ params }: PageProps<'/tools/[slug]'>): Promise<Metadata> {
  const t = tool((await params).slug);
  if (!t) return {};
  return { title: t.meta, description: `${t.desc} Free, with prices checked by hand for your country.`, alternates: { canonical: `/tools/${t.slug}` } };
}

const m = (p: Pt, a = p.a) => formatMoney(a, p.cur, { country: p.c });
/** "Claude Pro" + "Pro (monthly)" → "Claude Pro"; "Disney+" + "Disney+ (With Ads)" → "Disney+ (With Ads)". */
const label = (p: Pt) => {
  const plan = p.p.replace(/\s*\(monthly\)/i, '').trim();
  if (plan.toLowerCase().startsWith(p.n.toLowerCase())) return plan;
  if (p.n.toLowerCase().endsWith(plan.toLowerCase())) return p.n;
  return `${p.n} ${plan}`;
};

/** One sentence from real prices, so the page answers the search even before anyone taps. */
function example(t: (typeof SERVICE_TOOLS)[number], pts: Pt[]): string | null {
  const home = (s: string) => pts.filter((p) => p.s === s && p.c === 'US').length ? 'US' : pts.find((p) => p.s === s)?.c;
  if (t.kind === 'split' && t.s) {
    const c = home(t.s);
    const fam = pts.filter((p) => p.s === t.s && p.c === c && p.cy === 'monthly' && (t.s === 'netflix' ? /premium/i.test(p.p) : /family/i.test(p.p)))[0];
    if (!fam) return null;
    const n = t.s === 'netflix' ? 4 : 6;
    return `${label(fam)} is ${m(fam)} a month in ${c === 'US' ? 'the US' : countryName(c!)}: ${m(fam, Math.round(fam.a / n))} each for ${n} people.`;
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

export default async function Page({ params }: PageProps<'/tools/[slug]'>) {
  const t = tool((await params).slug);
  if (!t) notFound();
  const pts = allPoints();
  const ex = example(t, pts);
  const how =
    t.kind === 'split' ? ['Pick your country and the plan.', 'Pick how many people share it.', 'See what each person pays.'] :
    t.kind === 'vs' ? ['Pick your country.', 'See every plan side by side.', 'Swap either service if you like.'] :
    t.kind === 'myr' ? ['Pick your country.', 'See 12 months of monthly next to yearly.'] :
    ['Pick with ads or without.', 'See both services next to the bundle.'];
  const good = ex ? [ex] : [];
  const countries = countryList();
  return (
    <ToolPage slug={`tools/${t.slug}`} title={t.name} lead={t.desc} how={how} good={good} faq={t.faq} sources={t.sources}>
      {t.kind === 'split' ? <FamilySplit countries={countries} only={t.s} all={t.s === 'netflix'} /> : t.kind === 'vs' ? <Compare countries={countries} first={t.a} second={t.b} /> : t.kind === 'myr' ? <MonthlyYearly countries={countries} only={t.s} /> : <DisneyBundle />}
    </ToolPage>
  );
}
