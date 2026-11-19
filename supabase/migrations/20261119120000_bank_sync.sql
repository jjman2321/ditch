-- Always-on bank sync (DECISIONS #67). Server-side state only:
--   app_users     a random id made on the phone + a hash of its install secret (no names, no emails)
--   entitlements  what Apple says the user paid for (one row per original transaction)
--   bank_links    one row per bank connection: encrypted access token + the /transactions/sync cursor
--   events        an audit log of small facts (codes, reasons). Never tokens, never transactions.
-- Transactions are NEVER stored: the functions pass them straight to the phone.
-- RLS is on with no policies, and anon/authenticated have no grants: only the service role
-- (the Edge Functions) can read or write.

create table public.app_users (
  id          uuid primary key,
  secret_hash text not null,
  created_at  timestamptz not null default now()
);

create table public.entitlements (
  original_transaction_id text primary key,
  app_user_id    uuid not null references public.app_users(id) on delete cascade,
  kind           text not null check (kind in ('yearly', 'weekly', 'lifetime', 'bank_addon')),
  product_id     text not null,
  status         text not null check (status in ('trial', 'trial_cancelled', 'active', 'grace', 'billing_retry', 'expired', 'revoked')),
  expires_at     timestamptz,
  purchased_at   timestamptz,
  in_trial       boolean not null default false,
  auto_renew     boolean,
  grace_until    timestamptz,
  family_shared  boolean not null default false,
  environment    text not null,
  signed_at      timestamptz not null,
  updated_at     timestamptz not null default now()
);
create index entitlements_user_idx on public.entitlements (app_user_id);

create table public.bank_links (
  id                  uuid primary key default gen_random_uuid(),
  -- restrict: a user row can't vanish while a billable connection still exists
  app_user_id         uuid not null references public.app_users(id) on delete restrict,
  provider            text not null check (provider in ('plaid', 'stripe')),
  item_id             text not null,
  access_token_enc    text,            -- AES-256-GCM ("v1:iv:ciphertext"), key in TOKEN_ENC_KEY. Wiped on removal.
  cursor              text,            -- last /transactions/sync cursor the phone confirmed
  pending_cursor      text,            -- cursor handed to the phone, waiting for its ack
  status              text not null default 'active' check (status in ('active', 'needs_relogin', 'expiring', 'error', 'removing', 'removed')),
  institution_id      text,
  institution_name    text,
  needs_relogin_since timestamptz,     -- removed after 30 days stuck (Plaid still bills broken Items)
  updates_available   boolean not null default false,
  last_error          text,            -- provider error CODE only
  remove_attempts     int not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  removed_at          timestamptz,
  unique (provider, item_id)
);
create index bank_links_user_live_idx on public.bank_links (app_user_id) where status <> 'removed';
create index bank_links_live_idx on public.bank_links (status) where status <> 'removed';

-- Cost rule 1 as a hard stop: at most 3 working connections per user.
create function public.bank_links_cap() returns trigger language plpgsql as $$
begin
  if (select count(*) from public.bank_links
      where app_user_id = new.app_user_id and status not in ('removed', 'removing') and id <> new.id) >= 3 then
    raise exception 'bank_limit' using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger bank_links_cap before insert on public.bank_links for each row execute function public.bank_links_cap();

create function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger bank_links_touch before update on public.bank_links for each row execute function public.touch_updated_at();

create table public.events (
  id          bigint generated always as identity primary key,
  at          timestamptz not null default now(),
  kind        text not null,
  app_user_id uuid,
  link_id     uuid,
  detail      jsonb not null default '{}'::jsonb,
  dedupe_key  text unique
);
create index events_user_kind_at_idx on public.events (app_user_id, kind, at);

alter table public.app_users    enable row level security;
alter table public.entitlements enable row level security;
alter table public.bank_links   enable row level security;
alter table public.events       enable row level security;

revoke all on public.app_users, public.entitlements, public.bank_links, public.events from anon, authenticated;
revoke all on function public.bank_links_cap(), public.touch_updated_at() from anon, authenticated, public;
