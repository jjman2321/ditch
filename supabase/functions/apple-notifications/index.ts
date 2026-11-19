// Edge Function apple-notifications. Logic lives in ../_shared/handlers.ts (handleAppleNotification).
import { serve } from '../_shared/deno/deps.ts';
import { handleAppleNotification } from '../_shared/handlers.ts';

serve(handleAppleNotification);
