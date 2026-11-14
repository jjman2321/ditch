import type { MetadataRoute } from 'next';

import { freshness, priceChanges, priceHubServices, publishedGuides, verifiedPrices, slugOf } from '@/lib/data';
import { SITE } from '@/lib/site';
import { SERVICE_TOOLS, TOOLS } from '@/lib/tools';
import { HUBS } from '@/components/tools/ChargesBody';

const SITE_UPDATED = '2026-11-12';
const TOOLS_ADDED = '2026-11-13';

/** lastModified is the real checked date (never bumped without a re-check). Expired pages (180+ days) are left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const guides = publishedGuides().filter((g) => freshness(g.checkedOn) !== 'expired');
  const hubs = priceHubServices();
  return [
    { url: SITE, lastModified: SITE_UPDATED },
    { url: `${SITE}/cancel`, lastModified: SITE_UPDATED },
    { url: `${SITE}/prices`, lastModified: SITE_UPDATED },
    { url: `${SITE}/tools`, lastModified: TOOLS_ADDED },
    ...(priceChanges().length ? [{ url: `${SITE}/price-changes`, lastModified: TOOLS_ADDED }] : []),
    ...TOOLS.map((t) => ({ url: `${SITE}/${t.slug}`, lastModified: TOOLS_ADDED })),
    ...SERVICE_TOOLS.map((t) => ({ url: `${SITE}/tools/${t.slug}`, lastModified: TOOLS_ADDED })),
    ...Object.keys(HUBS).map((h) => ({ url: `${SITE}/charges/${h}`, lastModified: TOOLS_ADDED })),
    ...guides.map((g) => ({ url: `${SITE}/cancel/${slugOf(g.id)}`, lastModified: g.checkedOn })),
    ...hubs.map((s) => ({ url: `${SITE}/prices/${slugOf(s.id)}`, lastModified: verifiedPrices(s.id).map((r) => r.checked).sort().pop() })),
    ...['/how-we-check', '/about', '/support', '/privacy', '/terms'].map((p) => ({ url: `${SITE}${p}`, lastModified: SITE_UPDATED })),
  ];
}
