import { allPoints } from '@/lib/tools';

/** The checked price list for the free tools: one static file, downloaded once and cached by every tool page. */
export function GET() {
  const pts = allPoints();
  // Compact: one table of services, then rows of [service index, country, currency, plan, amount, cycle, biller].
  const svc: { s: string; n: string; g: string | null; h: string | null; l: boolean }[] = [];
  const idx = new Map<string, number>();
  const rows = pts.map((p) => {
    if (!idx.has(p.s)) { idx.set(p.s, svc.length); svc.push({ s: p.s, n: p.n, g: p.g, h: p.h, l: p.l }); }
    return [idx.get(p.s), p.c, p.cur, p.p, p.a, p.cy, p.b, p.d ? 1 : 0];
  });
  return new Response(JSON.stringify({ svc, rows }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
