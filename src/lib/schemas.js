import { z } from "zod";

/**
 * Zod Validation Schemas — SQL Readiness Layer
 * Strict, typed validation with user-friendly Arabic error messages.
 * Field names match the SQL/entity column names exactly.
 */

// ── Reusable field validators ────────────────────────────────────────────────

// Empty string / null → undefined so .optional() works with controlled inputs
const emptyToUndefined = (v) => (v === "" || v === null || v === undefined ? undefined : v);
const optional = (schema) => z.preprocess(emptyToUndefined, schema.optional());

// Saudi mobile: starts with 05, exactly 10 digits (spaces/dashes stripped)
export const saudiPhoneSchema = z
  .string({ required_error: "رقم الجوال مطلوب" })
  .min(1, "رقم الجوال مطلوب")
  .transform((v) => v.replace(/[^0-9+]/g, ""))
  .pipe(z.string().regex(/^05\d{8}$/, "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"));

// Saudi national ID: starts with 1 or 2, exactly 10 digits
export const nationalIdSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .pipe(z.string().regex(/^[12]\d{9}$/, "رقم الهوية يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام"));

export const emailSchema = z
  .string()
  .trim()
  .email("صيغة البريد الإلكتروني غير صحيحة (مثال: name@example.com)");

const httpUrlSchema = z
  .string()
  .trim()
  .regex(/^https?:\/\/.+\..+/, "الرابط يجب أن يبدأ بـ http:// أو https://");

// ── Beneficiary Registration ─────────────────────────────────────────────────
export const beneficiarySchema = z.object({
  full_name: z
    .string({ required_error: "الاسم الكامل مطلوب" })
    .trim()
    .min(1, "الاسم الكامل مطلوب")
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .max(100, "الاسم طويل جداً (الحد الأقصى 100 حرف)"),
  phone: saudiPhoneSchema,
  national_id: optional(nationalIdSchema),
  age: optional(
    z.coerce
      .number({ invalid_type_error: "العمر يجب أن يكون رقماً" })
      .int("العمر يجب أن يكون رقماً صحيحاً")
      .min(1, "العمر يجب أن يكون بين 1 و 120")
      .max(120, "العمر يجب أن يكون بين 1 و 120")
  ),
  dependents_count: optional(
    z.coerce.number().int().min(0, "عدد أفراد الأسرة لا يمكن أن يكون سالباً")
  ),
  city: z
    .string({ required_error: "المدينة مطلوبة" })
    .trim()
    .min(1, "المدينة مطلوبة"),
  case_type: z
    .string({ required_error: "نوع الحالة مطلوب" })
    .min(1, "نوع الحالة مطلوب"),
  priority: z
    .string({ required_error: "الأولوية مطلوبة" })
    .min(1, "الأولوية مطلوبة"),
  notes: optional(z.string().max(2000, "الملاحظات تتجاوز الحد الأقصى (2000 حرف)")),
}).passthrough();

// ── NGO Onboarding ───────────────────────────────────────────────────────────
export const ngoSchema = z.object({
  name: z
    .string({ required_error: "اسم المنظمة مطلوب" })
    .trim()
    .min(1, "اسم المنظمة مطلوب")
    .min(3, "اسم المنظمة يجب أن يكون 3 أحرف على الأقل"),
  responsible_person: z
    .string({ required_error: "اسم المسؤول مطلوب" })
    .trim()
    .min(1, "اسم المسؤول مطلوب"),
  phone: saudiPhoneSchema,
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .min(1, "البريد الإلكتروني مطلوب")
    .pipe(emailSchema),
  donation_url: optional(httpUrlSchema),
  logo_url: optional(httpUrlSchema),
}).passthrough();

// ── Marketer ─────────────────────────────────────────────────────────────────
export const marketerSchema = z.object({
  full_name: z
    .string({ required_error: "الاسم الكامل مطلوب" })
    .trim()
    .min(1, "الاسم الكامل مطلوب")
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: saudiPhoneSchema,
  email: optional(emailSchema),
  ngo_name: z
    .string({ required_error: "المنظمة المرتبطة مطلوبة" })
    .trim()
    .min(1, "المنظمة المرتبطة مطلوبة"),
  campaigns_count: optional(
    z.coerce.number().int().min(0, "عدد الحملات لا يمكن أن يكون سالباً")
  ),
}).passthrough();

// ── Validation runner ────────────────────────────────────────────────────────
/**
 * Run a Zod schema and return { valid, errors } where errors is a
 * { field: "arabic message" } map — drop-in compatible with the form dialogs.
 */
export function zodValidate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return { valid: true, errors: {} };
  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { valid: false, errors };
}

// ── File upload validation ───────────────────────────────────────────────────
export const IMPORT_MAX_MB = 5;
export const DOCUMENT_MAX_MB = 10;
export const DOCUMENT_TARGET_KB = 300;

/** Validate an Excel/CSV import file. Returns an Arabic error message or null. */
export function validateImportFile(file) {
  if (!file) return "لم يتم اختيار ملف";
  const name = file.name.toLowerCase();
  if (!name.endsWith(".csv") && !name.endsWith(".xlsx")) {
    return "نوع الملف غير مدعوم — يُسمح فقط بملفات CSV أو Excel (.xlsx)";
  }
  if (file.size > IMPORT_MAX_MB * 1024 * 1024) {
    return `حجم الملف يتجاوز الحد المسموح (${IMPORT_MAX_MB} ميجابايت)`;
  }
  if (file.size === 0) return "الملف فارغ";
  return null;
}

/** Validate a document/image upload. Returns an Arabic error message or null. */
export function validateDocumentFile(file) {
  if (!file) return "لم يتم اختيار ملف";
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
  if (!allowed.includes(file.type)) {
    return `الملف "${file.name}" غير مدعوم — يُسمح فقط بالصور (JPG, PNG, GIF, WebP) وملفات PDF`;
  }
  if (file.size > DOCUMENT_MAX_MB * 1024 * 1024) {
    return `الملف "${file.name}" يتجاوز الحد المسموح (${DOCUMENT_MAX_MB} ميجابايت)`;
  }
  return null;
}

/** Minimum perceived processing delay so submissions feel deliberate. */
export const withMinDelay = (promise, ms = 600) =>
  Promise.all([promise, new Promise((r) => setTimeout(r, ms))]).then(([res]) => res);