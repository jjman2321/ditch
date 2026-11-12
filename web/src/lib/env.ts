import { getCloudflareContext } from '@opennextjs/cloudflare';

// Minimal shapes of the bindings we use, so we don't need the full Workers type package.
export interface D1Like {
  prepare(sql: string): { bind(...v: unknown[]): { run(): Promise<unknown>; first<T = Record<string, unknown>>(): Promise<T | null> } };
}
export type Env = { DB?: D1Like; RESEND_API_KEY?: string; RESEND_AUDIENCE_ID?: string; EMAIL_FROM?: string };

/** Cloudflare bindings and secrets. Secrets live in Cloudflare (wrangler secret put), never in the repo. */
export async function env(): Promise<Env> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as unknown as Env;
  } catch {
    return {};
  }
}
