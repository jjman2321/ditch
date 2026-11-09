import { formatMoney } from '../money';

// The iPhone's JavaScript engine (Hermes) has no Intl.NumberFormat#formatToParts.
// These checks run the formatter with it removed, the way it runs on a real phone.
describe('formatMoney without formatToParts (iPhone engine)', () => {
  const proto = Intl.NumberFormat.prototype as unknown as { formatToParts?: unknown };
  const original = proto.formatToParts;

  beforeAll(() => {
    delete proto.formatToParts;
  });
  afterAll(() => {
    proto.formatToParts = original;
  });

  it('formats the home currency normally', () => {
    expect(formatMoney(1999, 'USD')).toBe('$19.99');
    expect(formatMoney(109140, 'USD', { trimWhole: false })).toBe('$1,091.40');
  });

  it('keeps foreign dollars distinguishable', () => {
    expect(formatMoney(2000, 'USD', { home: 'GBP' })).toBe('US$20.00');
    expect(formatMoney(1499, 'AUD', { home: 'USD' })).toBe('A$14.99');
  });

  it('formats zero-decimal currencies', () => {
    expect(formatMoney(1490, 'JPY')).toBe('¥1,490');
  });
});
