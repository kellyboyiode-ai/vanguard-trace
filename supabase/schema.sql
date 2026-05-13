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

create table if not exists public.operations_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  event_type text not null,
  title text not null,
  details text,
  severity text not null default 'medium',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.intel_alerts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  corridor text not null,
  risk_score integer not null default 0,
  headline text not null,
  advisory text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trace_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  route_name text not null,
  metric_name text not null,
  metric_value numeric(12, 2) not null,
  unit text not null default 'ms',
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.customer_settings (
  customer_id uuid primary key references public.customers(id) on delete cascade,
  alert_threshold_ms integer not null default 2500,
  weekly_digest_enabled boolean not null default true,
  report_retention_days integer not null default 30,
  preferred_corridor text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.account_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.account_onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  phone text,
  kyc_reference text,
  kyc_verified boolean not null default false,
  contact_confirmed boolean not null default false,
  admin_approved boolean not null default false,
  admin_note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  quote_type text not null,
  origin text not null,
  destination text not null,
  target_date date not null,
  contact_name text not null,
  city text not null,
  email text not null,
  phone text not null,
  company text,
  commodity text not null,
  incoterm text not null,
  notes text,
  terms_accepted boolean not null default false,
  captcha_provider text not null default 'manual_checkbox',
  captcha_token text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers enable row level security;
alter table public.shipments enable row level security;
alter table public.reports enable row level security;
alter table public.messages enable row level security;
alter table public.uploads enable row level security;
alter table public.saved_reports enable row level security;
alter table public.operations_events enable row level security;
alter table public.intel_alerts enable row level security;
alter table public.trace_events enable row level security;
alter table public.customer_settings enable row level security;
alter table public.quote_requests enable row level security;
alter table public.account_admins enable row level security;
alter table public.account_onboarding enable row level security;

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

drop trigger if exists touch_operations_events_updated_at on public.operations_events;
create trigger touch_operations_events_updated_at
before update on public.operations_events
for each row
execute function public.touch_updated_at();

drop trigger if exists touch_intel_alerts_updated_at on public.intel_alerts;
create trigger touch_intel_alerts_updated_at
before update on public.intel_alerts
for each row
execute function public.touch_updated_at();

drop trigger if exists touch_customer_settings_updated_at on public.customer_settings;
create trigger touch_customer_settings_updated_at
before update on public.customer_settings
for each row
execute function public.touch_updated_at();

drop trigger if exists touch_quote_requests_updated_at on public.quote_requests;
create trigger touch_quote_requests_updated_at
before update on public.quote_requests
for each row
execute function public.touch_updated_at();

drop trigger if exists touch_account_onboarding_updated_at on public.account_onboarding;
create trigger touch_account_onboarding_updated_at
before update on public.account_onboarding
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

drop policy if exists "authenticated can read operations events" on public.operations_events;
create policy "authenticated can read operations events"
  on public.operations_events for select
  using (auth.uid() = customer_id);

drop policy if exists "authenticated can create operations events" on public.operations_events;
create policy "authenticated can create operations events"
  on public.operations_events for insert
  with check (auth.uid() = customer_id);

drop policy if exists "authenticated can update operations events" on public.operations_events;
create policy "authenticated can update operations events"
  on public.operations_events for update
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

drop policy if exists "authenticated can read intel alerts" on public.intel_alerts;
create policy "authenticated can read intel alerts"
  on public.intel_alerts for select
  using (auth.uid() = customer_id);

drop policy if exists "authenticated can create intel alerts" on public.intel_alerts;
create policy "authenticated can create intel alerts"
  on public.intel_alerts for insert
  with check (auth.uid() = customer_id);

drop policy if exists "authenticated can update intel alerts" on public.intel_alerts;
create policy "authenticated can update intel alerts"
  on public.intel_alerts for update
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

drop policy if exists "authenticated can read trace events" on public.trace_events;
create policy "authenticated can read trace events"
  on public.trace_events for select
  using (auth.uid() = customer_id);

drop policy if exists "authenticated can create trace events" on public.trace_events;
create policy "authenticated can create trace events"
  on public.trace_events for insert
  with check (auth.uid() = customer_id);

drop policy if exists "authenticated can read customer settings" on public.customer_settings;
create policy "authenticated can read customer settings"
  on public.customer_settings for select
  using (auth.uid() = customer_id);

drop policy if exists "authenticated can create customer settings" on public.customer_settings;
create policy "authenticated can create customer settings"
  on public.customer_settings for insert
  with check (auth.uid() = customer_id);

drop policy if exists "authenticated can update customer settings" on public.customer_settings;
create policy "authenticated can update customer settings"
  on public.customer_settings for update
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

drop policy if exists "public can submit quote requests" on public.quote_requests;
create policy "public can submit quote requests"
  on public.quote_requests for insert
  with check (
    (customer_id is null and terms_accepted = true)
    or (auth.role() = 'authenticated' and customer_id = auth.uid() and terms_accepted = true)
  );

drop policy if exists "authenticated can read own quote requests" on public.quote_requests;
create policy "authenticated can read own quote requests"
  on public.quote_requests for select
  using (auth.uid() = customer_id);

drop policy if exists "user can read own admin marker" on public.account_admins;
create policy "user can read own admin marker"
  on public.account_admins for select
  using (auth.uid() = user_id);

drop policy if exists "user can read own onboarding" on public.account_onboarding;
create policy "user can read own onboarding"
  on public.account_onboarding for select
  using (auth.uid() = user_id);

drop policy if exists "user can create own onboarding" on public.account_onboarding;
create policy "user can create own onboarding"
  on public.account_onboarding for insert
  with check (
    auth.uid() = user_id
    and admin_approved = false
    and status = 'pending'
  );

drop policy if exists "admin can read all onboarding" on public.account_onboarding;
create policy "admin can read all onboarding"
  on public.account_onboarding for select
  using (
    exists (
      select 1
      from public.account_admins admins
      where admins.user_id = auth.uid()
    )
  );

drop policy if exists "admin can update onboarding" on public.account_onboarding;
create policy "admin can update onboarding"
  on public.account_onboarding for update
  using (
    exists (
      select 1
      from public.account_admins admins
      where admins.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.account_admins admins
      where admins.user_id = auth.uid()
    )
  );

create index if not exists shipments_tracking_code_idx
  on public.shipments(tracking_code);

create index if not exists shipments_status_idx
  on public.shipments(status);

create index if not exists reports_status_idx
  on public.reports(status);

create index if not exists messages_channel_idx
  on public.messages(channel);

create index if not exists operations_events_customer_status_idx
  on public.operations_events(customer_id, status);

create index if not exists intel_alerts_customer_status_idx
  on public.intel_alerts(customer_id, status);

create index if not exists trace_events_customer_recorded_at_idx
  on public.trace_events(customer_id, recorded_at desc);

create index if not exists quote_requests_created_at_idx
  on public.quote_requests(created_at desc);

create index if not exists quote_requests_email_idx
  on public.quote_requests(email);

create index if not exists account_onboarding_status_idx
  on public.account_onboarding(status);

create index if not exists account_onboarding_admin_approved_idx
  on public.account_onboarding(admin_approved);

-- Add exactly one row with your own auth user ID to make yourself the only admin approver.
-- Example:
-- insert into public.account_admins (user_id)
-- values ('00000000-0000-0000-0000-000000000000')
-- on conflict (user_id) do nothing;

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
