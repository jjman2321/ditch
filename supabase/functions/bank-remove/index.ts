// Edge Function bank-remove. Logic lives in ../_shared/handlers.ts (handleRemove).
import { serve } from '../_shared/deno/deps.ts';
import { handleRemove } from '../_shared/handlers.ts';

serve(handleRemove);
