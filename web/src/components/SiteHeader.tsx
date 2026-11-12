import { priceHubServices, publishedGuides, serviceById } from '@/lib/data';

import { HeaderBar, type SearchItem } from './HeaderBar';

/** Server part of the header: builds the search list (every published guide and price page) once at build time. */
export function SiteHeader() {
  const guides = new Set(publishedGuides().map((g) => g.id));
  const hubs = new Set(priceHubServices().map((s) => s.id));
  const ids = [...new Set([...guides, ...hubs])];
  const items: SearchItem[] = ids
    .map((id) => {
      const s = serviceById(id);
      return { id, name: s?.name ?? id, aliases: s?.aliases ?? [], guide: guides.has(id), prices: hubs.has(id), rank: s?.rank ?? 999 };
    })
    .sort((a, b) => a.rank - b.rank);
  return <HeaderBar items={items} />;
}
