-- ============================================================================
-- Supabase Schema for Mo'een Digital Platform — Dashboard Stats
-- Run this migration in your Supabase SQL Editor.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── 1. NGOs ──────────────────────────────────────────────────────────────────
create table if not exists public.ngos (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  responsible_person text,
  phone         text,
  email         text,
  donation_url  text,
  city          text,
  category      text check (category in ('خيرية','تعليمية','صحية','بيئية','اجتماعية','أخرى')),
  status        text not null default 'active' check (status in ('active','archived')),
  logo_url      text,
  notes         text,
  created_date  timestamptz not null default now(),
  updated_date  timestamptz not null default now()
);

-- ── 2. Beneficiaries ────────────────────────────────────────────────────────
create table if not exists public.beneficiaries (
  id                      uuid primary key default gen_random_uuid(),
  full_name               text not null,
  national_id             text,
  birth_year              integer,
  age                     integer,
  gender                  text check (gender in ('ذكر','أنثى')),
  phone                   text,
  phone_alt               text,
  city                    text,
  district                text,
  national_address        text,
  social_status           text check (social_status in ('أعزب','متزوج','مطلق','أرمل','مهجور')),
  education_level         text,
  health_status           text check (health_status in ('سليم','معاق','مريض')),
  disability              boolean,
  disability_type         text,
  sickness_type           text,
  dependents_count        integer,
  income_salary           numeric,
  income_social_security  numeric,
  income_account_citizen  numeric,
  income_rehab            numeric,
  income_other_ngos       numeric,
  income_other_sources    text,
  total_income            numeric,
  expense_rent            numeric,
  expense_electricity     numeric,
  expense_water           numeric,
  expense_internet        numeric,
  expense_medical         numeric,
  expense_transport       numeric,
  expense_food            numeric,
  expense_debt_installment numeric,
  debt_reason             text,
  debt_period             text,
  total_expenses          numeric,
  net_income              numeric,
  environment_type        text check (environment_type in ('هجرة','بادية','قرية','محافظة','مدينة')),
  housing_type            text check (housing_type in ('شعبي','شقة','فيلا','ملحق')),
  housing_tenure          text check (housing_tenure in ('إيجار','ملك','إرث','وقف')),
  income_level            text check (income_level in ('لا يوجد دخل','دخل منخفض','دخل متوسط')),
  case_type               text not null check (case_type in ('مادي','صحي','تعليمي','اجتماعي','متعدد')),
  priority                text not null default 'متوسط' check (priority in ('عاجل','مرتفع','متوسط','منخفض')),
  status                  text not null default 'active' check (status in ('active','archived','supported')),
  file_number             text,
  case_status             text default 'جديد' check (case_status in ('جديد','تحديث','خارجي')),
  ngo_id                  uuid references public.ngos(id),
  ngo_name                text,
  researcher_name         text,
  researcher_id           uuid references auth.users(id),
  notes                   text,
  visit_date              date,
  approved_by             text,
  created_date            timestamptz not null default now(),
  updated_date            timestamptz not null default now()
);

-- ── 3. Marketers ─────────────────────────────────────────────────────────────
create table if not exists public.marketers (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  phone           text,
  email           text,
  city            text,
  ngo_id          uuid references public.ngos(id),
  ngo_name        text,
  specialization  text check (specialization in ('تسويق رقمي','تسويق ميداني','علاقات عامة','إعلام اجتماعي','أخرى')),
  campaigns_count integer default 0,
  status          text not null default 'active' check (status in ('active','archived')),
  notes           text,
  created_date    timestamptz not null default now(),
  updated_date    timestamptz not null default now()
);

-- ── 4. App Users (linked to auth.users) ──────────────────────────────────────
create table if not exists public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text not null default 'user' check (role in ('platform_admin','pdo','ngo_manager','researcher','marketer','user')),
  ngo_id     uuid references public.ngos(id),
  city       text,
  phone      text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'user');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 5. Dashboard Cache ──────────────────────────────────────────────────────
create table if not exists public.dashboard_cache (
  id              uuid primary key default gen_random_uuid(),
  report_type     text not null default 'dashboard_stats',
  filters_hash    text not null,
  payload         jsonb not null,
  generated_at    timestamptz not null default now(),
  expires_at      timestamptz not null default (now() + interval '5 minutes'),
  generated_by_id uuid references auth.users(id),
  record_count    integer
);

create index if not exists idx_dashboard_cache_lookup
  on public.dashboard_cache (report_type, filters_hash, expires_at desc);

-- ── 6. get_top_ngos RPC ──────────────────────────────────────────────────────
create or replace function public.get_top_ngos(scope_ngo_id uuid default null)
returns table (id uuid, name text, city text, beneficiary_count bigint)
language plpgsql security definer
as $$
begin
  return query
  select n.id, n.name, n.city, count(b.id) as beneficiary_count
  from public.ngos n
  left join public.beneficiaries b on b.ngo_id = n.id
  where n.status = 'active'
    and (scope_ngo_id is null or n.id = scope_ngo_id)
  group by n.id, n.name, n.city
  order by beneficiary_count desc
  limit 5;
end;
$$;

-- ── 7. Materialized View — Pre-aggregated counts ────────────────────────────
create materialized view if not exists public.dashboard_counts_mv as
select
  count(*) filter (where status = 'active')                       as ngo_count,
  (select count(*) from public.users where role = 'researcher')  as researcher_count,
  (select count(*) from public.marketers where status = 'active') as marketer_count,
  now()                                                           as refreshed_at;

create unique index if not exists idx_dashboard_counts_mv
  on public.dashboard_counts_mv (refreshed_at);

create or replace function public.refresh_dashboard_counts()
returns void language plpgsql security definer
as $$
begin
  refresh materialized view concurrently public.dashboard_counts_mv;
end;
$$;

-- ── RLS Policies ────────────────────────────────────────────────────────────
alter table public.ngos enable row level security;
create policy "NGOs publicly readable" on public.ngos for select using (true);
create policy "Admins can insert NGOs" on public.ngos for insert with check (
  (select role from public.users where id = auth.uid()) = 'platform_admin'
);

alter table public.beneficiaries enable row level security;
create policy "Beneficiaries — admin & pdo read all" on public.beneficiaries for select using (
  (select role from public.users where id = auth.uid()) in ('platform_admin', 'pdo')
);
create policy "Beneficiaries — ngo_manager reads own ngo" on public.beneficiaries for select using (
  (select ngo_id from public.users where id = auth.uid()) = ngo_id
);
create policy "Beneficiaries — researcher reads own" on public.beneficiaries for select using (
  researcher_id = auth.uid()
);

alter table public.marketers enable row level security;
create policy "Marketers readable" on public.marketers for select using (
  (select role from public.users where id = auth.uid()) in ('platform_admin', 'ngo_manager', 'pdo')
);

alter table public.users enable row level security;
create policy "Users readable by authenticated" on public.users for select using (auth.role() = 'authenticated');

alter table public.dashboard_cache enable row level security;
create policy "Cache read all authenticated" on public.dashboard_cache for select using (auth.role() = 'authenticated');
create policy "Cache write all authenticated" on public.dashboard_cache for insert with check (auth.role() = 'authenticated');
create policy "Cache delete all authenticated" on public.dashboard_cache for delete using (auth.role() = 'authenticated');