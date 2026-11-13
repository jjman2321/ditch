import { SITE } from '@/lib/site';
import { env } from '@/lib/env';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Waitlist sign-up. Saves to D1, then emails a confirm link through Resend (double opt-in). */
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

  const { DB, RESEND_API_KEY, EMAIL_FROM } = await env();
  // Until the database is set up (see web/README.md), say so instead of pretending it saved.
  if (!DB) return Response.json({ ok: false, error: 'not-configured' }, { status: 503 });

  try {
  const token = crypto.randomUUID();
  await DB.prepare(
    'INSERT INTO waitlist (email, source, report, token) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET report = MAX(report, excluded.report)',
  )
    .bind(email, source, report, token)
    .run();
  const row = await DB.prepare('SELECT token, confirmed_at FROM waitlist WHERE email = ?').bind(email).first<{ token: string; confirmed_at: string | null }>();

  if (row?.confirmed_at) return Response.json({ ok: true, confirmed: true, sent: false });
  let sent = false;
  if (RESEND_API_KEY && row) {
    const link = `${SITE}/api/confirm?t=${row.token}`;
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: EMAIL_FROM ?? 'Ditch <hello@ditchsubs.app>',
        to: email,
        subject: 'Confirm your spot on the Ditch waitlist',
        text: `Tap to confirm: ${link}\n\nOne email the day Ditch is out. Unsubscribe anytime.\n\nDidn't sign up? Ignore this and nothing happens.\n\nDitch · Grasp Labs LLC`,
      }),
    }).catch(() => null);
    sent = Boolean(r?.ok);
  }
  return Response.json({ ok: true, confirmed: false, sent });
  } catch {
    // Database not ready (e.g. migration not applied): say so instead of failing silently.
    return Response.json({ ok: false, error: 'unavailable' }, { status: 503 });
  }
}
