// Edge Function bank-link-token. Logic lives in ../_shared/handlers.ts (handleLinkToken).
import { serve } from '../_shared/deno/deps.ts';
import { handleLinkToken } from '../_shared/handlers.ts';

serve(handleLinkToken);
