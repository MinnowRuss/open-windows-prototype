-- Open Windows Member App — Supabase PostgreSQL Schema
-- Version: 1.0 | Date: 2026-02-27
-- Apply via Supabase SQL Editor or migrations

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS (managed by Supabase Auth, extended here)
-- ============================================================
-- Note: Supabase Auth manages the auth.users table.
-- This table extends it with app-specific fields.
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  role        text not null check (role in ('patient', 'family', 'admin')),
  created_at  timestamptz default now(),
  last_login  timestamptz
);

-- RLS
alter table public.profiles enable row level security;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- PATIENTS
-- ============================================================
create table public.patients (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade,
  first_name      text not null,
  last_name       text not null,
  dob             date,
  phone           text,
  address         text,
  current_status  text default 'active' check (current_status in ('active', 'discharged', 'deceased')),
  created_at      timestamptz default now()
);

-- RLS
alter table public.patients enable row level security;
create policy "Patients see own record"
  on public.patients for select
  using (auth.uid() = user_id);

-- ============================================================
-- MEDICATIONS
-- ============================================================
create table public.medications (
  id              uuid default uuid_generate_v4() primary key,
  patient_id      uuid references public.patients(id) on delete cascade,
  name            text not null,
  dosage          text not null,
  unit            text,                        -- mg, mcg, ml, etc.
  frequency       text not null,               -- "twice daily", "every 4 hours"
  route           text,                        -- oral, IV, patch, sublingual, etc.
  purpose         text,                        -- plain language reason
  side_effects    jsonb default '[]',          -- array of plain-language strings
  prescriber      text,
  status          text not null default 'scheduled'
                  check (status in ('scheduled', 'delivered', 'not_scheduled')),
  delivery_date   timestamptz,
  expected_delivery text,                      -- "by Friday" — human readable
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- RLS
alter table public.medications enable row level security;
create policy "Patients see own medications"
  on public.medications for select
  using (
    exists (
      select 1 from public.patients
      where patients.id = medications.patient_id
      and patients.user_id = auth.uid()
    )
  );

-- ============================================================
-- CARE PLANS
-- ============================================================
create table public.care_plans (
  id                      uuid default uuid_generate_v4() primary key,
  patient_id              uuid references public.patients(id) on delete cascade unique,
  comfort_goals           jsonb default '[]',  -- [{goal, status, notes}]
  medical_goals           jsonb default '[]',  -- [{goal, status, notes}]
  advance_directive_text  text,
  advance_directive_signed_at  timestamptz,
  healthcare_proxy_name   text,
  last_updated_by         text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- RLS
alter table public.care_plans enable row level security;
create policy "Patients see own care plan"
  on public.care_plans for select
  using (
    exists (
      select 1 from public.patients
      where patients.id = care_plans.patient_id
      and patients.user_id = auth.uid()
    )
  );

-- ============================================================
-- CARE TEAM MEMBERS
-- ============================================================
create table public.care_team_members (
  id          uuid default uuid_generate_v4() primary key,
  patient_id  uuid references public.patients(id) on delete cascade,
  name        text not null,
  role        text not null
              check (role in ('nurse', 'doctor', 'social_worker', 'chaplain', 'family', 'other')),
  phone       text,
  email       text,
  photo_url   text,
  created_at  timestamptz default now()
);

-- RLS
alter table public.care_team_members enable row level security;
create policy "Patients see own care team"
  on public.care_team_members for select
  using (
    exists (
      select 1 from public.patients
      where patients.id = care_team_members.patient_id
      and patients.user_id = auth.uid()
    )
  );

-- ============================================================
-- MESSAGES
-- ============================================================
create table public.messages (
  id              uuid default uuid_generate_v4() primary key,
  patient_id      uuid references public.patients(id) on delete cascade,
  sender_name     text not null,
  sender_role     text,
  recipient_type  text default 'team'
                  check (recipient_type in ('individual', 'team')),
  message_text    text not null,
  is_from_patient boolean default false,
  sent_at         timestamptz default now(),
  read_at         timestamptz,
  created_at      timestamptz default now()
);

-- RLS
alter table public.messages enable row level security;
create policy "Patients see own messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.patients
      where patients.id = messages.patient_id
      and patients.user_id = auth.uid()
    )
  );
create policy "Patients insert own messages"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.patients
      where patients.id = messages.patient_id
      and patients.user_id = auth.uid()
    )
  );

-- ============================================================
-- EDUCATIONAL CONTENT (not patient-specific)
-- ============================================================
create table public.educational_content (
  id                    uuid default uuid_generate_v4() primary key,
  title                 text not null,
  category              text not null,       -- "What is Hospice", "Managing Pain", etc.
  summary               text,
  content_text          text not null,
  reading_time_minutes  integer,
  published_date        date default current_date,
  is_active             boolean default true,
  created_at            timestamptz default now()
);

-- RLS — public read (any authenticated user)
alter table public.educational_content enable row level security;
create policy "Authenticated users read education"
  on public.educational_content for select
  to authenticated
  using (is_active = true);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
create table public.appointments (
  id                  uuid default uuid_generate_v4() primary key,
  patient_id          uuid references public.patients(id) on delete cascade,
  care_team_member_id uuid references public.care_team_members(id),
  appointment_type    text,                   -- "nurse visit", "doctor visit"
  scheduled_at        timestamptz not null,
  duration_minutes    integer default 60,
  location            text,
  notes               text,
  confirmed_at        timestamptz,
  created_at          timestamptz default now()
);

-- RLS
alter table public.appointments enable row level security;
create policy "Patients see own appointments"
  on public.appointments for select
  using (
    exists (
      select 1 from public.patients
      where patients.id = appointments.patient_id
      and patients.user_id = auth.uid()
    )
  );

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger medications_updated_at
  before update on public.medications
  for each row execute function public.handle_updated_at();

create trigger care_plans_updated_at
  before update on public.care_plans
  for each row execute function public.handle_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_patients_user_id on public.patients(user_id);
create index idx_medications_patient_id on public.medications(patient_id);
create index idx_care_plans_patient_id on public.care_plans(patient_id);
create index idx_care_team_patient_id on public.care_team_members(patient_id);
create index idx_messages_patient_id on public.messages(patient_id);
create index idx_messages_sent_at on public.messages(sent_at desc);
create index idx_appointments_patient_id on public.appointments(patient_id);
create index idx_appointments_scheduled_at on public.appointments(scheduled_at);
create index idx_educational_content_category on public.educational_content(category);
