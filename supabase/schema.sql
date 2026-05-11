-- Vanguard Trace baseline schema for Supabase/PostgreSQL
-- Run this in Supabase SQL Editor after project creation.

create extension if not exists "pgcrypto";

create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,
  status text not null,
  location text not null,
  eta text,
  customer_id uuid references public.customers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  title text not null,
  details text not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  name text,
  email text,
  subject text,
  message text not null,
  channel text not null default 'support',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  path text not null,
  bucket text not null default 'documents',
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_reports (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  report_id uuid references public.reports(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique(customer_id, report_id)
);

alter table public.customers enable row level security;
alter table public.shipments enable row level security;
alter table public.reports enable row level security;
alter table public.messages enable row level security;
alter table public.uploads enable row level security;
alter table public.saved_reports enable row level security;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_customers_updated_at on public.customers;
create trigger touch_customers_updated_at
before update on public.customers
for each row
execute function public.touch_updated_at();

drop trigger if exists touch_shipments_updated_at on public.shipments;
create trigger touch_shipments_updated_at
before update on public.shipments
for each row
execute function public.touch_updated_at();

drop trigger if exists touch_reports_updated_at on public.reports;
create trigger touch_reports_updated_at
before update on public.reports
for each row
execute function public.touch_updated_at();

drop policy if exists "customer can read own profile" on public.customers;
create policy "customer can read own profile"
  on public.customers for select
  using (auth.uid() = id);

drop policy if exists "customer can update own profile" on public.customers;
create policy "customer can update own profile"
  on public.customers for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "authenticated can read shipments" on public.shipments;
create policy "authenticated can read shipments"
  on public.shipments for select
  using (auth.role() = 'authenticated');

drop policy if exists "authenticated can read reports" on public.reports;
create policy "authenticated can read reports"
  on public.reports for select
  using (auth.role() = 'authenticated' and customer_id = auth.uid());

drop policy if exists "authenticated can create reports" on public.reports;
create policy "authenticated can create reports"
  on public.reports for insert
  with check (auth.role() = 'authenticated' and customer_id = auth.uid());

drop policy if exists "authenticated can read messages" on public.messages;
create policy "authenticated can read messages"
  on public.messages for select
  using (auth.role() = 'authenticated' and customer_id = auth.uid());

drop policy if exists "public can submit contact messages" on public.messages;
create policy "public can submit contact messages"
  on public.messages for insert
  with check (
    (channel = 'contact_form' and customer_id is null)
    or (auth.role() = 'authenticated' and customer_id = auth.uid())
  );

drop policy if exists "authenticated can read own uploads" on public.uploads;
create policy "authenticated can read own uploads"
  on public.uploads for select
  using (auth.uid() = customer_id);

drop policy if exists "authenticated can create own uploads" on public.uploads;
create policy "authenticated can create own uploads"
  on public.uploads for insert
  with check (auth.uid() = customer_id);

drop policy if exists "authenticated can read saved reports" on public.saved_reports;
create policy "authenticated can read saved reports"
  on public.saved_reports for select
  using (auth.uid() = customer_id);

drop policy if exists "authenticated can create saved reports" on public.saved_reports;
create policy "authenticated can create saved reports"
  on public.saved_reports for insert
  with check (auth.uid() = customer_id);

create index if not exists shipments_tracking_code_idx
  on public.shipments(tracking_code);

create index if not exists shipments_status_idx
  on public.shipments(status);

create index if not exists reports_status_idx
  on public.reports(status);

create index if not exists messages_channel_idx
  on public.messages(channel);

insert into public.shipments (tracking_code, status, location, eta)
values
  ('VGX-44591', 'VERIFIED', 'ROTTERDAM PORT', '3 DAYS'),
  ('VGX-20391', 'VERIFIED', 'ROTTERDAM', '2 DAYS'),
  ('VGX-44291', 'IN TRANSIT', 'NORTH SEA CORRIDOR', '4 DAYS')
on conflict (tracking_code) do update
set
  status = excluded.status,
  location = excluded.location,
  eta = excluded.eta,
  updated_at = now();
