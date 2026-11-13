import { env } from '@/lib/env';
import { SITE } from '@/lib/site';

/** The link in the confirm email. Marks the address confirmed and adds it to the Resend audience. */
export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get('t') ?? '';
  const { DB, RESEND_API_KEY, RESEND_AUDIENCE_ID } = await env();
  if (!DB || !/^[0-9a-f-]{36}$/.test(t)) return Response.redirect(`${SITE}/waitlist/invalid`, 303);
  const row = await DB.prepare('SELECT email, report FROM waitlist WHERE token = ?').bind(t).first<{ email: string; report: number }>();
  if (!row) return Response.redirect(`${SITE}/waitlist/invalid`, 303);
  await DB.prepare("UPDATE waitlist SET confirmed_at = COALESCE(confirmed_at, datetime('now')) WHERE token = ?").bind(t).run();
  if (RESEND_API_KEY && RESEND_AUDIENCE_ID) {
    await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: { authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ email: row.email, unsubscribed: false }),
    }).catch(() => null);
  }
  return Response.redirect(`${SITE}/waitlist/confirmed`, 303);
}
