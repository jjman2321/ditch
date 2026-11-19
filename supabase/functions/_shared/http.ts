// Tiny HTTP helpers shared by every function. Errors go to the phone as short codes only.

export const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const fail = (status: number, error: string, extra: Record<string, unknown> = {}) => json(status, { error, ...extra });

/** Reads the raw body with a size cap (webhook signatures need the exact bytes). */
export async function readBody(req: Request, maxBytes = 64 * 1024): Promise<string | null> {
  const text = await req.text();
  return new TextEncoder().encode(text).length > maxBytes ? null : text;
}

export function parseJson<T>(text: string): T | null {
  try {
    const v = JSON.parse(text);
    return v && typeof v === 'object' ? (v as T) : null;
  } catch {
    return null;
  }
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
