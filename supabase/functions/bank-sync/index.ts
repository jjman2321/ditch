// Edge Function bank-sync. Logic lives in ../_shared/handlers.ts (handleSync).
import { serve } from '../_shared/deno/deps.ts';
import { handleSync } from '../_shared/handlers.ts';

serve(handleSync);
