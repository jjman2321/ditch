import { SERVICE_BY_ID } from '@/catalog/services';
import { readAppleSubscriptions } from '../appleScreenshot';
import { matchMerchant, matchName } from '../match';
import { MERCHANT_ALIASES } from '../merchants';
import { cleanMerchant, findRepeats, readCsv, readStatement, readStatementText } from '../statement';
import { findCycle, findDate, findPrice, toMinor } from '../text';
import { preTicked } from '../types';

const TODAY = '2026-11-16';

describe('reading dates and prices', () => {
  it('reads the ways Apple and banks write dates', () => {
    expect(findDate('Renews December 12, 2026', TODAY)).toBe('2026-12-12');
    expect(findDate('Renews 12 December 2026', TODAY)).toBe('2026-12-12');
    expect(findDate('Renews Dec 3', TODAY)).toBe('2026-12-03');
    expect(findDate('Renews Nov 2', TODAY)).toBe('2027-11-02'); // already passed this year → next year
    expect(findDate('Expired Nov 2', TODAY, { past: true })).toBe('2026-11-02');
    expect(findDate('11/03/2026', TODAY)).toBe('2026-11-03');
    expect(findDate('03/11/2026', TODAY, { order: 'dmy' })).toBe('2026-11-03');
    expect(findDate('25/10/2026', TODAY)).toBe('2026-10-25'); // 25 can't be a month
    expect(findDate('2026-02-30', TODAY)).toBeNull();
    expect(findDate('Trial ends tomorrow', TODAY)).toBe('2026-11-17');
  });
  it('reads prices in minor units, never floats', () => {
    expect(findPrice('$9.99/month', 'USD')).toEqual({ amountMinor: 999, currency: 'USD' });
    expect(findPrice('£4.99 per month', 'USD')).toEqual({ amountMinor: 499, currency: 'GBP' });
    expect(findPrice('9,99 €', 'EUR')).toEqual({ amountMinor: 999, currency: 'EUR' });
    expect(findPrice('$1,299.00', 'USD')).toEqual({ amountMinor: 129900, currency: 'USD' });
    expect(findPrice('¥1200', 'JPY')).toEqual({ amountMinor: 1200, currency: 'JPY' });
    expect(findPrice('$12.99', 'AUD')).toEqual({ amountMinor: 1299, currency: 'AUD' }); // their own dollar
    expect(findPrice('Premium Individual', 'USD')).toBeNull();
    expect(toMinor('1.299,00', 'EUR')).toBe(129900);
  });
  it('reads billing words', () => {
    expect(findCycle('$9.99/month')).toBe('monthly');
    expect(findCycle('$99.99 per year')).toBe('yearly');
    expect(findCycle('every 3 months')).toBe('quarterly');
    expect(findCycle('$4.99/week')).toBe('weekly');
  });
});

describe('matching names to the catalog', () => {
  it('Apple-style names', () => {
    expect(matchName('Netflix')?.id).toBe('netflix');
    expect(matchName('Spotify Premium')?.id).toBe('spotify');
    expect(matchName('YouTube Premium')?.id).toBe('youtube-premium');
    expect(matchName('ChatGPT Plus')?.id).toBe('chatgpt-plus');
    expect(matchName('Disney+: Streaming')?.id).toBe('disney-plus');
    expect(matchName('Corner Bakery Club')).toBeNull();
  });
  it('statement merchants', () => {
    expect(matchMerchant(cleanMerchant('POS DEBIT 1103 NETFLIX.COM 866-579-7172 CA'))?.id).toBe('netflix');
    expect(matchMerchant(cleanMerchant('SPOTIFY USA NEW YORK NY'))?.id).toBe('spotify');
    expect(matchMerchant(cleanMerchant('PAYPAL *DISNEYPLUS 402-935-7733'))?.id).toBe('disney-plus');
    expect(matchMerchant(cleanMerchant('OPENAI *CHATGPT SUBSCR'))?.id).toBe('chatgpt-plus');
    expect(matchMerchant(cleanMerchant('SHELL OIL 12345 HOUSTON TX'))).toBeNull();
  });
  it('every merchant alias points at a real catalog service', () => {
    for (const [, id] of MERCHANT_ALIASES) expect(SERVICE_BY_ID[id]?.id).toBe(id);
  });
});

