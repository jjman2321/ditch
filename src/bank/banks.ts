// Banks for the picker (design/v32 screen 3). The big nine come first, as a grid; the rest
// only show when searched. Logos: letter tiles in each bank's own colour for now. The real
// logos come from the bank-data provider once the native build has it (`logo` is the hook:
// a URL or base64 PNG; when it's set, BankTile shows it instead of the letters).
// The provider itself is never named on Ditch's screens (DECISIONS #64).

export type BankEntry = {
  id: string;
  name: string;
  /** 1–2 letters on the tile. */
  mono: string;
  /** Tile colour and letter colour (the bank's own brand colours, like the service catalog's). */
  color: string;
  ink: string;
  /** From the provider later. */
  logo?: string;
  /** Other names people type ("BofA", "Amex"). */
  aka?: string[];
  country: 'US' | 'CA';
};

/** The 9 big US banks and cards, in the mockup's order. */
export const TOP_BANKS: BankEntry[] = [
  { id: 'chase', name: 'Chase', mono: 'C', color: '#117ACA', ink: '#FFFFFF', country: 'US', aka: ['jpmorgan', 'jp morgan'] },
  { id: 'bofa', name: 'Bank of America', mono: 'BA', color: '#E31837', ink: '#FFFFFF', country: 'US', aka: ['bofa', 'boa'] },
  { id: 'wellsfargo', name: 'Wells Fargo', mono: 'WF', color: '#D71E28', ink: '#FFCD41', country: 'US', aka: ['wells'] },
  { id: 'capitalone', name: 'Capital One', mono: 'C1', color: '#004977', ink: '#FFFFFF', country: 'US', aka: ['cap one'] },
  { id: 'citi', name: 'Citi', mono: 'C', color: '#056DAE', ink: '#FFFFFF', country: 'US', aka: ['citibank'] },
  { id: 'amex', name: 'Amex', mono: 'AM', color: '#006FCF', ink: '#FFFFFF', country: 'US', aka: ['american express'] },
  { id: 'discover', name: 'Discover', mono: 'D', color: '#FF6000', ink: '#FFFFFF', country: 'US' },
  { id: 'chime', name: 'Chime', mono: 'C', color: '#1EC677', ink: '#FFFFFF', country: 'US' },
  { id: 'usbank', name: 'U.S. Bank', mono: 'US', color: '#0C2074', ink: '#FFFFFF', country: 'US', aka: ['us bank', 'usbank'] },
];

/** Found by search only. */
export const MORE_BANKS: BankEntry[] = [
  { id: 'pnc', name: 'PNC', mono: 'P', color: '#EF7622', ink: '#FFFFFF', country: 'US' },
  { id: 'td', name: 'TD Bank', mono: 'TD', color: '#34A853', ink: '#FFFFFF', country: 'US' },
  { id: 'truist', name: 'Truist', mono: 'T', color: '#2E1A47', ink: '#FFFFFF', country: 'US' },
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

/** A bank by its id, or by the name the server reports (for a link made elsewhere). */
export function bankEntry(idOrName: string | null | undefined): BankEntry | null {
  if (!idOrName) return null;
  return BANK_BY_ID[idOrName] ?? ALL_BANKS.find((b) => norm(b.name) === norm(idOrName)) ?? null;
}
