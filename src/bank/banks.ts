// Banks for the picker (design/v32 screen 3). The big nine come first, as a grid; the rest
// show when searched, together with every other bank from the provider's directory
// (src/bank/directory.ts). Logos (owner, Nov 20): the big ones are bundled in assets/banks (the
// provider's own logo, or the bank's official iPhone app icon where the provider has none); search
// results use the provider's logo, else a letter tile in the bank's colour.
// The provider itself is never named on Ditch's screens (DECISIONS #64).

export type BankEntry = {
  id: string;
  name: string;
  /** 1–2 letters on the tile. */
  mono: string;
  /** Tile colour and letter colour (the bank's own brand colours, like the service catalog's). */
  color: string;
  ink: string;
  /** A bundled image (require) or a URI (the directory's base64 PNG). Letters when missing. */
  logo?: string | number | { uri: string };
  /** The provider's institution id, so search results and the big ones never show twice. */
  plaidId?: string;
  /** Other names people type ("BofA", "Amex"). */
  aka?: string[];
  country: 'US' | 'CA';
};

/** The 9 big US banks and cards, in the mockup's order. */
export const TOP_BANKS: BankEntry[] = [
  { id: 'chase', name: 'Chase', mono: 'C', color: '#117ACA', ink: '#FFFFFF', country: 'US', aka: ['jpmorgan', 'jp morgan'] , logo: require('../../assets/banks/chase.png'), plaidId: 'ins_56' },
  { id: 'bofa', name: 'Bank of America', mono: 'BA', color: '#E31837', ink: '#FFFFFF', country: 'US', aka: ['bofa', 'boa'] , logo: require('../../assets/banks/bofa.png'), plaidId: 'ins_127989' },
  { id: 'wellsfargo', name: 'Wells Fargo', mono: 'WF', color: '#D71E28', ink: '#FFCD41', country: 'US', aka: ['wells'] , logo: require('../../assets/banks/wellsfargo.png'), plaidId: 'ins_127991' },
  { id: 'capitalone', name: 'Capital One', mono: 'C1', color: '#004977', ink: '#FFFFFF', country: 'US', aka: ['cap one'] , logo: require('../../assets/banks/capitalone.png'), plaidId: 'ins_128026' },
  { id: 'citi', name: 'Citi', mono: 'C', color: '#056DAE', ink: '#FFFFFF', country: 'US', aka: ['citibank'] , logo: require('../../assets/banks/citi.png'), plaidId: 'ins_5' },
  { id: 'amex', name: 'Amex', mono: 'AM', color: '#006FCF', ink: '#FFFFFF', country: 'US', aka: ['american express'] , logo: require('../../assets/banks/amex.png'), plaidId: 'ins_10' },
  { id: 'discover', name: 'Discover', mono: 'D', color: '#FF6000', ink: '#FFFFFF', country: 'US' , logo: require('../../assets/banks/discover.png'), plaidId: 'ins_33' },
  { id: 'chime', name: 'Chime', mono: 'C', color: '#1EC677', ink: '#FFFFFF', country: 'US' , logo: require('../../assets/banks/chime.png'), plaidId: 'ins_35' },
  { id: 'usbank', name: 'U.S. Bank', mono: 'US', color: '#0C2074', ink: '#FFFFFF', country: 'US', aka: ['us bank', 'usbank'] , logo: require('../../assets/banks/usbank.png'), plaidId: 'ins_127990' },
];

