/**
 * Structured data as ONE object per <script>: a single item as is, several items as one @graph.
 * (A top-level JSON-LD array has crashed browser add-ons; SEO skill lessons, Nov 2026.) `<` is escaped so text can't close the tag.
 */
type Node = Record<string, unknown>;
export function JsonLd({ data }: { data: Node | Node[] }) {
  const items = Array.isArray(data) ? data : [data];
  const out = items.length === 1 ? items[0] : { '@context': 'https://schema.org', '@graph': items.map((n) => Object.fromEntries(Object.entries(n).filter(([k]) => k !== '@context'))) };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(out).replace(/</g, '\\u003c') }} />;
}
