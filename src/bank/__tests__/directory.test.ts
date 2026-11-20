import { bankEntry, mergeBanks, rememberBanks, searchBanks, TOP_BANKS } from '../banks';
import { toEntry } from '../directory';

describe('bank picker: built-in banks + the full directory', () => {
  it('the big banks all have a real logo and a directory id', () => {
    for (const b of TOP_BANKS) {
      expect(b.logo).toBeTruthy();
      expect(b.plaidId).toMatch(/^ins_\d+$/);
    }
  });

  it('a directory result becomes an entry: logo as a data URI, else a letter in its colour', () => {
    expect(toEntry({ id: 'ins_9', name: 'Navy Federal Credit Union', logo: 'iVBOR', color: '#003b71', country: 'US' })).toMatchObject({
      id: 'ins_9',
      plaidId: 'ins_9',
      mono: 'N',
      color: '#003b71',
      logo: 'data:image/png;base64,iVBOR',
    });
    const plain = toEntry({ id: 'ins_8', name: '1st Bank', logo: null, color: 'bad', country: 'CA' });
    expect(plain).toMatchObject({ mono: '1', color: '#5A5248', logo: undefined, country: 'CA' });
  });

  it('never shows a bank twice: same id or same name as a built-in one is dropped', () => {
    const local = searchBanks('chase');
    const remote = [toEntry({ id: 'ins_56', name: 'Chase', logo: null, color: null, country: 'US' }), toEntry({ id: 'ins_77', name: 'Chase Bank Kenya', logo: null, color: null, country: 'US' })];
    expect(mergeBanks(local, remote).map((b) => b.name)).toEqual(['Chase', 'Chase Bank Kenya']);
  });

  it('a bank picked from search can be found again by id (paywall, sign-in)', () => {
    rememberBanks([toEntry({ id: 'ins_4242', name: 'Hometown CU', logo: null, color: null, country: 'US' })]);
    expect(bankEntry('ins_4242')?.name).toBe('Hometown CU');
    expect(bankEntry('ins_127989')?.id).toBe('bofa');
  });
});
