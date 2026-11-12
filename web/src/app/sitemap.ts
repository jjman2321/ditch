import type { MetadataRoute } from 'next';

import { freshness, priceHubServices, publishedGuides, verifiedPrices } from '@/lib/data';
import { SITE } from '@/lib/site';

const SITE_UPDATED = '2026-11-12';

/** lastModified is the real checked date (never bumped without a re-check). Expired pages (180+ days) are left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const guides = publishedGuides().filter((g) => freshness(g.checkedOn) !== 'expired');
  const hubs = priceHubServices();
  return [
    { url: SITE, lastModified: SITE_UPDATED, priority: 1 },
    { url: `${SITE}/cancel`, lastModified: SITE_UPDATED, priority: 0.9 },
    { url: `${SITE}/prices`, lastModified: SITE_UPDATED, priority: 0.9 },
    ...guides.map((g) => ({ url: `${SITE}/cancel/${g.id}`, lastModified: g.checkedOn, priority: 0.8 })),
    ...hubs.map((s) => ({ url: `${SITE}/prices/${s.id}`, lastModified: verifiedPrices(s.id).map((r) => r.checked).sort().pop(), priority: 0.8 })),
    ...['/how-we-check', '/about', '/support', '/privacy', '/terms'].map((p) => ({ url: `${SITE}${p}`, lastModified: SITE_UPDATED, priority: 0.4 })),
  ];
}
