// Reads the text of a screenshot of iPhone Settings → your name → Subscriptions
// (Apple's own text reader does the reading, on the phone). Apple shows each
// subscription as its name, then a line like "Renews December 12, 2026" or
// "Expires …"/"Expired …"; some rows also show a price and plan. There's an
// Active list and an Inactive (expired) list.
//
// Input: the recognised lines, top to bottom. Output: suggestions only.

import type { DateOnly } from '@/domain/dates';
import { matchName } from './match';
import { findCycle, findDate, findPrice, type DateOrder } from './text';
import type { Found } from './types';

const STATUS = /^(renews|renewal|expires|expiring|expired|ends|ended|trial ends|free trial ends|your free trial ends|free trial until|until)\b/i;
/** Lines that are screen furniture, never a subscription name. */
const NOISE = /^(subscriptions?|active|inactive|expired|settings|edit|done|back|cancel( subscription)?|see all|manage|apple (id|account)|<|›|\d{1,2}:\d{2}(\s?[ap]m)?|\d{1,3}%|lte|5g|4g|wi-?fi|search|options|renewal options|share with family|verify|purchase history|subscribe|resubscribe)$/i;

function cleanName(line: string): string {
  return line.replace(/[›>]+\s*$/, '').replace(/\s{2,}/g, ' ').trim();
}

export function readAppleSubscriptions(lines: string[], today: DateOnly, homeCurrency: string, order: DateOrder = 'mdy'): Found[] {
  const rows = lines.map((l) => l.trim()).filter(Boolean);
  const out: Found[] = [];
  let inactive = false;
  for (let i = 0; i < rows.length; i++) {
    const line = rows[i];
    if (/^inactive$|^expired$/i.test(line)) inactive = true;
    if (/^active$/i.test(line)) inactive = false;
    const status = line.match(STATUS);
    if (!status) continue;
    // The name: the nearest line above that isn't furniture, a price or another status line.
    let name = '';
    let priceLine = '';
    for (let j = i - 1; j >= 0 && j >= i - 3; j--) {
      const above = rows[j];
      if (STATUS.test(above) || NOISE.test(above)) break;
      if (findPrice(above, homeCurrency) && !/[a-z]{3,}.*[a-z]{3,}/i.test(above.replace(/per|month|year|week|monthly|yearly|annual/gi, ''))) {
        priceLine = priceLine || above;
        continue;
      }
      name = cleanName(above);
      break;
    }
    if (!name) continue;
    // A price or plan may also sit just below ("$9.99/month", "Premium Individual · $11.99").
    const below = rows[i + 1] && !STATUS.test(rows[i + 1]) && findPrice(rows[i + 1], homeCurrency) ? rows[i + 1] : '';
    const word = status[1].toLowerCase();
    const past = /expired|ended/.test(word);
    const date = findDate(line, today, { order, past });
    const trial = /trial/.test(word) || /free trial/i.test(priceLine + ' ' + below);
    const state: Found['state'] = inactive || past || (date !== null && date < today) ? 'expired' : trial ? 'trial' : /expir|ends|until/.test(word) ? 'ends' : 'renews';
    const priceText = [line, priceLine, below].find((t) => findPrice(t, homeCurrency)) ?? '';
    const svc = matchName(name);
    out.push({
      key: `apple:${svc?.id ?? name.toLowerCase()}:${date ?? i}`,
      name: svc?.name ?? name,
      catalogId: svc?.id ?? null,
      date,
      state,
      price: priceText ? findPrice(priceText, homeCurrency) : null,
      cycle: priceText ? findCycle(priceText) : null,
      evidence: line,
      // Apple's own list: it is a subscription. Unsure only if we couldn't read a date.
      confidence: date ? 'high' : 'medium',
      source: 'apple',
    });
  }
  // The same subscription twice (two screenshots overlapping): keep one.
  const seen = new Set<string>();
  return out.filter((f) => (seen.has(f.key) ? false : (seen.add(f.key), true)));
}
