import { SITE } from '@/lib/site';

// Plain route so we can add the Content-Signal line (same as ankidecks.ai and peptidetracker.xyz).
// Search engines and AI assistants are welcome: being cited is how an organic-only app gets found.
export function GET() {
  const body = `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
