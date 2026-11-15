import { SITE } from '@/lib/site';

// Plain route. The Content-Signal line was removed (Nov 15): it only said yes to everything, which is the default
// anyway, and Lighthouse flags it as an unknown directive.
// Search engines and AI assistants are welcome: being cited is how an organic-only app gets found.
export function GET() {
  const body = `User-Agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
