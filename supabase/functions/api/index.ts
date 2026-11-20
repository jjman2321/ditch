// One Edge Function, "api", that serves every route: /functions/v1/api/<route>.
// Same handlers as the one-per-route functions next to it (../_shared/handlers.ts); one deploy instead of nine.
// The app's EXPO_PUBLIC_API_URL is https://<ref>.supabase.co/functions/v1/api, so `${API_URL}/bank-sync` lands here.
import { serve } from '../_shared/deno/deps.ts';
import * as h from '../_shared/handlers.ts';

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
};

serve(async (req, deps) => {
  const route = new URL(req.url).pathname.split('/').filter(Boolean).pop() ?? '';
  const handler = routes[route];
  if (!handler) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  return handler(req, deps);
});
