import { env } from '@/lib/env';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Waitlist sign-up: saves the address to D1. No email is sent for now (owner, Nov 14). */
export async function POST(req: Request) {
  let body: { email?: unknown; source?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'bad-request' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source.slice(0, 200) : null;
  // The Price Hike Report option was dropped (owner, Nov 13). The column stays so old rows keep their value.
  const report = 0;
  if (!EMAIL.test(email) || email.length > 254) return Response.json({ ok: false, error: 'invalid-email' }, { status: 400 });

  const { DB } = await env();
  // Until the database is set up, say so instead of pretending it saved.
  if (!DB) return Response.json({ ok: false, error: 'not-configured' }, { status: 503 });

  // Owner, Nov 14: collect only, no emails for now. One row per address; signing up twice is fine.
  try {
    const before = await DB.prepare('SELECT 1 AS x FROM waitlist WHERE email = ?').bind(email).first<{ x: number }>();
    if (!before) {
      await DB.prepare('INSERT INTO waitlist (email, source, report, token) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING')
        .bind(email, source, report, crypto.randomUUID())
        .run();
    }
    return Response.json({ ok: true, already: Boolean(before) });
  } catch {
    // Database not ready (e.g. migration not applied): say so instead of failing silently.
    return Response.json({ ok: false, error: 'unavailable' }, { status: 503 });
  }
}
