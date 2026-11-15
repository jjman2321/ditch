import type { Metadata } from 'next';

import { JsonLd } from '@/components/JsonLd';
import { ToolHub, type Group } from '@/components/ToolHub';
import { COUNTRIES } from '@/lib/data';
import { SITE, og, pageTitle } from '@/lib/site';
import { SERVICE_TOOLS } from '@/lib/tools';

export const metadata: Metadata = {
  title: pageTitle('Subscription comparisons: price and plans'),
  description: 'ChatGPT vs Claude, Spotify vs Apple Music, Netflix vs Hulu, Claude Pro vs Max and more. Real prices and what each plan includes, from each company’s own page.',
  alternates: { canonical: '/compare' },
  openGraph: og('/compare'),
};

/**
 * Every side-by-side in one place (owner, Nov 15: "make plenty of them"). Grouped the way people shop:
 * AI first (most searched), then music, TV, storage, gaming, and plan vs plan inside one service.
 */
const ORDER: { id: string; title: string; sub: string }[] = [
  { id: 'ai', title: 'AI chat', sub: 'ChatGPT, Claude, Gemini, Perplexity and Copilot.' },
  { id: 'music', title: 'Music', sub: 'Spotify, Apple Music, Amazon Music, TIDAL and Deezer.' },
  { id: 'tv', title: 'TV and video', sub: 'Netflix, Disney+, HBO Max, Hulu, Peacock and more.' },
  { id: 'storage', title: 'Cloud storage', sub: 'iCloud+, Google One and Dropbox.' },
  { id: 'gaming', title: 'Gaming', sub: 'Game Pass and PlayStation Plus.' },
  { id: 'plans', title: 'Which plan?', sub: 'Two plans from the same service.' },
  { id: 'more', title: 'More', sub: 'Other side-by-sides.' },
];

export default function Compare() {
  const all = SERVICE_TOOLS.filter((t) => t.kind === 'vs' || t.kind === 'tiers');
  const groups: Group[] = ORDER.map((g) => ({
    ...g,
    items: all.filter((t) => (t.group ?? 'more') === g.id).map((t) => ({ href: `/tools/${t.slug}`, name: t.name, desc: t.desc })),
  })).filter((g) => g.items.length);
  const items = groups.flatMap((g) => g.items);
  const ld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Subscription comparisons', url: `${SITE}/compare`, mainEntity: { '@type': 'ItemList', itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, url: `${SITE}${x.href}` })) } };
  return (
    <div className="wrap v4 tool hubpage">
      <JsonLd data={ld} />
      <header className="v4-hero solo">
        <div>
          <h1>Compare subscriptions</h1>
          <p className="lead">
            {items.length} side-by-sides: what each plan costs in up to {COUNTRIES.length} countries, and what you get, from each company’s own page.
          </p>
        </div>
      </header>
      <ToolHub groups={groups} noun={['comparison', 'comparisons']} placeholder="Search, like “Claude” or “Netflix”" />
    </div>
  );
}
