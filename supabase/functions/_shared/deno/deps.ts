// Builds the Deps every function uses, from Edge Function secrets (Deno.env). Deno only.
// Secret NAMES are listed in supabase/functions/.env.example; values live in
// Supabase -> Project settings -> Edge Functions -> Secrets (never in the repo or chat).
// Fallback (Nov 20): any of VAULT_NAMES missing from Deno.env is read from Supabase Vault (lowercase name)
// through the service-role-only RPC public.app_secrets. TOKEN_ENC_KEY and CRON_SECRET were generated
// inside Vault so no person ever saw them; the Plaid keys can go in either place.

import { verifyAppleJws } from '../appleJws.ts';
import { importTokenKey } from '../crypto.ts';
import type { Deps } from '../handlers.ts';
import { PlaidProvider, type PlaidJwk } from '../plaid.ts';
import { revenueCatClient } from '../revenuecat.ts';
import { verifyPlaidWebhook } from '../plaidWebhook.ts';
import type { BankProvider } from '../provider.ts';
import { StripeFcProvider } from '../stripe.ts';
import type { EntitlementKind, ProviderName } from '../types.ts';
import { SupabaseStore } from './supabaseStore.ts';

const fromVault: Record<string, string> = {};
const env = (k: string) => Deno.env.get(k)?.trim() || fromVault[k] || undefined;
const need = (k: string) => {
  const v = env(k);
  if (!v) throw new Error(`missing secret ${k}`);
  return v;
};

function serviceKey(): string {
  // New-style keys come as JSON in SUPABASE_SECRET_KEYS; the legacy service_role key is the fallback.
  const raw = env('SUPABASE_SECRET_KEYS');
  if (raw) {
    try {
      const keys = JSON.parse(raw) as Record<string, string>;
      if (keys.default) return keys.default;
    } catch {
      // fall through
    }
  }
  return need('SUPABASE_SERVICE_ROLE_KEY');
}

function products(): Record<string, EntitlementKind> {
  const map: Record<string, EntitlementKind> = {};
  const add = (k: string, kind: EntitlementKind) => {
    for (const id of (env(k) ?? '').split(',').map((s) => s.trim()).filter(Boolean)) map[id] = kind;
  };
  add('APPLE_PRODUCT_YEARLY', 'yearly');
  add('APPLE_PRODUCT_WEEKLY', 'weekly');
  add('APPLE_PRODUCT_LIFETIME', 'lifetime');
  add('APPLE_PRODUCT_BANK_ADDON', 'bank_addon');
  return map;
}

/**
 * RevenueCat product ids (prod…) → kind. Defaults are Ditch's project (set up Nov 20); REVENUECAT_PRODUCTS
 * ("prodA:yearly,prodB:weekly,…") overrides them, e.g. when the bank add-on product is added.
 */
function rcProducts(): Record<string, EntitlementKind> {
  const map: Record<string, EntitlementKind> = { prodc88d66725a: 'yearly', prod12517f8454: 'weekly', prodc2043a8435: 'lifetime' };
  for (const pair of (env('REVENUECAT_PRODUCTS') ?? '').split(',')) {
    const [id, kind] = pair.split(':').map((x) => x?.trim());
    if (id && (kind === 'yearly' || kind === 'weekly' || kind === 'lifetime' || kind === 'bank_addon')) map[id] = kind;
  }
  return map;
}

// Plaid's webhook keys rarely change: keep each for a day, then fetch again (to see expired_at).
const KEY_TTL_MS = 24 * 60 * 60 * 1000;
const plaidKeys = new Map<string, { key: PlaidJwk; at: number }>();

const VAULT_NAMES = ['PLAID_CLIENT_ID', 'PLAID_SECRET', 'PLAID_SECRET_SANDBOX', 'PLAID_SECRET_PRODUCTION', 'TOKEN_ENC_KEY', 'CRON_SECRET'];

async function loadVault(url: string, key: string) {
  const missing = VAULT_NAMES.filter((k) => !Deno.env.get(k)?.trim());
  if (!missing.length) return;
  const res = await fetch(`${url}/rest/v1/rpc/app_secrets`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ names: missing.map((k) => k.toLowerCase()) }),
  });
  if (!res.ok) throw new Error(`vault read failed ${res.status}`);
  const got = (await res.json()) as Record<string, string>;
  for (const k of missing) {
    const v = got[k.toLowerCase()]?.trim();
    if (v) fromVault[k] = v;
  }
}

let cached: Promise<Deps> | null = null;

