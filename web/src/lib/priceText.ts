import { COUNTRY, formatDate, isAppStorePrice, type PriceRow } from './data';
import { formatMoney, monthlyMinor } from './money';

/**
 * The written part of a price page (owner, Nov 14: "more text so they're SEO friendly, but don't clutter them").
 * Every sentence is worked out from that service's own checked prices, so no two pages read the same and
 * nothing is invented: plan range, monthly vs yearly, the cheapest way in, the student plan, other countries,
 * and the last confirmed price change. Prices are never converted between currencies.
 */
export type Change = { plan: string; country: string; oldPrice: number; newPrice: number; currency: string; when: string };
export type PriceText = { paras: string[]; faq: { q: string; a: string }[] };

const CYCLE = /\s*\((?:billed\s+)?(?:monthly|yearly|annual|1 month|3 months|12 months|quarterly)(?:,\s*([^)]*))?\)/i;
/** "the US", "the UK", "the UAE", otherwise the country's name. */
const inName = (code: string) => (code === 'US' ? 'the US' : code === 'GB' ? 'the UK' : code === 'AE' ? 'the UAE' : COUNTRY[code].name);
const per = (c: string) => (c === 'yearly' ? 'a year' : c === 'quarterly' ? 'every 3 months' : c === 'weekly' ? 'a week' : 'a month');

/** "Premium (12 months)" and "Premium (1 month)" are the same plan family: "Premium". */
export function family(name: string, brand: string) {
  return name
    .replace(CYCLE, (_m, rest?: string) => (rest ? ` (${rest})` : ''))
    .replace(new RegExp(`^${brand.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&')}\\s+`, 'i'), '')
    .trim();
}

