-- Supabase security advisor (Nov 20): pin search_path on trigger functions so a role can't
-- shadow public.* with its own objects. Both functions already use schema-qualified names.
alter function public.bank_links_cap() set search_path = '';
alter function public.touch_updated_at() set search_path = '';
