// Lists one share card per page (comparisons, price pages, cancel guides) for scripts/og.mjs to draw.
// Run: npx tsx scripts/og-cards.ts > /tmp/cards.json (reads the same data as the site, so numbers always match).
import { COUNTRIES, priceHubServices, publishedGuides, serviceById, slugOf, verifiedPrices, isExtraPlan, hasLogo } from '../src/lib/data';
import { formatMoney } from '../src/lib/money';
import { SERVICE_TOOLS, planLabel } from '../src/lib/tools';

type Card = { file: string; logos: { id: string; logo: boolean; color: string; mono: string }[]; title: string; sub: string; foot: string };
const lg = (id: string) => { const s = serviceById(id); return { id, logo: hasLogo(id), color: s?.color ?? '#6B6559', mono: s?.mono ?? s?.name.slice(0, 1) ?? '?' }; };
const us = (id: string) => verifiedPrices(id).find((r) => r.country === 'US');
const money = (a: number, cur: string, c: string) => formatMoney(a, cur, { country: c });
const cards: Card[] = [];

for (const t of SERVICE_TOOLS.filter((x) => x.kind === 'vs' || x.kind === 'tiers')) {
  let sub = '';
  if (t.kind === 'tiers' && t.s) {
    const r = us(t.s)!;
        const a = r.plans.find((p) => p.id === t.ap)!, b = r.plans.find((p) => p.id === t.bp)!;
    const short = (n: string) => n.replace(/\s*\((monthly|yearly)\)/i, '');
    sub = `US: ${short(a.name)} ${money(a.amountMinor, r.currency, 'US')} · ${short(b.name)} ${money(b.amountMinor, r.currency, 'US')} a month`;
  } else if (t.a && t.b) {
    const pick = (id: string, plan?: string) => { const r = us(id)!; const p = r.plans.find((x) => x.id === plan) ?? r.plans.find((x) => x.default) ?? r.plans[0]; return `${planLabel(serviceById(id)!.name, p.name)} ${money(p.amountMinor, r.currency, 'US')}`; };
    sub = `US: ${pick(t.a, t.ap)} · ${pick(t.b, t.bp)} a month`;
  }
  cards.push({ file: `c/${t.slug}`, logos: (t.kind === 'tiers' ? [t.s!] : [t.a!, t.b!]).map(lg), title: t.name, sub, foot: 'Price and what you get, from each company’s own page' });
}
for (const s of priceHubServices()) {
  const rows = verifiedPrices(s.id).map((r) => ({ ...r, plans: r.plans.filter((p) => !isExtraPlan(s.id, p)) })).filter((r) => r.plans.length);
  const r = rows.find((x) => x.country === 'US') ?? rows[0];
  const lo = [...r.plans].filter((p) => p.cycle === 'monthly' && !/student/i.test(p.name)).sort((a, b) => a.amountMinor - b.amountMinor)[0] ?? r.plans[0];
  const where = r.country === 'US' ? 'in the US' : `in ${COUNTRIES.find((c) => c.code === r.country)?.name}`;
  cards.push({ file: `p/${slugOf(s.id)}`, logos: [lg(s.id)], title: `${s.name} prices 2026`, sub: `From ${money(lo.amountMinor, r.currency, r.country)} ${lo.cycle === 'yearly' ? 'a year' : 'a month'} ${where}${rows.length > 1 ? ` · ${rows.length} countries` : ''}`, foot: 'Every price dated and sourced' });
}
for (const g of publishedGuides()) {
  cards.push({ file: `g/${slugOf(g.id)}`, logos: [lg(g.id)], title: `How to cancel ${g.name.replace(/\s*\(.*\)$/, '')}`, sub: 'The official steps, checked and dated', foot: 'Every step from the official help page' });
}
cards.push({ file: 'prices', logos: [], title: `Subscription prices in ${COUNTRIES.length} countries`, sub: 'Every price dated and sourced', foot: '' });
cards.push({ file: 'compare', logos: ['chatgpt-plus', 'claude-pro', 'netflix', 'spotify'].map(lg), title: 'Compare subscriptions', sub: 'Price and what you get, side by side', foot: '' });
process.stdout.write(JSON.stringify(cards));