export function priceText(name: string, rows: PriceRow[], changes: Change[]): PriceText {
  const brand = name.replace(/\s*\(.*\)/, '');
  const home = rows.find((r) => r.country === 'US') ?? rows.find((r) => r.country === 'GB') ?? rows[0];
  if (!home) return { paras: [], faq: [] };
  const where = inName(home.country);
  const m = (a: number, r = home) => formatMoney(a, r.currency, { country: r.country });
  const plans = home.plans.map((p) => ({ ...p, fam: family(p.name, brand) }));
  const open = plans.filter((p) => !/student/i.test(p.name));
  const monthly = open.filter((p) => p.cycle === 'monthly').sort((a, b) => a.amountMinor - b.amountMinor);
  const paras: string[] = [];
  const faq: { q: string; a: string }[] = [];

  // 1. What it costs at home
  const own = (f: string) => (f && !name.toLowerCase().includes(f.toLowerCase()) && !/^(monthly|yearly)$/i.test(f) ? ` ${f}` : '');
  const cheapest = [...open].sort((a, b) => monthlyMinor(a.amountMinor, a.cycle) - monthlyMinor(b.amountMinor, b.cycle))[0];
  let costs = '';
  if (monthly.length > 1) costs = `In ${where}, ${name} costs ${m(monthly[0].amountMinor)} to ${m(monthly[monthly.length - 1].amountMinor)} a month, across ${monthly.length} monthly plans.`;
  else if (monthly.length === 1) costs = `In ${where}, ${name}${own(monthly[0].fam)} costs ${m(monthly[0].amountMinor)} a month.`;
  else if (cheapest) costs = `In ${where}, ${name}${open.length > 1 ? ' starts at' : ' costs'} ${m(cheapest.amountMinor)} ${per(cheapest.cycle)}${open.length > 1 && cheapest.fam ? ` (${cheapest.fam})` : ''}.`;
  let cheapLine = '';
  if (monthly.length && cheapest && open.length > 1) {
    if (cheapest.cycle === 'monthly') cheapLine = monthly.length > 1 && cheapest.fam ? ` The cheapest is ${cheapest.fam}${/\bads?\b|adverts|commercial/i.test(cheapest.name) && !/\bads?\b|adverts/i.test(cheapest.fam) ? ', which shows ads' : ''}.` : '';
    else if (!open.some((p) => p.fam === cheapest.fam && p.cycle === 'monthly')) cheapLine = ` Paid ${cheapest.cycle === 'yearly' ? 'yearly' : 'every 3 months'}, ${cheapest.fam && !/^(monthly|yearly)$/i.test(cheapest.fam) ? cheapest.fam : 'it'} works out cheapest: ${m(cheapest.amountMinor)} ${per(cheapest.cycle)}, about ${m(Math.round(monthlyMinor(cheapest.amountMinor, cheapest.cycle)))} a month.`;
  }
  if (costs) {
    paras.push(costs + cheapLine);
    const q = monthly.length ? `How much is ${name} a month?` : `How much does ${name} cost?`;
    faq.push({ q, a: costs + cheapLine + ` ${COUNTRY[home.country].tax === 'before sales tax' ? 'Sales tax is added on top.' : 'That includes tax.'}` });
  }

  // 2. Monthly vs yearly, for plan families sold both ways
  const pairs = [...new Set(open.map((p) => p.fam))]
    .map((f) => ({ f, mo: open.find((p) => p.fam === f && p.cycle === 'monthly'), yr: open.find((p) => p.fam === f && p.cycle === 'yearly') }))
    .filter((x) => x.mo && x.yr && x.yr.amountMinor < x.mo.amountMinor * 12);
  if (pairs.length) {
    const best = pairs.map((x) => ({ ...x, diff: x.mo!.amountMinor * 12 - x.yr!.amountMinor })).sort((a, b) => b.diff - a.diff)[0];
    const pct = Math.round((best.diff / (best.mo!.amountMinor * 12)) * 100);
    const label = `${name}${own(best.f)}`;
    const line = `Paying yearly costs less: ${label} is ${m(best.yr!.amountMinor)} a year, against ${m(best.mo!.amountMinor * 12)} for 12 months of monthly. That’s ${m(best.diff)} (${pct}%) less, paid all at once.`;
    paras.push(line);
    faq.push({ q: `Is ${name} cheaper if you pay yearly?`, a: `Yes. ${line.replace('Paying yearly costs less: ', '')}` });
  }

  // 3. Students
  const student = plans.find((p) => /student/i.test(p.name));
  if (student) {
    const line = `Students pay ${m(student.amountMinor)} ${per(student.cycle)} on ${student.fam || 'the student plan'}${cheapest && student.amountMinor < cheapest.amountMinor ? ', less than any other plan' : ''}. ${brand} usually checks that you’re enrolled.`;
    paras.push(line);
    faq.push({ q: `Does ${name} have a student discount?`, a: `Yes, in ${where}. ${line}` });
  }

  // 4. Other countries, each in its own money
  const others = rows.filter((r) => r !== home);
  if (others.length) {
    const lowest = (r: PriceRow) => {
      const o = r.plans.filter((p) => !/student/i.test(p.name));
      const pool = o.length ? o : r.plans;
      const mo = pool.filter((p) => p.cycle === 'monthly').sort((a, b) => a.amountMinor - b.amountMinor);
      return mo[0] ?? [...pool].sort((a, b) => monthlyMinor(a.amountMinor, a.cycle) - monthlyMinor(b.amountMinor, b.cycle))[0];
    };
    const pick = ['GB', 'CA', 'AU', 'DE', 'IN'].map((c) => others.find((r) => r.country === c)).filter((r): r is PriceRow => Boolean(r)).slice(0, 3);
    const bits = pick.map((r) => { const p = lowest(r); return `${m(p.amountMinor, r)} ${per(p.cycle)} in ${inName(r.country)}`; });
    const app = others.some(isAppStorePrice) ? ` ${others.every(isAppStorePrice) ? `Outside ${where}` : 'In some countries'}, these are App Store prices (what you pay in the iPhone app).` : '';
    const line = `We check ${name} in ${rows.length} countries, each in its own currency, and never convert them.${bits.length ? ` Elsewhere it starts at ${bits.join(', ')}.` : ''}${app}`;
    paras.push(line);
    faq.push({ q: `What does ${name} cost in other countries?`, a: line });
    const gb = others.find((r) => r.country === 'GB');
    if (gb) {
      const gbOpen = gb.plans.filter((p) => !/student/i.test(p.name));
      const gbMo = gbOpen.filter((p) => p.cycle === 'monthly');
      const list = (gbMo.length ? gbMo : gbOpen).slice(0, 4).map((p) => `${family(p.name, brand) || p.name} ${m(p.amountMinor, gb)} ${per(p.cycle)}`).join(', ');
      faq.push({ q: `How much is ${name} in the UK?`, a: `${list}. UK prices include VAT.` });
    }
  }

  // 5. The last price change we could confirm
  const last = [...changes].sort((a, b) => b.when.localeCompare(a.when))[0];
  if (last) {
    const c = { country: last.country, currency: last.currency } as PriceRow;
    const plan = last.plan.replace(/\s+(monthly|yearly)$/i, '');
    const line = `The last price change we confirmed: ${plan} in ${inName(last.country)} went from ${m(last.oldPrice, c)} to ${m(last.newPrice, c)}${last.when ? ` on ${formatDate(last.when)}` : ''}.`;
    paras.push(line);
    // Not a question: the page's own price history list already shows every change.
  }
  return { paras, faq };
}
