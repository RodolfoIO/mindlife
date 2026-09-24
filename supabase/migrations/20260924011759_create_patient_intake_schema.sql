create extension if not exists pgcrypto;

create table public.patients (
    id uuid primary key default gen_random_uuid(),
    identity_key text not null unique,
    full_name text not null check (char_length(trim(full_name)) between 2 and 160),
    email text not null check (char_length(email) <= 254),
    phone text not null check (phone ~ '^\+502[0-9]{8}$'),
    birth_date date not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.appointments (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid not null references public.patients(id) on delete restrict,
    service_id text not null,
    package_id text not null,
    package_name text not null,
    sessions smallint not null check (sessions > 0),
    duration_minutes smallint not null check (duration_minutes > 0),
    price_gtq numeric(10, 2) not null check (price_gtq >= 0),
    starts_at timestamptz,
    timezone text not null default 'America/Guatemala',
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
    external_calendar_id text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.patient_intakes (
    id uuid primary key default gen_random_uuid(),
    submission_id uuid not null unique,
    patient_id uuid not null references public.patients(id) on delete restrict,
    marital_status text not null,
    address text not null check (char_length(trim(address)) between 2 and 300),
    education text not null,
    occupation text not null check (char_length(trim(occupation)) between 2 and 160),
    chronic_conditions text,
    medications text,
    consultation_reason text not null check (char_length(trim(consultation_reason)) between 10 and 4000),
    referral_source text not null,
    is_minor boolean not null,
    guardian_full_name text,
    guardian_relationship text,
    guardian_email text,
    guardian_phone text,
    guardian_has_authority boolean not null default false,
    consent_actor text not null check (consent_actor in ('patient', 'guardian')),
    consent_accepted boolean not null check (consent_accepted = true),
    consent_version text not null,
    consented_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    check ((is_minor = false and guardian_has_authority = false and guardian_full_name is null and guardian_relationship is null and guardian_email is null and guardian_phone is null and consent_actor = 'patient') or (is_minor = true and guardian_has_authority = true and char_length(trim(guardian_full_name)) between 2 and 160 and char_length(trim(guardian_relationship)) between 2 and 80 and guardian_email is not null and guardian_phone ~ '^\+502[0-9]{8}$' and consent_actor = 'guardian'))
);

create index appointments_patient_id_idx on public.appointments(patient_id);
create index appointments_starts_at_idx on public.appointments(starts_at);
create index patient_intakes_patient_id_created_at_idx on public.patient_intakes(patient_id, created_at desc);

alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.patient_intakes enable row level security;

revoke all on table public.patients, public.appointments, public.patient_intakes from anon, authenticated;
grant all on table public.patients, public.appointments, public.patient_intakes to service_role;
grant usage on schema public to service_role;

create or replace function public.create_patient_intake_submission(
    p_submission_id uuid,
    p_patient jsonb,
    p_intake jsonb,
    p_guardian jsonb,
    p_consent jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
    v_patient_id uuid;
    v_intake_id uuid;
    v_existing jsonb;
begin
    select jsonb_build_object('ok', true, 'patientId', patient_id, 'intakeId', id)
    into v_existing
    from public.patient_intakes
    where submission_id = p_submission_id;

    if v_existing is not null then
        return v_existing;
    end if;

    select id into v_patient_id
    from public.patients
    where identity_key = p_patient->>'identityKey'
    for update;

    if v_patient_id is null then
        insert into public.patients (identity_key, full_name, email, phone, birth_date)
        values (
            p_patient->>'identityKey',
            trim(p_patient->>'fullName'),
            lower(trim(p_patient->>'email')),
            p_patient->>'phone',
            (p_patient->>'birthDate')::date
        )
        returning id into v_patient_id;
    end if;

    insert into public.patient_intakes (
        submission_id, patient_id, marital_status, address, education, occupation,
        chronic_conditions, medications, consultation_reason, referral_source,
        is_minor, guardian_full_name, guardian_relationship, guardian_email,
        guardian_phone, guardian_has_authority, consent_actor, consent_accepted,
        consent_version
    )
    values (
        p_submission_id,
        v_patient_id,
        p_intake->>'maritalStatus',
        trim(p_intake->>'address'),
        p_intake->>'education',
        trim(p_intake->>'occupation'),
        nullif(trim(p_intake->>'chronicConditions'), ''),
        nullif(trim(p_intake->>'medications'), ''),
        trim(p_intake->>'consultationReason'),
        p_intake->>'referralSource',
        (p_intake->>'isMinor')::boolean,
        nullif(trim(p_guardian->>'fullName'), ''),
        nullif(trim(p_guardian->>'relationship'), ''),
        nullif(lower(trim(p_guardian->>'email')), ''),
        nullif(p_guardian->>'phone', ''),
        coalesce((p_guardian->>'hasAuthority')::boolean, false),
        p_consent->>'actor',
        (p_consent->>'accepted')::boolean,
        p_consent->>'version'
    )
    returning id into v_intake_id;

    return jsonb_build_object('ok', true, 'patientId', v_patient_id, 'intakeId', v_intake_id);
end;
$$;

revoke all on function public.create_patient_intake_submission(uuid, jsonb, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_patient_intake_submission(uuid, jsonb, jsonb, jsonb, jsonb) to service_role;
