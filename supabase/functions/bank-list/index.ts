// Edge Function bank-list. Logic lives in ../_shared/handlers.ts (handleList).
import { serve } from '../_shared/deno/deps.ts';
import { handleList } from '../_shared/handlers.ts';

serve(handleList);
