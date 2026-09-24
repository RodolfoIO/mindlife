import { createClient } from "npm:@supabase/supabase-js@2.116.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const text = (value: unknown, max = 4000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const normalize = (value: string) =>
  value.normalize("NFKC").trim().toLocaleLowerCase("es-GT").replace(/\s+/g, " ");

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
const isPhone = (value: string) => /^\+502[0-9]{8}$/.test(value);

const isValidDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isMinor = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(`${birthDate}T00:00:00Z`);
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthday = today.getUTCMonth() < birth.getUTCMonth()
    || (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age < 18;
};

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const configuredKeys = () => {
  const values = new Set<string>();
  const add = (value: string | undefined) => { if (value) values.add(value); };
  try {
    const map = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}");
    Object.values(map).forEach((value) => add(typeof value === "string" ? value : undefined));
  } catch {
    // Fall back to the legacy environment name used by this project.
  }
  add(Deno.env.get("SUPABASE_ANON_KEY"));
  add(Deno.env.get("SUPABASE_PUBLISHABLE_KEY"));
  return values;
};

const serviceKey = () => {
  try {
    const map = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    const value = map.default;
    if (typeof value === "string" && value) return value;
  } catch {
    // Fall back to legacy Supabase deployments.
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ ok: false, code: "METHOD_NOT_ALLOWED" }, 405);

  const apiKey = request.headers.get("apikey") ?? "";
  if (!configuredKeys().has(apiKey)) return json({ ok: false, code: "UNAUTHORIZED" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const secret = serviceKey();
  if (!supabaseUrl || !secret) return json({ ok: false, code: "SERVER_CONFIGURATION" }, 500);

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 20000) return json({ ok: false, code: "PAYLOAD_TOO_LARGE" }, 413);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, code: "INVALID_JSON" }, 400);
  }

  if (text(payload.website, 120)) return json({ ok: false, code: "INVALID_SUBMISSION" }, 400);
  const submissionId = text(payload.submissionId, 80);
  const patient = (payload.patient ?? {}) as Record<string, unknown>;
  const intake = (payload.intake ?? {}) as Record<string, unknown>;
  const guardian = (payload.guardian ?? {}) as Record<string, unknown>;
  const consent = (payload.consent ?? {}) as Record<string, unknown>;
  const fullName = text(patient.fullName, 160);
  const sex = text(patient.sex, 20);
  const email = text(patient.email, 254).toLowerCase();
  const phone = text(patient.phone, 20);
  const birthDate = text(patient.birthDate, 10);
  const minor = isValidDate(birthDate) && isMinor(birthDate);
  const errors: Record<string, string> = {};

  if (!/^[0-9a-f-]{36}$/i.test(submissionId)) errors.submissionId = "Identificador inválido.";
  if (fullName.length < 2) errors.fullName = "Ingresa tu nombre completo.";
  if (sex !== "masculino" && sex !== "femenino") errors.sex = "Selecciona tu sexo.";
  if (!isEmail(email)) errors.email = "Ingresa un correo válido.";
  if (!isPhone(phone)) errors.phone = "Ingresa un teléfono guatemalteco válido.";
  if (!isValidDate(birthDate)) errors.birthDate = "Ingresa una fecha válida.";
  if (isValidDate(birthDate) && new Date(`${birthDate}T00:00:00Z`) > new Date()) errors.birthDate = "La fecha no puede ser futura.";
  if (!text(intake.maritalStatus, 80)) errors.maritalStatus = "Selecciona un estado civil.";
  if (text(intake.address, 300).length < 2) errors.address = "Ingresa tu dirección.";
  if (!text(intake.department, 80)) errors.department = "Selecciona tu departamento.";
  if (!text(intake.education, 100)) errors.education = "Selecciona tu escolaridad.";
  if (text(intake.occupation, 160).length < 2) errors.occupation = "Ingresa tu ocupación.";
  if (text(intake.consultationReason, 4000).length < 3) errors.consultationReason = "Describe brevemente el motivo de consulta.";
  if (!text(intake.referralSource, 80)) errors.referralSource = "Selecciona cómo conociste Mindlife.";
  if (consent.accepted !== true) errors.consent = "Debes aceptar el contrato terapéutico y la política de privacidad.";
  if (minor) {
    if (text(guardian.fullName, 160).length < 2) errors.guardianFullName = "Ingresa el nombre del tutor.";
    if (text(guardian.relationship, 80).length < 2) errors.guardianRelationship = "Ingresa el parentesco.";
    if (!isEmail(text(guardian.email, 254).toLowerCase())) errors.guardianEmail = "Ingresa el correo del tutor.";
    if (!isPhone(text(guardian.phone, 20))) errors.guardianPhone = "Ingresa el teléfono del tutor.";
    if (guardian.hasAuthority !== true) errors.guardianAuthority = "Confirma que tienes autoridad legal.";
    if (consent.actor !== "guardian") errors.consent = "El tutor debe aceptar el contrato terapéutico y la política de privacidad.";
  } else if (consent.actor !== "patient") {
    errors.consent = "El paciente debe aceptar el contrato terapéutico y la política de privacidad.";
  }
  if (Object.keys(errors).length) return json({ ok: false, code: "VALIDATION_ERROR", fieldErrors: errors }, 400);

  const identityKey = await sha256([normalize(fullName), email, phone, birthDate].join("|"));
  const client = createClient(supabaseUrl, secret, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await client.rpc("create_patient_intake_submission", {
    p_submission_id: submissionId,
    p_patient: { identityKey, fullName, sex, email, phone, birthDate },
    p_intake: {
      maritalStatus: text(intake.maritalStatus, 80),
      address: text(intake.address, 300),
      department: text(intake.department, 80),
      education: text(intake.education, 100),
      occupation: text(intake.occupation, 160),
      chronicConditions: text(intake.chronicConditions, 1000),
      medications: text(intake.medications, 1000),
      consultationReason: text(intake.consultationReason, 4000),
      referralSource: text(intake.referralSource, 80),
      isMinor: minor,
    },
    p_guardian: minor ? {
      fullName: text(guardian.fullName, 160),
      relationship: text(guardian.relationship, 80),
      email: text(guardian.email, 254).toLowerCase(),
      phone: text(guardian.phone, 20),
      hasAuthority: true,
    } : {},
    p_consent: {
      accepted: true,
      actor: minor ? "guardian" : "patient",
      version: text(consent.version, 80) || "therapeutic-contract-and-privacy-v1",
    },
  });

  if (error) return json({ ok: false, code: "DATABASE_ERROR" }, 500);
  return json(data as Record<string, unknown>, 201);
});
