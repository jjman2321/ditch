/**
 * How people actually search for each price page (DataForSEO, Google US, Nov 15; docs/website/seo-research-2026-11-15.md).
 * title: the Google title (n = countries we have). h1: the page heading. who: the subject of the first sentence
 * ("A Costco membership costs …"). Pages not listed keep the standard "X prices 2026: every plan, N countries".
 * Owner approved the list on Nov 15. Only change an entry with fresh search data.
 */
type SearchName = { title: (n: number) => string; h1?: string; who?: string };
const where = (n: number) => (n > 1 ? `${n} countries` : 'the US');
export const PRICE_SEARCH: Record<string, SearchName> = {
  'claude-pro': { title: (n) => `Claude pricing 2026: Pro, Max and Ultra, ${where(n)}`, h1: 'Claude pricing' },
  costco: { title: (n) => `Costco membership cost 2026: every tier, ${where(n)}`, h1: 'Costco membership cost', who: 'A Costco membership' },
  'youtube-tv': { title: () => 'YouTube TV cost 2026: every plan in the US', h1: 'YouTube TV cost' },
  icloud: { title: (n) => `iCloud storage plans 2026: every price, ${where(n)}`, h1: 'iCloud storage plans', who: 'iCloud+ storage' },
  nyt: { title: (n) => `New York Times subscription 2026: price in ${where(n)}`, h1: 'New York Times subscription price', who: 'A New York Times subscription' },
  'amazon-prime': { title: (n) => `How much is Amazon Prime? 2026 prices, ${where(n)}` },
  'uber-one': { title: (n) => `Uber One membership 2026: price in ${where(n)}`, h1: 'Uber One membership price', who: 'Uber One membership' },
  'ps-plus': { title: () => 'PS Plus price 2026: Essential, Extra and Premium', h1: 'PS Plus price' },
  'paramount-plus': { title: (n) => `How much is Paramount+? 2026 prices, ${where(n)}` },
  spotify: { title: (n) => `How much is Spotify Premium? 2026, ${where(n)}` },
  'xbox-game-pass': { title: (n) => `Xbox Game Pass cost 2026: every tier, ${where(n)}`, h1: 'Xbox Game Pass cost' },
  'canva-pro': { title: () => 'Canva Pro price 2026: Pro and Business, US and UK' },
  roblox: { title: (n) => `Roblox Premium 2026: price in ${where(n)}` },
  'google-ai-pro': { title: () => 'Gemini price 2026: Google AI Plus, Pro and Ultra', h1: 'Gemini (Google AI) price', who: 'Gemini (Google AI Pro)' },
  dropbox: { title: (n) => `Dropbox price 2026: Plus and every plan, ${where(n)}` },
  babbel: { title: (n) => `Babbel cost 2026: every plan, ${where(n)}`, h1: 'Babbel cost' },
  masterclass: { title: (n) => `MasterClass subscription 2026: price in ${where(n)}`, h1: 'MasterClass subscription price', who: 'A MasterClass subscription' },
  notion: { title: (n) => `Notion pricing 2026: Plus and Business, ${where(n)}`, h1: 'Notion pricing' },
  peloton: { title: () => 'Peloton membership cost 2026: App and All-Access', h1: 'Peloton membership cost', who: 'A Peloton membership' },
  oura: { title: (n) => `Oura membership cost 2026: price in ${where(n)}`, h1: 'Oura membership cost', who: 'An Oura membership' },
  perplexity: { title: (n) => `Perplexity pricing 2026: Pro and Max, ${where(n)}`, h1: 'Perplexity pricing' },
  'copilot-pro': { title: (n) => `Copilot price 2026: Microsoft 365 Premium, ${where(n)}`, h1: 'Copilot (Microsoft 365 Premium) price', who: 'Copilot (Microsoft 365 Premium)' },
  grammarly: { title: () => 'Grammarly cost 2026: Pro and every plan', h1: 'Grammarly cost' },
  proton: { title: () => 'Proton pricing 2026: Mail, VPN, Pass and Unlimited', h1: 'Proton pricing' },
  'discord-nitro': { title: (n) => `Discord Nitro cost 2026: every plan, ${where(n)}`, h1: 'Discord Nitro cost' },
  economist: { title: (n) => `The Economist subscription 2026: price in ${where(n)}`, h1: 'The Economist subscription price', who: 'A subscription to The Economist' },
};

/** Cancel guides: the name people type after "how to cancel" (matches the renamed services above). */
export const CANCEL_NAME: Record<string, string> = {
  'claude-pro': 'Claude',
  dropbox: 'Dropbox',
  notion: 'Notion',
  grammarly: 'Grammarly',
  proton: 'Proton',
  perplexity: 'Perplexity',
  'google-ai-pro': 'Gemini (Google AI Pro)',
  costco: 'Costco membership',
};
