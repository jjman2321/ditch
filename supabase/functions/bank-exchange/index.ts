// Edge Function bank-exchange. Logic lives in ../_shared/handlers.ts (handleExchange).
import { serve } from '../_shared/deno/deps.ts';
import { handleExchange } from '../_shared/handlers.ts';

serve(handleExchange);
