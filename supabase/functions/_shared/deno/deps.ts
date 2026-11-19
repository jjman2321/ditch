// Builds the Deps every function uses, from Edge Function secrets (Deno.env). Deno only.
// Secret NAMES are listed in supabase/functions/.env.example; values live in
// Supabase -> Project settings -> Edge Functions -> Secrets (never in the repo or chat).

import { verifyAppleJws } from '../appleJws.ts';
import { importTokenKey } from '../crypto.ts';
import type { Deps } from '../handlers.ts';
import { PlaidProvider, type PlaidJwk } from '../plaid.ts';
import { verifyPlaidWebhook } from '../plaidWebhook.ts';
import type { BankProvider } from '../provider.ts';
import { StripeFcProvider } from '../stripe.ts';
import type { EntitlementKind, ProviderName } from '../types.ts';
import { SupabaseStore } from './supabaseStore.ts';

const env = (k: string) => Deno.env.get(k)?.trim() || undefined;
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

// Plaid's webhook keys rarely change: keep each for a day, then fetch again (to see expired_at).
const KEY_TTL_MS = 24 * 60 * 60 * 1000;
const plaidKeys = new Map<string, { key: PlaidJwk; at: number }>();

let cached: Promise<Deps> | null = null;

export function makeDeps(): Promise<Deps> {
  cached ??= (async () => {
    const plaidEnv = (env('PLAID_ENV') ?? 'sandbox') === 'production' ? 'production' : 'sandbox';
    let plaid: PlaidProvider | null = null;
    const getPlaid = () =>
      (plaid ??= new PlaidProvider({
        clientId: need('PLAID_CLIENT_ID'),
        secret: need('PLAID_SECRET'),
        env: plaidEnv,
        webhookUrl: need('PLAID_WEBHOOK_URL'),
        redirectUri: env('PLAID_REDIRECT_URI'),
        countryCodes: (env('PLAID_COUNTRY_CODES') ?? 'US,CA').split(',').map((s) => s.trim()),
      }));
    let stripe: StripeFcProvider | null = null;
    const getStripe = () => (stripe ??= new StripeFcProvider(need('STRIPE_SECRET_KEY')));

    return {
      store: SupabaseStore.fromEnv(need('SUPABASE_URL'), serviceKey()),
      provider: (name: ProviderName): BankProvider => (name === 'stripe' ? getStripe() : getPlaid()),
      defaultProvider: env('BANK_PROVIDER') === 'stripe' ? 'stripe' : 'plaid',
      tokenKey: await importTokenKey(env('TOKEN_ENC_KEY')),
      now: () => new Date(),
      apple: {
        verify: <T>(jws: string) => verifyAppleJws<T>(jws),
        bundleId: need('APPLE_BUNDLE_ID'),
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