describe('Apple subscriptions screenshot', () => {
  // What Apple's text reader returns for Settings → your name → Subscriptions (US layout).
  const lines = [
    '9:41', '‹ Back', 'Subscriptions', 'Active',
    'Netflix', 'Renews December 3, 2026',
    'Spotify Premium', 'Renews November 28, 2026',
    'ChatGPT Plus', '$19.99/month', 'Renews December 1, 2026',
    'Headspace', 'Free trial ends November 20, 2026',
    'Calm', 'Expires January 4, 2027',
    'Inactive',
    'Hulu', 'Expired October 2, 2026',
  ];
  const found = readAppleSubscriptions(lines, TODAY, 'USD');
  const by = (n: string) => found.find((f) => f.name.startsWith(n))!;
  it('finds each subscription with its date and state', () => {
    expect(found.map((f) => f.name)).toEqual(['Netflix', 'Spotify', 'ChatGPT', 'Headspace', 'Calm', 'Hulu']);
    expect(by('Netflix')).toMatchObject({ catalogId: 'netflix', date: '2026-12-03', state: 'renews', confidence: 'high' });
    expect(by('ChatGPT')).toMatchObject({ price: { amountMinor: 1999, currency: 'USD' }, cycle: 'monthly' });
    expect(by('Headspace').state).toBe('trial');
    expect(by('Calm').state).toBe('ends');
    expect(by('Hulu').state).toBe('expired');
  });
  it('ticks only the ones still charging', () => {
    expect(found.filter(preTicked).map((f) => f.name)).toEqual(['Netflix', 'Spotify', 'ChatGPT', 'Headspace']);
  });
  it('two overlapping screenshots don’t double up', () => {
    expect(readAppleSubscriptions([...lines, ...lines], TODAY, 'USD')).toHaveLength(found.length);
  });
  it('rows with a plan and price line, "Renews on", a Sort button', () => {
    const rows = readAppleSubscriptions(
      ['Subscriptions', 'Sort', 'Active', 'Netflix', 'Standard (Monthly)', '$17.99/month', 'Renews on December 3, 2026', 'YouTube Premium', 'Individual · $13.99 per month', 'Renews 21 November', 'Apple One', 'Expires on 4 January 2027'],
      TODAY,
      'USD',
    );
    expect(rows.map((f) => [f.catalogId, f.date, f.state, f.price?.amountMinor ?? null, f.cycle])).toEqual([
      ['netflix', '2026-12-03', 'renews', 1799, 'monthly'],
      ['youtube-premium', '2026-11-21', 'renews', 1399, 'monthly'],
      ['apple-one', '2027-01-04', 'ends', null, null],
    ]);
  });
  it('UK layout (day first) and an unknown app', () => {
    const uk = readAppleSubscriptions(['Active', 'Duolingo', 'Renews 5 December 2026', 'Tiny Habit Timer', 'Renews 1 January 2027'], TODAY, 'GBP', 'dmy');
    expect(uk.map((f) => [f.catalogId, f.date])).toEqual([['duolingo', '2026-12-05'], [null, '2027-01-01']]);
  });
});

