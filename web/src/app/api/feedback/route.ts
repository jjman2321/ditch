import { env } from '@/lib/env';

// In-app feedback from the Ditch app (Settings → Feedback & help). Saves one row to D1.
// Only what the person typed, plus the optional counts line. No IP is stored: the
// per-address limit lives in this worker's memory and is forgotten within the hour.

const KINDS = ['problem', 'idea', 'service'] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY = 10 * 1024;
const PER_IP_HOUR = 10;
/** Backstop across every worker: past this many rows in an hour, wait it out. */
const ALL_HOUR = 300;
const HOUR = 60 * 60 * 1000;

const hits = new Map<string, number[]>();

/** True if this address has sent 10 in the last hour. Counts the attempt. */
function limited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < HOUR);
  if (recent.length >= PER_IP_HOUR) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map small: drop addresses with nothing in the last hour.
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < HOUR)) hits.delete(k);
  return false;
}

const fail = (error: string, status: number) => Response.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY) return fail('too-large', 413);
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY) return fail('too-large', 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fail('bad-request', 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return fail('bad-request', 400);
  }

  // Honeypot: the app never fills `website`. A bot that does gets a quiet "ok" and nothing is saved.
  if (typeof body.website === 'string' && body.website.trim()) return Response.json({ ok: true });

  const kind = body.kind;
  if (typeof kind !== 'string' || !(KINDS as readonly string[]).includes(kind)) return fail('invalid-kind', 400);

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (message.length < 3 || message.length > 4000) return fail('invalid-message', 400);

  let email: string | null = null;
  if (body.email !== undefined && body.email !== null) {
    if (typeof body.email !== 'string') return fail('invalid-email', 400);
    const e = body.email.trim();
    if (e && (!EMAIL.test(e) || e.length > 254)) return fail('invalid-email', 400);
    email = e || null;
  }

  let appInfo: string | null = null;
  if (body.app_info !== undefined && body.app_info !== null) {
    if (typeof body.app_info !== 'string' || body.app_info.length > 2000) return fail('invalid-app-info', 400);
    appInfo = body.app_info.trim() || null;
  }

  const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
  if (limited(ip)) return fail('rate-limited', 429);

  const { DB } = await env();
  // Until the database is set up, say so instead of pretending it saved.
  if (!DB) return fail('not-configured', 503);

  try {
    const recent = await DB.prepare("SELECT COUNT(*) AS n FROM feedback WHERE created_at > datetime('now', '-1 hour')").bind().first<{ n: number }>();
    if ((recent?.n ?? 0) >= ALL_HOUR) return fail('rate-limited', 429);
    await DB.prepare('INSERT INTO feedback (kind, message, email, app_info) VALUES (?, ?, ?, ?)').bind(kind, message, email, appInfo).run();
    return Response.json({ ok: true });
  } catch {
    // Database not ready (e.g. migration not applied): say so instead of failing silently.
    return fail('unavailable', 503);
  }
}
