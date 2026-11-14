import { hasLogo, priceChanges, priceHubServices, publishedGuides, serviceById, slugOf } from '@/lib/data';
import { SERVICE_TOOLS, TOOLS } from '@/lib/tools';

import { HUBS } from './tools/ChargesBody';

import { HeaderBar, type PageItem, type SearchItem } from './HeaderBar';

/** Server part of the header: builds the search list (every published guide and price page) once at build time. */
export function SiteHeader() {
  const guides = new Set(publishedGuides().map((g) => g.id));
  const hubs = new Set(priceHubServices().map((s) => s.id));
  const ids = [...new Set([...guides, ...hubs])];
  const items: SearchItem[] = ids
    .map((id) => {
      const s = serviceById(id);
      return { id, slug: slugOf(id), name: s?.name ?? id, aliases: s?.aliases ?? [], guide: guides.has(id), prices: hubs.has(id), rank: s?.rank ?? 999, logo: hasLogo(id) };
    })
    .sort((a, b) => a.rank - b.rank);
  // Free tools, charge finders and price increases are searchable too (QA, Nov 14).
  const pages: PageItem[] = [
    ...TOOLS.map((t) => ({ key: t.slug, label: t.name, href: `/${t.slug}`, words: `${t.name} ${t.desc} calculator tool` })),
    ...SERVICE_TOOLS.map((t) => ({ key: t.slug, label: t.name, href: `/tools/${t.slug}`, words: `${t.name} ${t.desc} calculator tool` })),
    ...Object.entries(HUBS).map(([k, h]) => ({ key: `charges-${k}`, label: h.title, href: `/charges/${k}`, words: `${h.title} ${h.desc} charge statement bill` })),
    ...(priceChanges().length ? [{ key: 'price-changes', label: 'Subscription price increases', href: '/price-changes', words: 'price increase rises hike went up changes' }] : []),
  ];
  return <HeaderBar items={items} pages={pages} />;
}
