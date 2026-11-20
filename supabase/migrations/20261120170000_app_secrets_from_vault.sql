-- Server functions read a few secrets from Vault when they aren't set as Edge Function secrets
-- (Nov 20: Supabase's secret form was paused). Only the service role can call this, and only for these
-- four names. token_enc_key and cron_secret were generated inside Vault with gen_random_bytes (nobody
-- saw them); cron already reads cron_secret from Vault.
create or replace function public.app_secrets(names text[])
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select coalesce(jsonb_object_agg(s.name, s.decrypted_secret), '{}'::jsonb)
  from vault.decrypted_secrets s
  where s.name = any(names)
    and s.name in ('plaid_client_id', 'plaid_secret', 'token_enc_key', 'cron_secret');
$$;
revoke all on function public.app_secrets(text[]) from public, anon, authenticated;
grant execute on function public.app_secrets(text[]) to service_role;
