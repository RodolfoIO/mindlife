alter table public.patient_intakes
    drop constraint patient_intakes_consultation_reason_check;

alter table public.patient_intakes
    add constraint patient_intakes_consultation_reason_check
    check (char_length(trim(consultation_reason)) >= 3);
