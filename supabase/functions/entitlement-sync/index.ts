// Edge Function entitlement-sync. Logic lives in ../_shared/handlers.ts (handleEntitlementSync).
import { serve } from '../_shared/deno/deps.ts';
import { handleEntitlementSync } from '../_shared/handlers.ts';

serve(handleEntitlementSync);