/** Found by search only. */
export const MORE_BANKS: BankEntry[] = [
  { id: 'pnc', name: 'PNC', mono: 'P', color: '#EF7622', ink: '#FFFFFF', country: 'US' , logo: require('../../assets/banks/pnc.png'), plaidId: 'ins_13' },
  { id: 'td', name: 'TD Bank', mono: 'TD', color: '#34A853', ink: '#FFFFFF', country: 'US' , logo: require('../../assets/banks/td.png'), plaidId: 'ins_14' },
  { id: 'truist', name: 'Truist', mono: 'T', color: '#2E1A47', ink: '#FFFFFF', country: 'US' , logo: require('../../assets/banks/truist.png'), plaidId: 'ins_130888' },
  { id: 'usaa', name: 'USAA', mono: 'U', color: '#12395B', ink: '#FFFFFF', country: 'US' },
  { id: 'navyfed', name: 'Navy Federal', mono: 'NF', color: '#003B71', ink: '#FFFFFF', country: 'US', aka: ['navy federal credit union', 'nfcu'] },
  { id: 'ally', name: 'Ally', mono: 'A', color: '#650360', ink: '#FFFFFF', country: 'US' },
  { id: 'sofi', name: 'SoFi', mono: 'S', color: '#00A2C7', ink: '#FFFFFF', country: 'US' },
  { id: 'schwab', name: 'Charles Schwab', mono: 'S', color: '#00A0DF', ink: '#FFFFFF', country: 'US', aka: ['schwab'] },
  { id: 'fidelity', name: 'Fidelity', mono: 'F', color: '#368727', ink: '#FFFFFF', country: 'US' },
  { id: 'synchrony', name: 'Synchrony', mono: 'S', color: '#3B3B3B', ink: '#FBC600', country: 'US' },
  { id: 'rbc', name: 'RBC Royal Bank', mono: 'R', color: '#005DAA', ink: '#FFD200', country: 'CA', aka: ['rbc', 'royal bank'] },
  { id: 'tdca', name: 'TD Canada Trust', mono: 'TD', color: '#34A853', ink: '#FFFFFF', country: 'CA' },
  { id: 'scotia', name: 'Scotiabank', mono: 'S', color: '#EC111A', ink: '#FFFFFF', country: 'CA' },
  { id: 'bmo', name: 'BMO', mono: 'B', color: '#0079C1', ink: '#FFFFFF', country: 'CA', aka: ['bank of montreal'] },
  { id: 'cibc', name: 'CIBC', mono: 'C', color: '#C41F3E', ink: '#FFFFFF', country: 'CA' },
];

export const ALL_BANKS = [...TOP_BANKS, ...MORE_BANKS];
export const BANK_BY_ID: Record<string, BankEntry> = Object.fromEntries(ALL_BANKS.map((b) => [b.id, b]));

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim();

/** Banks whose name (or a nickname) contains what was typed. Empty query: the big nine. */
export function searchBanks(query: string): BankEntry[] {
  const q = norm(query);
  if (!q) return TOP_BANKS;
  return ALL_BANKS.filter((b) => [b.name, ...(b.aka ?? [])].some((n) => norm(n).includes(q)));
}

/** Banks met in directory search this session, so a picked one can be looked up again by id. */
const seen = new Map<string, BankEntry>();
export function rememberBanks(list: BankEntry[]): void {
  for (const b of list) seen.set(b.id, b);
}

/** A bank by its id, or by the name the server reports (for a link made elsewhere). */
export function bankEntry(idOrName: string | null | undefined): BankEntry | null {
  if (!idOrName) return null;
  return (
    BANK_BY_ID[idOrName] ??
    ALL_BANKS.find((b) => b.plaidId === idOrName || norm(b.name) === norm(idOrName)) ??
    seen.get(idOrName) ??
    [...seen.values()].find((b) => norm(b.name) === norm(idOrName)) ??
    null
  );
}

/** Local matches first, then directory results that aren't already shown (same id or same name). */
export function mergeBanks(local: BankEntry[], remote: BankEntry[]): BankEntry[] {
  const ids = new Set(local.flatMap((b) => [b.id, b.plaidId].filter(Boolean) as string[]));
  const names = new Set(local.map((b) => norm(b.name)));
  return [...local, ...remote.filter((r) => !ids.has(r.id) && !names.has(norm(r.name)))];
}
