// Small readers shared by the importers: dates and prices as people (and
// Apple, and banks) write them. Everything runs on the phone; nothing is sent
// anywhere (CLAUDE.md privacy label).

import { addDays, daysInMonth, formatDate, parseDate, type DateOnly } from '@/domain/dates';
import { currencyDigits, type Cycle } from '@/domain/money';

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6,
  jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11,
  dec: 12, december: 12,
};

const MONTH_RE = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\.?';

function valid(y: number, m: number, d: number): DateOnly | null {
  if (m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;
  return formatDate({ y, m, d });
}

/** No year given: the next time that day comes round, from today (today counts). */
function nextOf(m: number, d: number, today: DateOnly, past = false): DateOnly | null {
  const { y } = parseDate(today);
  const here = valid(y, m, Math.min(d, daysInMonth(y, m)));
  if (!here) return null;
  if (past) return here <= today ? here : valid(y - 1, m, Math.min(d, daysInMonth(y - 1, m)));
  return here >= today ? here : valid(y + 1, m, Math.min(d, daysInMonth(y + 1, m)));
}

export type DateOrder = 'mdy' | 'dmy';

/**
 * Finds the first date in a piece of text: "December 12, 2026", "12 December
 * 2026", "Dec 12", "12/12/2026" (order from `order`), "2026-12-12", "today",
 * "tomorrow". Without a year: the next one from today, or with `past` the last one.
 */
export function findDate(text: string, today: DateOnly, opts: { order?: DateOrder; past?: boolean } = {}): DateOnly | null {
  const t = text.toLowerCase();
  if (/\btoday\b/.test(t)) return today;
  if (/\btomorrow\b/.test(t)) return addDays(today, 1);
  let m: RegExpMatchArray | null;
  if ((m = t.match(/\b(\d{4})-(\d{2})-(\d{2})\b/))) return valid(+m[1], +m[2], +m[3]);
  if ((m = t.match(new RegExp(`\\b${MONTH_RE}\\s+(\\d{1,2})(?!\\d)(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?`)))) {
    const mo = MONTHS[m[1].replace('.', '')];
    return m[3] ? valid(+m[3], mo, +m[2]) : nextOf(mo, +m[2], today, opts.past);
  }
  if ((m = t.match(new RegExp(`\\b(\\d{1,2})(?!\\d)(?:st|nd|rd|th)?\\s+(?:of\\s+)?${MONTH_RE}(?:,?\\s+(\\d{4}))?`)))) {
    const mo = MONTHS[m[2].replace('.', '')];
    return m[3] ? valid(+m[3], mo, +m[1]) : nextOf(mo, +m[1], today, opts.past);
  }
  if ((m = t.match(/\b(\d{1,2})[/.](\d{1,2})(?:[/.](\d{2,4}))?\b/))) {
    const [a, b] = [+m[1], +m[2]];
    const order: DateOrder = a > 12 ? 'dmy' : b > 12 ? 'mdy' : (opts.order ?? 'mdy');
    const [mo, d] = order === 'mdy' ? [a, b] : [b, a];
    if (!m[3]) return nextOf(mo, d, today, opts.past);
    const y = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    return valid(y, mo, d);
  }
  return null;
}

const SYMBOLS: [RegExp, string][] = [
  [/US\$|USD/i, 'USD'], [/CA\$|C\$|CAD/i, 'CAD'], [/A\$|AU\$|AUD/i, 'AUD'], [/NZ\$|NZD/i, 'NZD'],
  [/£|GBP/i, 'GBP'], [/€|EUR/i, 'EUR'], [/₹|INR|Rs\.?/i, 'INR'], [/¥|JPY/i, 'JPY'], [/CHF/i, 'CHF'],
];

export type Price = { amountMinor: number; currency: string };

/**
 * The first price in a piece of text: "$9.99", "£4.99", "9,99 €", "USD 12.00",
 * "1,299.00". A bare "$" means `homeCurrency` when that's a dollar currency.
 * Null when there's no amount with a currency sign, unless `bare` allows plain numbers.
 */
export function findPrice(text: string, homeCurrency: string, opts: { bare?: boolean } = {}): Price | null {
  const m = text.match(/(US\$|CA\$|C\$|AU\$|A\$|NZ\$|[$£€₹¥]|USD|GBP|EUR|CAD|AUD|NZD|INR|JPY|CHF|Rs\.?)?\s?(-?\d+(?:[,.]\d{3})*(?:[.,]\d{1,2})?)\s?(€|USD|GBP|EUR|CAD|AUD|NZD|INR|JPY|CHF)?/);
  if (!m) return null;
  const sign = m[1] ?? m[3];
  if (!sign && !opts.bare) return null;
  let currency = homeCurrency;
  if (sign) {
    if (sign === '$') currency = /USD|CAD|AUD|NZD|SGD|HKD|MXN/.test(homeCurrency) ? homeCurrency : 'USD';
    else currency = SYMBOLS.find(([re]) => re.test(sign))?.[1] ?? homeCurrency;
  }
  const minor = toMinor(m[2], currency);
  return minor === null ? null : { amountMinor: minor, currency };
}

/** "1,299.00" / "1.299,00" / "9,99" / "-12.50" → minor units (always positive). */
export function toMinor(raw: string, currency: string): number | null {
  const digits = currencyDigits(currency);
  let s = raw.replace(/\s/g, '').replace(/^-/, '');
  const lastSep = Math.max(s.lastIndexOf('.'), s.lastIndexOf(','));
  let whole = s;
  let frac = '';
  if (lastSep >= 0 && s.length - lastSep - 1 <= 2) {
    whole = s.slice(0, lastSep);
    frac = s.slice(lastSep + 1);
  }
  whole = whole.replace(/[.,]/g, '');
  if (!/^\d+$/.test(whole || '0') || !/^\d*$/.test(frac)) return null;
  s = whole || '0';
  const minor = Number(s) * 10 ** digits + Number((frac + '00').slice(0, digits) || 0);
  return Number.isSafeInteger(minor) ? minor : null;
}

/** "/month", "per year", "monthly", "every 3 months", "annually" → a cycle. */
export function findCycle(text: string): Cycle | null {
  const t = text.toLowerCase();
  if (/\b(week|weekly|wk)\b/.test(t) && !/\b2\s*weeks?\b|biweekly|fortnight/.test(t)) return 'weekly';
  if (/\b2\s*weeks?\b|biweekly|fortnight/.test(t)) return 'biweekly';
  if (/\b(3|three)\s*months?\b|quarter|\bqtr\b/.test(t)) return 'quarterly';
  if (/\b(6|six)\s*months?\b|half[- ]?year|semi-?annual/.test(t)) return 'semiannual';
  if (/\b(year|yearly|annual|annually|yr)\b/.test(t)) return 'yearly';
  if (/\b(month|monthly|mo)\b/.test(t)) return 'monthly';
  return null;
}
