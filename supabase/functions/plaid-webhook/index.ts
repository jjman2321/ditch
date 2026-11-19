// Edge Function plaid-webhook. Logic lives in ../_shared/handlers.ts (handlePlaidWebhook).
import { serve } from '../_shared/deno/deps.ts';
import { handlePlaidWebhook } from '../_shared/handlers.ts';

serve(handlePlaidWebhook);
