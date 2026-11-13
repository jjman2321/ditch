import type { Metadata } from 'next';

import { ServiceIndex, type IndexItem } from '@/components/ServiceIndex';
import { COUNTRIES, hasLogo, priceHubServices, verifiedPrices, slugOf } from '@/lib/data';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `Subscription prices in ${COUNTRIES.length} countries, from official pages`,
  description: 'What Netflix, Spotify, Disney+, ChatGPT and more cost in the US, UK, Canada, Australia, Europe, India and the Middle East. Every plan, local money, dated.',
  alternates: { canonical: '/prices' },
};

export default function PricesIndex() {
  const hubs = priceHubServices();
  const items: IndexItem[] = hubs.map((s) => ({ id: s.id, slug: slugOf(s.id), name: s.name, aliases: s.aliases ?? [], category: s.category, meta: verifiedPrices(s.id).length === 1 ? 'US prices' : `${verifiedPrices(s.id).length} countries`, logo: hasLogo(s.id), color: s.color ?? '#6B6559', mono: s.mono ?? s.name[0] }));
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Subscription prices',
    url: `${SITE}/prices`,
    mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: `${x.name} prices`, url: `${SITE}/prices/${slugOf(x.id)}` })) },
  };
  return (
    <div className="wrap v4 index-head idx4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="v4-hero solo">
        <div>
          <h1>Subscription prices by country</h1>
          <p className="lead">
        What {hubs.length} subscriptions cost in up to {COUNTRIES.length} countries, in local money. Read from each service’s own page, with the date and the page we read.
          </p>
        </div>
      </header>
      <ServiceIndex items={items} base="/prices" noun="services" />
    </div>
  );
}
