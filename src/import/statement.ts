// Spots repeating charges in a bank or card statement, on the phone:
// a CSV export (Apple Card, most banks) or the text of a statement PDF.
// How (docs/research/autosync.md B2): tidy each merchant name, group by
// merchant and currency, check the gaps between charges fit one cycle and the
// amounts stay about the same, then suggest it with the evidence.
// Apple's own charges all read "APPLE.COM/BILL": we can't tell which app,
// so they're counted and the user is pointed to the Apple screenshot instead.

import { nextFromLastCharge } from '@/domain/charges';
import { daysBetween, shortDate, type DateOnly } from '@/domain/dates';
import type { Cycle } from '@/domain/money';
import { matchMerchant } from './match';
import { findDate, toMinor, type DateOrder, type Price } from './text';
import type { Found } from './types';

export type Txn = { date: DateOnly; text: string; amountMinor: number; currency: string };

// ---------- Reading ----------

function splitCsvLine(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (c === sep && !q) {
      out.push(cur);
      cur = '';
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/** A CSV export: finds the date, description and amount columns by their headers. */
export function readCsv(csv: string, today: DateOnly, homeCurrency: string, order: DateOrder = 'mdy'): Txn[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const sep = [',', ';', '\t'].sort((a, b) => lines[0].split(b).length - lines[0].split(a).length)[0];
  const head = splitCsvLine(lines[0], sep).map((h) => h.toLowerCase());
  const col = (re: RegExp) => head.findIndex((h) => re.test(h));
  const iDate = col(/transaction date|^date|posted|booking date|^datum/);
  const iDesc = [col(/^merchant/), col(/description|details|payee|narrative|name|memo/)].filter((i) => i >= 0);
  const iAmt = col(/^amount|amount \(|^value/);
  const iDebit = col(/debit|withdrawal|paid out|money out/);
  const iType = col(/^type$|transaction type/);
  const curMatch = head.join(' ').match(/\((usd|gbp|eur|cad|aud|nzd|inr)\)/);
  const currency = curMatch ? curMatch[1].toUpperCase() : homeCurrency;
  if (iDate < 0 || !iDesc.length || (iAmt < 0 && iDebit < 0)) return [];
  const rows = lines.slice(1).map((l) => splitCsvLine(l, sep));
  // Which sign is a charge? Apple Card lists purchases as positive, most banks as negative: the commoner one.
  const signs = rows.map((r) => (iAmt >= 0 ? (r[iAmt] ?? '').trim().startsWith('-') || /^\(.*\)$/.test(r[iAmt] ?? '') : false));
  const negIsCharge = signs.filter(Boolean).length > signs.length / 2;
  const out: Txn[] = [];
  rows.forEach((r, k) => {
    if (iType >= 0 && /payment|credit|refund|transfer|interest/i.test(r[iType] ?? '')) return;
    let raw = iDebit >= 0 && r[iDebit] ? r[iDebit] : iAmt >= 0 ? r[iAmt] : '';
    if (!raw) return;
    if (iDebit < 0 && signs[k] !== negIsCharge) return; // a refund or a deposit
    raw = raw.replace(/[()$£€₹\s]/g, '');
    const amountMinor = toMinor(raw, currency);
    const date = findDate(r[iDate] ?? '', today, { order, past: true });
    const text = iDesc.map((i) => r[i]).find((x) => x && x.length > 1) ?? '';
    if (amountMinor && date && text) out.push({ date, text, amountMinor, currency });
  });
  return out;
}

const LINE_DATE = /^\s*(\d{1,2}[/.-]\d{1,2}(?:[/.-]\d{2,4})?|\d{1,2}\s+[A-Za-z]{3,9}(?:\s+\d{4})?|[A-Za-z]{3,9}\.?\s+\d{1,2}(?:,?\s+\d{4})?)\s+/;
const AMOUNT = /-?\(?[$£€]?\d{1,3}(?:,\d{3})*\.\d{2}\)?|-?\(?[$£€]?\d+\.\d{2}\)?/g;

/** The text of a statement PDF: lines that start with a date and carry an amount. */
export function readStatementText(text: string, today: DateOnly, homeCurrency: string, order: DateOrder = 'mdy'): Txn[] {
  const out: Txn[] = [];
  for (const line of text.split(/\r?\n/)) {
    const d = line.match(LINE_DATE);
    if (!d) continue;
    const rest = line.slice(d[0].length);
    const amounts = rest.match(AMOUNT);
    if (!amounts) continue;
    // The first amount after the description; a running balance may follow it.
    const first = amounts[0];
    if (/^-|^\(/.test(first) && /payment|thank you|credit|refund/i.test(rest)) continue;
    if (/payment|thank you|autopay|transfer|deposit|interest charge/i.test(rest)) continue;
    const desc = rest.slice(0, rest.indexOf(first)).trim();
    const date = findDate(d[1], today, { order, past: true });
    const amountMinor = toMinor(first.replace(/[()$£€-]/g, ''), homeCurrency);
    if (date && amountMinor && desc.length > 1) out.push({ date, text: desc, amountMinor, currency: homeCurrency });
  }
  return out;
}

// ---------- Tidying merchant names ----------

const PROCESSORS = /^(paypal \*|pp\*|sq \*|sq\*|tst\* ?|google \*|goog \*|apl\* ?|amzn mktp \w+ |ddbr \*|uber \*)/i;

/** "POS DEBIT 1103 NETFLIX.COM 866-579-7172 CA CARD 4821" → "NETFLIX.COM". */
export function cleanMerchant(raw: string): string {
  let s = raw.toUpperCase();
  s = s.replace(/\b(POS|DEBIT|CREDIT|PURCHASE|RECURRING|RECURR|CHECKCARD|CHECK CARD|CARD PURCHASE|VISA|MASTERCARD|ACH|ONLINE|WEB|PAYMENT TO|DIRECT DEBIT|DD|SO|BILL PAYMENT)\b/g, ' ');
  s = s.replace(PROCESSORS, '');
  s = s.replace(/\b(CARD|XX+|\*+)\s*\d{2,}\b/g, ' ');
  s = s.replace(/\b\d{1,2}[/.-]\d{1,2}([/.-]\d{2,4})?\b/g, ' ');
  s = s.replace(/\+?\d[\d-]{6,}\d/g, ' '); // phone and reference numbers
  s = s.replace(/#\s?\w+/g, ' ');
  s = s.replace(/(^|\s)\d{2,}(?=\s|$)/g, ' '); // store numbers, date stamps like 1103
  s = s.replace(/\b([A-Z]{2})\s*$/, ' '); // trailing US state
  s = s.replace(/\s{2,}/g, ' ').trim();
  // Keep the first 3 words: city names and order codes come after.
  return s.split(' ').slice(0, 3).join(' ');
}

export const isApple = (clean: string) => /^APPLE\.?COM|^APPLE COM|^ITUNES/.test(clean);

/** One key per merchant, so "NETFLIX.COM" and "NETFLIX.COM LOS GATOS" group together. */
export function groupKey(clean: string): string {
  const svc = matchMerchant(clean);
  if (svc) return `svc:${svc.id}`;
  return clean.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').slice(0, 2).join(' ');
}

// ---------- Spotting repeats ----------

const BANDS: [Cycle, number, number][] = [
  ['weekly', 6, 8],
  ['biweekly', 13, 16],
  ['monthly', 27, 33],
  ['quarterly', 85, 96],
  ['semiannual', 175, 190],
  ['yearly', 355, 376],
];

function cycleOf(gaps: number[]): Cycle | null {
  for (const [cycle, lo, hi] of BANDS) {
    const fit = gaps.filter((g) => g >= lo && g <= hi).length;
    if (fit >= Math.max(1, Math.ceil(gaps.length * 0.7))) return cycle;
  }
  return null;
}

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

export type StatementResult = {
  found: Found[];
  /** Charges to APPLE.COM/BILL: real subscriptions, but the statement can't say which. */
  appleCharges: number;
  /** How many charges we read, to say "Read 84 charges from Sep 1 to Nov 30". */
  read: number;
  from: DateOnly | null;
  to: DateOnly | null;
};

export function findRepeats(txns: Txn[], today: DateOnly): StatementResult {
  const groups = new Map<string, { clean: string; list: Txn[] }>();
  let appleCharges = 0;
  for (const t of txns) {
    const clean = cleanMerchant(t.text);
    if (!clean) continue;
    if (isApple(clean)) {
      appleCharges++;
      continue;
    }
    const key = `${groupKey(clean)}|${t.currency}`;
    const g = groups.get(key) ?? { clean, list: [] };
    g.list.push(t);
    groups.set(key, g);
  }
  const found: Found[] = [];
  for (const [key, { clean, list }] of groups) {
    const svc = matchMerchant(clean);
    const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
    // Two charges the same day (a top-up, a split): count once.
    const charges = sorted.filter((t, i) => i === 0 || t.date !== sorted[i - 1].date);
    const amounts = charges.map((c) => c.amountMinor);
    const last = charges[charges.length - 1];
    const mid = median(amounts);
    const steady = amounts.every((a) => Math.abs(a - mid) <= Math.max(100, mid * 0.1)) || amounts.slice(1).every((a, i) => a >= amounts[i]); // steady, or a price rise that stuck
    let cycle: Cycle | null = null;
    let confidence: Found['confidence'] = 'maybe';
    if (charges.length >= 2) {
      const gaps = charges.slice(1).map((c, i) => daysBetween(charges[i].date, c.date));
      cycle = cycleOf(gaps);
      if (!cycle || !steady) continue;
      confidence = svc ? 'high' : charges.length >= 3 ? 'medium' : 'maybe';
    } else {
      // One charge: only worth a mention if it's a known subscription service.
      if (!svc) continue;
      cycle = svc.cycle;
    }
    const price: Price = { amountMinor: last.amountMinor, currency: last.currency };
    const next = nextFromLastCharge(last.date, cycle, today);
    const rose = charges.length >= 2 && last.amountMinor > charges[charges.length - 2].amountMinor + 50;
    found.push({
      key: `stmt:${key}`,
      name: svc?.name ?? titleCase(clean),
      catalogId: svc?.id ?? null,
      date: next,
      state: 'renews',
      price,
      cycle,
      evidence: `${charges.map((c) => shortDate(c.date)).join(', ')}${rose ? ' · price went up' : ''}`,
      confidence,
      source: 'statement',
    });
  }
  const order = { high: 0, medium: 1, maybe: 2 } as const;
  found.sort((a, b) => order[a.confidence] - order[b.confidence] || (b.price?.amountMinor ?? 0) - (a.price?.amountMinor ?? 0));
  const dates = txns.map((t) => t.date).sort();
  return { found, appleCharges, read: txns.length, from: dates[0] ?? null, to: dates[dates.length - 1] ?? null };
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()).replace(/\.Com\b/, '.com');
}

/** Reads a statement in whatever form it came: CSV if it has a header row with an amount column, else PDF text. */
export function readStatement(content: string, today: DateOnly, homeCurrency: string, order: DateOrder = 'mdy'): StatementResult {
  const firstLine = content.split(/\r?\n/, 1)[0] ?? '';
  const looksCsv = /[,;\t]/.test(firstLine) && /amount|debit|value|betrag/i.test(firstLine);
  const txns = looksCsv ? readCsv(content, today, homeCurrency, order) : readStatementText(content, today, homeCurrency, order);
  return findRepeats(txns, today);
}

