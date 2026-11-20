-- Plaid ITEM / NEW_ACCOUNTS_AVAILABLE: the bank has an account the person hasn't shared with Ditch yet.
-- The phone shows "New account at <bank>" and opens update mode with Account Select; a good sync after
-- that (bank-sync with repaired = this link) clears it.
alter table public.bank_links add column new_accounts boolean not null default false;
