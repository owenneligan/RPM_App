create table public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null,
  company_name text,
  revenue_band text,
  biggest_bottleneck text,
  source_section text,          -- 'hero' | 'diagnostic' | 'cta'
  created_at timestamptz not null default now()
);
create unique index leads_email_unique on public.leads (lower(email));
alter table public.leads enable row level security;
-- no policies: service-role access only
