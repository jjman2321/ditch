-- Hourly reconciliation (cost rules 4-6): calls the bank-cleanup function, which removes any
-- connection whose owner isn't entitled anymore, is stuck needing a re-login for 30+ days, or is
-- over the 3-bank cap, and retries failed removals. Hourly also covers "remove within the hour".
--
-- Before this works, store two Vault secrets once (SQL editor, values never in the repo):
--   select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
--   select vault.create_secret('<same value as the CRON_SECRET function secret>', 'cron_secret');

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'bank-cleanup-hourly',
  '7 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/bank-cleanup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
  $$
);

-- The audit log keeps 180 days.
select cron.schedule('events-prune-daily', '23 3 * * *', $$ delete from public.events where at < now() - interval '180 days' $$);
