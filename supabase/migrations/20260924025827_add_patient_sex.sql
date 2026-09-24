alter table public.patients
    add column sex text check (sex in ('masculino', 'femenino'));

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
        insert into public.patients (identity_key, full_name, sex, email, phone, birth_date)
        values (
            p_patient->>'identityKey',
            trim(p_patient->>'fullName'),
            p_patient->>'sex',
            lower(trim(p_patient->>'email')),
            p_patient->>'phone',
            (p_patient->>'birthDate')::date
        )
        returning id into v_patient_id;
    end if;

    insert into public.patient_intakes (
        submission_id, patient_id, marital_status, address, department, education, occupation,
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
        p_intake->>'department',
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
