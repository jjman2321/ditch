import type { Metadata } from 'next';

import { ServiceIndex, type IndexItem } from '@/components/ServiceIndex';
import { formatDate, hasLogo, publishedGuides, serviceById } from '@/lib/data';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'How to cancel any subscription: guides checked by hand',
  description: 'Official cancel links and steps for Netflix, Spotify, Disney+, YouTube Premium and more, split by how you pay. Each guide shows the date we checked it.',
  alternates: { canonical: '/cancel' },
};

export default function CancelIndex() {
  const guides = publishedGuides();
  const items: IndexItem[] = guides.map((g) => {
    const s = serviceById(g.id);
    return { id: g.id, name: g.name, aliases: s?.aliases ?? [], category: s?.category ?? 'Other', meta: `Checked ${formatDate(g.checkedOn)}`, logo: hasLogo(g.id), color: s?.color ?? '#6B6559', mono: s?.mono ?? g.name[0] };
  });
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Cancel guides',
    url: `${SITE}/cancel`,
    mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: `How to cancel ${x.name}`, url: `${SITE}/cancel/${x.id}` })) },
  };
  return (
    <div className="wrap index-head">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="d-h1">How to cancel a subscription</h1>
      <p className="lead" style={{ marginTop: 20, maxWidth: '34rem' }}>
        Step-by-step cancel guides for {guides.length} services, checked by hand on each service’s own pages. Each one starts with how you pay, because that decides where you cancel.
      </p>
      <ServiceIndex items={items} base="/cancel" noun="guides" />
    </div>
  );
}