describe('bank statements', () => {
  const pdfText = [
    'Statement period 09/01/2026 - 11/30/2026',
    '09/03 NETFLIX.COM 866-579-7172 CA 19.99 1,204.11',
    '09/05 SPOTIFY USA 11.99 1,192.12',
    '09/12 SHELL OIL 57444 HOUSTON TX 45.10 1,147.02',
    '09/15 APPLE.COM/BILL 866-712-7753 CA 9.99 1,137.03',
    '09/20 PAYMENT THANK YOU -500.00 637.03',
    '10/03 NETFLIX.COM 866-579-7172 CA 19.99 617.04',
    '10/05 SPOTIFY USA 11.99 605.05',
    '10/09 GYMBOX LTD 30.00 575.05',
    '10/15 APPLE.COM/BILL 866-712-7753 CA 9.99 565.06',
    '11/03 NETFLIX.COM 866-579-7172 CA 19.99 545.07',
    '11/05 SPOTIFY USA 12.99 532.08',
    '11/09 GYMBOX LTD 30.00 502.08',
    '11/12 TRADER JOES #123 61.20 440.88',
  ].join('\n');
  const res = readStatement(pdfText, TODAY, 'USD');
  it('reads the charges and skips payments', () => {
    expect(readStatementText(pdfText, TODAY, 'USD')).toHaveLength(12);
  });
  it('finds the repeats, sure ones first, with evidence', () => {
    expect(res.found.map((f) => [f.name, f.cycle, f.confidence])).toEqual([
      ['Netflix', 'monthly', 'high'],
      ['Spotify', 'monthly', 'high'],
      ['Gymbox Ltd', 'monthly', 'maybe'],
    ]);
    const nf = res.found[0];
    expect(nf.price).toEqual({ amountMinor: 1999, currency: 'USD' });
    expect(nf.date).toBe('2026-12-03');
    expect(nf.evidence).toBe('Sep 3, Oct 3, Nov 3');
    expect(res.found[1].evidence).toContain('price went up');
  });
  it('counts Apple charges it can’t name, and never guesses them', () => {
    expect(res.appleCharges).toBe(2);
    expect(res.found.some((f) => /apple/i.test(f.name))).toBe(false);
  });
  it('one-off shops never show up', () => {
    expect(res.found.some((f) => /shell|trader/i.test(f.name))).toBe(false);
  });
  it('Apple Card CSV export', () => {
    const csv = [
      'Transaction Date,Clearing Date,Description,Merchant,Category,Type,Amount (USD),Purchased By',
      '09/14/2026,09/15/2026,"HULU 877-8244858 CA","Hulu",Entertainment,Purchase,18.99,Sam',
      '10/14/2026,10/15/2026,"HULU 877-8244858 CA","Hulu",Entertainment,Purchase,18.99,Sam',
      '10/20/2026,10/20/2026,"ACH DEPOSIT","Apple",Payment,Payment,-200.00,Sam',
      '11/14/2026,11/15/2026,"HULU 877-8244858 CA","Hulu",Entertainment,Purchase,18.99,Sam',
    ].join('\n');
    const r = findRepeats(readCsv(csv, TODAY, 'USD'), TODAY);
    expect(r.found).toHaveLength(1);
    expect(r.found[0]).toMatchObject({ catalogId: 'hulu', cycle: 'monthly', date: '2026-12-14', price: { amountMinor: 1899, currency: 'USD' } });
  });
  it('UK bank CSV with negative debits and day-first dates', () => {
    const csv = ['Date,Description,Amount', '03/09/2026,NETFLIX.COM,-10.99', '03/10/2026,NETFLIX.COM,-10.99', '15/10/2026,SALARY,2500.00', '03/11/2026,NETFLIX.COM,-10.99'].join('\n');
    const r = findRepeats(readCsv(csv, TODAY, 'GBP', 'dmy'), TODAY);
    expect(r.found[0]).toMatchObject({ catalogId: 'netflix', date: '2026-12-03', price: { amountMinor: 1099, currency: 'GBP' } });
  });
  it('a single charge of a known service is only a maybe', () => {
    const r = findRepeats([{ date: '2026-11-01', text: 'AUDIBLE*AB12CD', amountMinor: 1495, currency: 'USD' }], TODAY);
    expect(r.found[0]).toMatchObject({ catalogId: 'audible', confidence: 'maybe' });
    expect(preTicked(r.found[0])).toBe(false);
  });
});
