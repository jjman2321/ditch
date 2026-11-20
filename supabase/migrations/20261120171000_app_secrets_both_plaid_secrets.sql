-- Both Plaid secrets can be kept; PLAID_ENV picks one (owner, Nov 20: "why not add both?").
create or replace function public.app_secrets(names text[])
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select coalesce(jsonb_object_agg(s.name, s.decrypted_secret), '{}'::jsonb)
  from vault.decrypted_secrets s
  where s.name = any(names)
    and s.name in ('plaid_client_id', 'plaid_secret', 'plaid_secret_sandbox', 'plaid_secret_production', 'token_enc_key', 'cron_secret');
$$;
revoke all on function public.app_secrets(text[]) from public, anon, authenticated;
grant execute on function public.app_secrets(text[]) to service_role;