export function makeDeps(): Promise<Deps> {
  cached ??= (async () => {
    const supabaseUrl = need('SUPABASE_URL');
    await loadVault(supabaseUrl, serviceKey());
    const plaidEnv = (env('PLAID_ENV') ?? 'sandbox') === 'production' ? 'production' : 'sandbox';
    let plaid: PlaidProvider | null = null;
    const getPlaid = () =>
      (plaid ??= new PlaidProvider({
        clientId: need('PLAID_CLIENT_ID'),
        // Both secrets can be saved; PLAID_ENV (default sandbox) picks which one is used. Going live = PLAID_ENV=production.
        secret: env(plaidEnv === 'production' ? 'PLAID_SECRET_PRODUCTION' : 'PLAID_SECRET_SANDBOX') ?? need('PLAID_SECRET'),
        env: plaidEnv,
        webhookUrl: env('PLAID_WEBHOOK_URL') ?? `${supabaseUrl}/functions/v1/api/plaid-webhook`,
        redirectUri: env('PLAID_REDIRECT_URI') ?? 'https://ditchsubs.app/plaid/oauth',
        countryCodes: (env('PLAID_COUNTRY_CODES') ?? 'US,CA').split(',').map((s) => s.trim()),
      }));
    let stripe: StripeFcProvider | null = null;
    const getStripe = () => (stripe ??= new StripeFcProvider(need('STRIPE_SECRET_KEY')));

    return {
      store: SupabaseStore.fromEnv(supabaseUrl, serviceKey()),
      provider: (name: ProviderName): BankProvider => (name === 'stripe' ? getStripe() : getPlaid()),
      defaultProvider: env('BANK_PROVIDER') === 'stripe' ? 'stripe' : 'plaid',
      tokenKey: await importTokenKey(env('TOKEN_ENC_KEY')),
      now: () => new Date(),
      apple: {
        verify: <T>(jws: string) => verifyAppleJws<T>(jws),
        bundleId: env('APPLE_BUNDLE_ID') ?? 'app.ditchsubs.ditch',
        environments: (env('APPLE_ENVIRONMENTS') ?? 'Production,Sandbox').split(',').map((s) => s.trim()),
        products: products(),
      },
      plaidWebhook: {
        env: plaidEnv,
        verify: (raw, header) =>
          verifyPlaidWebhook(
            raw,
            header,
            async (kid) => {
              const hit = plaidKeys.get(kid);
              if (hit && Date.now() - hit.at < KEY_TTL_MS) return hit.key;
              const key = await getPlaid().webhookKey(kid);
              plaidKeys.set(kid, { key, at: Date.now() });
              return key;
            },
            new Date(),
          ),
      },
      cronSecret: env('CRON_SECRET') ?? '',
      // The bank directory comes from production when its secret is saved (the real, complete list; free,
      // connects nothing), else from whatever PLAID_ENV uses.
      institutions: (q) =>
        (env('PLAID_SECRET_PRODUCTION')
          ? new PlaidProvider({
              clientId: need('PLAID_CLIENT_ID'),
              secret: need('PLAID_SECRET_PRODUCTION'),
              env: 'production',
              webhookUrl: `${supabaseUrl}/functions/v1/api/plaid-webhook`,
            })
          : getPlaid()
        ).institutions(q),
      revenuecat: env('REVENUECAT_SECRET_KEY')
        ? revenueCatClient({
            key: env('REVENUECAT_SECRET_KEY')!,
            projectId: env('REVENUECAT_PROJECT_ID') ?? 'proj39b23ed3',
            config: { products: rcProducts(), entitlement: 'pro', environments: (env('APPLE_ENVIRONMENTS') ?? 'Production,Sandbox').split(',').map((s) => s.trim()) },
            now: () => new Date(),
          })
        : undefined,
      plaidProduction: () =>
        new PlaidProvider({
          clientId: need('PLAID_CLIENT_ID'),
          secret: need('PLAID_SECRET_PRODUCTION'),
          env: 'production',
          webhookUrl: env('PLAID_WEBHOOK_URL') ?? `${supabaseUrl}/functions/v1/api/plaid-webhook`,
          redirectUri: env('PLAID_REDIRECT_URI') ?? 'https://ditchsubs.app/plaid/oauth',
          countryCodes: (env('PLAID_COUNTRY_CODES') ?? 'US,CA').split(',').map((s) => s.trim()),
        }),
    } satisfies Deps;
  })();
  cached.catch(() => (cached = null));
  return cached;
}

/** Wraps a handler: builds deps, and turns a crash into a bare 500 (no details, no secrets). */
export function serve(handler: (req: Request, deps: Deps) => Promise<Response>) {
  Deno.serve(async (req) => {
    try {
      return await handler(req, await makeDeps());
    } catch (e) {
      console.error('function error', (e as Error).name, (e as Error).message?.slice(0, 200));
      return new Response(JSON.stringify({ error: 'internal' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  });
}
