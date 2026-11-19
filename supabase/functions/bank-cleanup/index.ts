// Edge Function bank-cleanup. Logic lives in ../_shared/handlers.ts (handleCleanup).
import { serve } from '../_shared/deno/deps.ts';
import { handleCleanup } from '../_shared/handlers.ts';

serve(handleCleanup);
