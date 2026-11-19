import { currencyDigits, majorToMinor } from '../functions/_shared/money.ts';
import { mapPlaidTxn, type PlaidTxn } from '../functions/_shared/plaidMap.ts';
import { mapStripeTxn } from '../functions/_shared/stripe.ts';

const plaid = (over: Partial<PlaidTxn>): PlaidTxn => ({
  transaction_id: 't1',
  amount: 15.49,
  iso_currency_code: 'USD',
  date: '2026-11-03',
  name: 'Netflix',
  merchant_name: 'Netflix',
  pending: false,
  ...over,
});

describe('money: provider amounts -> whole minor units', () => {
  it('knows real currency decimals', () => {
    expect(currencyDigits('USD')).toBe(2);
    expect(currencyDigits('jpy')).toBe(0);
    expect(currencyDigits('KWD')).toBe(3);
    expect(currencyDigits('CAD')).toBe(2);
  });

  it('converts without float noise', () => {
    expect(majorToMinor(15.49, 'USD')).toBe(1549);
    expect(majorToMinor(0.1 + 0.2, 'USD')).toBe(30);
    expect(majorToMinor(17.99, 'CAD')).toBe(1799);
    expect(majorToMinor(1500, 'JPY')).toBe(1500);
    expect(majorToMinor(1.234, 'KWD')).toBe(1234);
    expect(majorToMinor(-4.5, 'USD')).toBe(-450);
    expect(majorToMinor(-0, 'USD')).toBe(0);
    expect(() => majorToMinor(NaN, 'USD')).toThrow();
  });
});

describe('mapPlaidTxn', () => {
  it('keeps Plaid sign: money out is positive, refunds negative', () => {
    expect(mapPlaidTxn(plaid({ amount: 15.49 }))!.amountMinor).toBe(1549);
    expect(mapPlaidTxn(plaid({ amount: -20 }))!.amountMinor).toBe(-2000);
  });

  it('maps JPY with 0 decimals', () => {
    expect(mapPlaidTxn(plaid({ amount: 980, iso_currency_code: 'JPY' }))).toMatchObject({ amountMinor: 980, currency: 'JPY' });
  });

  it('prefers the raw bank line and the authorized date, and keeps the merchant name', () => {
    const t = mapPlaidTxn(plaid({ original_description: 'NETFLIX.COM 866-579-7172 CA', authorized_date: '2026-11-02', date: '2026-11-04' }))!;
    expect(t).toEqual({ id: 't1', date: '2026-11-02', text: 'NETFLIX.COM 866-579-7172 CA', merchantName: 'Netflix', amountMinor: 1549, currency: 'USD', pending: false });
  });

  it('drops rows without an ISO currency (crypto) or with a bad date', () => {
    expect(mapPlaidTxn(plaid({ iso_currency_code: null, unofficial_currency_code: 'BTC' }))).toBeNull();
    expect(mapPlaidTxn(plaid({ date: 'nope', authorized_date: null }))).toBeNull();
  });

  it('marks pending', () => {
    expect(mapPlaidTxn(plaid({ pending: true }))!.pending).toBe(true);
  });
});

describe('mapStripeTxn', () => {
  it('flips Stripe sign (negative = money out) and keeps minor units', () => {
    expect(mapStripeTxn({ id: 'fctxn_1', amount: -1799, currency: 'usd', description: 'NETFLIX', status: 'posted', transacted_at: 1793664000 })).toEqual({
      id: 'fctxn_1',
      date: '2026-11-03',
      text: 'NETFLIX',
      merchantName: null,
      amountMinor: 1799,
      currency: 'USD',
      pending: false,
    });
    expect(mapStripeTxn({ id: 'x', amount: 500, currency: 'usd', description: 'Refund', status: 'pending', transacted_at: 1793664000 })).toMatchObject({ amountMinor: -500, pending: true });
  });
});
