// One Edge Function, "api", that serves every route: /functions/v1/api/<route>.
// Same handlers as the one-per-route functions next to it (../_shared/handlers.ts); one deploy instead of nine.
// The app's EXPO_PUBLIC_API_URL is https://<ref>.supabase.co/functions/v1/api, so `${API_URL}/bank-sync` lands here.
import { timingSafeEqual } from '../_shared/bytes.ts';
import { serve } from '../_shared/deno/deps.ts';
import * as h from '../_shared/handlers.ts';
import type { PlaidProvider } from '../_shared/plaid.ts';

// Plaid Sandbox self-test (/accounts/get on a test bank). Same cron secret as the cleanup, so only our
// database (pg_net) can run it; answers with counts only.
const sandboxSelfTest: (typeof routes)[string] = async (req, deps) => {
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!deps.cronSecret || !timingSafeEqual(req.headers.get('x-cron-secret') ?? '', deps.cronSecret)) return json(401, { error: 'unauthorized' });
  try {
    return json(200, { ok: true, ...(await (deps.provider('plaid') as PlaidProvider).sandboxSelfTest()) });
  } catch (e) {
    return json(502, { ok: false, code: (e as { code?: string }).code ?? 'INTERNAL' });
  }
};

const routes: Record<string, (req: Request, deps: Parameters<typeof h.handleSync>[1]) => Promise<Response>> = {
  'bank-link-token': h.handleLinkToken,
  'bank-exchange': h.handleExchange,
  'bank-sync': h.handleSync,
  'bank-remove': h.handleRemove,
  'bank-list': h.handleList,
  'plaid-webhook': h.handlePlaidWebhook,
  'apple-notifications': h.handleAppleNotification,
  'entitlement-sync': h.handleEntitlementSync,
  'bank-cleanup': h.handleCleanup,
  'sandbox-selftest': (req, deps) => sandboxSelfTest(req, deps),
};

serve(async (req, deps) => {
  const route = new URL(req.url).pathname.split('/').filter(Boolean).pop() ?? '';
  const handler = routes[route];
  if (!handler) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  return handler(req, deps);
});
