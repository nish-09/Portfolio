-- Run if you already applied the original schema with required user_id + auth policies

alter table public.enquiries alter column user_id drop not null;

drop policy if exists "Authenticated users can insert own enquiries" on public.enquiries;
drop policy if exists "Users can read own enquiries" on public.enquiries;
