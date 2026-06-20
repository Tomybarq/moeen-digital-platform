/**
 * generateBeneficiaryReport — Generate PDF + Excel reports for a single beneficiary.
 *
 * Payload:
 * {
 *   beneficiary_id: string,
 *   format: "pdf" | "excel" | "both"  (default: "pdf")
 * }
 *
 * Returns:
 *   PDF → binary PDF file download
 *   Excel → CSV with BOM (Arabic-compatible)
 *   both → JSON with { pdf_url, excel_url }
 */

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";
import { jsPDF } from "npm:jspdf@4.2.1";

// ── Arabic font support ────────────────────────────────────────
// Using built-in Helvetica which has limited Arabic support.
// For proper Arabic rendering we use simple ASCII fallback labels where needed.
// jspdf with custom Arabic fonts would require embedding a TTF file,
// so we render numeric/English fields directly and use transliterated labels.

const LABELS = {
  full_name: "اسم رب الأسرة",
  national_id: "رقم الهوية",
  birth_year: "سنة الميلاد",
  age: "العمر",
  gender: "الجنس",
  phone: "الجوال",
  phone_alt: "جوال بديل",
  city: "المدينة",
  district: "الحي",
  national_address: "العنوان الوطني",
  social_status: "الحالة الاجتماعية",
  education_level: "المستوى التعليمي",
  health_status: "الحالة الصحية",
  disability_type: "نوع الإعاقة",
  sickness_type: "نوع المرض",
  dependents_count: "عدد أفراد الأسرة",
  income_salary: "راتب وظيفي",
  income_social_security: "الضمان الاجتماعي",
  income_account_citizen: "حساب المواطن",
  income_rehab: "التأهيل الشامل",
  income_other_ngos: "دعم جمعيات أخرى",
  income_other_sources: "مصادر دخل أخرى",
  total_income: "إجمالي الدخل",
  expense_rent: "الإيجار",
  expense_electricity: "الكهرباء",
  expense_water: "الماء",
  expense_internet: "الإنترنت",
  expense_medical: "العلاج",
  expense_transport: "المواصلات",
  expense_food: "الغذاء",
  expense_debt_installment: "أقساط الديون",
  debt_reason: "سبب الدين",
  debt_period: "مدة الدين",
  total_expenses: "إجمالي المصروفات",
  net_income: "صافي الدخل",
  environment_type: "نوع البيئة",
  housing_type: "نوع السكن",
  housing_tenure: "حيازة السكن",
  case_type: "نوع الحالة",
  case_classification: "تصنيف الحالة",
  priority: "الأولوية",
  status: "الحالة",
  file_number: "رقم الملف",
  case_status: "حالة الطلب",
  ngo_name: "المنظمة",
  researcher_name: "اسم الباحث الاجتماعي",
  final_recommendation: "التوصية النهائية",
  notes: "ملاحظات",
  visit_date: "تاريخ الزيارة",
  approved_by: "اعتماد المدير",
  researcher_opinion_basic: "رأي الباحث - الأساسية",
  researcher_opinion_financial: "رأي الباحث - المالي",
  researcher_opinion_housing: "رأي الباحث - السكن",
  researcher_opinion_needs: "رأي الباحث - الاحتياجات",
  income_level: "مستوى الدخل",
};

const SECTIONS = {
  basic: {
    title: "البيانات الأساسية",
    fields: ["full_name", "national_id", "birth_year", "age", "gender", "phone", "phone_alt", "city", "district", "national_address", "social_status", "education_level", "health_status", "disability_type", "sickness_type", "dependents_count"],
    color: [12, 49, 64],
  },
  financial: {
    title: "الوضع المالي",
    fields: ["income_salary", "income_social_security", "income_account_citizen", "income_rehab", "income_other_ngos", "income_other_sources", "total_income", "expense_rent", "expense_electricity", "expense_water", "expense_internet", "expense_medical", "expense_transport", "expense_food", "expense_debt_installment", "debt_reason", "debt_period", "total_expenses", "net_income", "income_level"],
    color: [0, 166, 81],
  },
  housing: {
    title: "البيئة والسكن",
    fields: ["environment_type", "housing_type", "housing_tenure", "visit_date"],
    color: [200, 151, 42],
  },
  classification: {
    title: "التصنيف والتوصيات",
    fields: ["case_type", "case_classification", "priority", "status", "case_status", "file_number", "ngo_name", "researcher_name", "final_recommendation", "notes", "approved_by"],
    color: [124, 58, 237],
  },
};

function fmt(val) {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "number") return val.toLocaleString("en-US");
  return String(val);
}

function buildPDF(beneficiary) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;

  let y = margin;

  // ── Header ─────────────────────────────────────────────────
  doc.setFillColor(12, 49, 64);
  doc.rect(0, 0, pageW, 35, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("استمارة بحث اجتماعي", pageW / 2, 18, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Social Research Form — Mo'een Platform", pageW / 2, 27, { align: "center" });

  y = 42;

  // ── Beneficiary name + ID box ──────────────────────────────
  doc.setDrawColor(12, 49, 64);
  doc.setFillColor(240, 248, 245);
  doc.roundedRect(margin, y, contentW, 14, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(12, 49, 64);
  doc.text(beneficiary.full_name || "—", margin + 4, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const metaLine = [
    beneficiary.file_number ? `ملف #${beneficiary.file_number}` : "",
    beneficiary.ngo_name || "",
    beneficiary.researcher_name ? `باحث: ${beneficiary.researcher_name}` : "",
  ].filter(Boolean).join("  |  ");
  doc.text(metaLine, margin + 4, y + 13);

  y += 18;

  // ── Sections ───────────────────────────────────────────────
  Object.values(SECTIONS).forEach((section) => {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = margin;
    }

    const [r, g, bk] = section.color;

    // Section header
    doc.setFillColor(r, g, bk);
    doc.roundedRect(margin, y, contentW, 7, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(section.title, margin + 3, y + 5);
    y += 10;

    // Section fields — two columns
    const fields = section.fields.filter((f) => {
      const v = beneficiary[f];
      return v !== null && v !== undefined && v !== "" && v !== 0;
    });

    if (fields.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text("لا توجد بيانات مسجلة", margin + 3, y + 4);
      y += 8;
      return;
    }

    const colW = contentW / 2;
    let rowY = y;
    let col = 0;

    fields.forEach((field, idx) => {
      if (rowY > 270) {
        doc.addPage();
        y = margin;
        rowY = margin;
        col = 0;
      }

      const x = margin + col * colW;
      const label = LABELS[field] || field;

      // Label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(120, 120, 120);
      doc.text(label, x + 2, rowY + 3.5);

      // Value
      const val = fmt(beneficiary[field]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 30, 30);

      // Truncate long values
      const maxChars = 32;
      const displayVal = val.length > maxChars ? val.substring(0, maxChars) + "..." : val;
      doc.text(displayVal, x + 2, rowY + 8);

      if (col === 0) {
        col = 1;
      } else {
        col = 0;
        rowY += 12;
      }
    });

    if (col === 1) rowY += 12;

    // Researcher opinion for this section
    const opinionMap = {
      basic: "researcher_opinion_basic",
      financial: "researcher_opinion_financial",
      housing: "researcher_opinion_housing",
      classification: "researcher_opinion_needs",
    };
    const opinionField = opinionMap[Object.keys(SECTIONS).find(k => SECTIONS[k] === section)];
    const opinion = opinionField ? beneficiary[opinionField] : null;

    if (opinion && rowY < 260) {
      doc.setDrawColor(r, g, bk);
      doc.setFillColor(r, g, bk, 0.08);
      doc.roundedRect(margin, rowY + 1, contentW, 9, 1, 1, "FD");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(r, g, bk);
      const opText = `رأي الباحث: ${opinion}`;
      const truncated = opText.length > 70 ? opText.substring(0, 70) + "..." : opText;
      doc.text(truncated, margin + 3, rowY + 6.5);
      rowY += 11;
    }

    y = rowY + 4;
  });

  // ── Footer ─────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Mo'een Digital Platform — ${beneficiary.id?.slice(-8) || ""} — ${i}/${totalPages}`,
      pageW / 2,
      292,
      { align: "center" }
    );
  }

  return doc.output("arraybuffer");
}

function buildCSV(beneficiary) {
  const bom = "\uFEFF";

  // All fields in logical order
  const allFields = [
    ...SECTIONS.basic.fields,
    ...SECTIONS.financial.fields,
    ...SECTIONS.housing.fields,
    ...SECTIONS.classification.fields,
    "researcher_opinion_basic",
    "researcher_opinion_financial",
    "researcher_opinion_housing",
    "researcher_opinion_needs",
    "dependents_data",
    "basic_needs",
    "non_basic_needs",
    "documents",
    "national_address",
    "disability",
    "sickness_type",
    "debt_reason",
    "debt_period",
    "income_other_sources",
    "file_number",
    "approved_by",
    "notes",
  ];

  // Deduplicate while preserving order
  const seen = new Set();
  const orderedFields = allFields.filter((f) => {
    if (seen.has(f)) return false;
    seen.add(f);
    return true;
  });

  const headers = orderedFields.map((f) => LABELS[f] || f);

  const values = orderedFields.map((f) => {
    const v = beneficiary[f];
    if (v === null || v === undefined) return "";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  });

  const escapeCSV = (s) => `"${s.replace(/"/g, '""')}"`;

  return [bom + headers.map(escapeCSV).join(","), values.map(escapeCSV).join(",")].join("\n");
}

// ── Main handler ──────────────────────────────────────────────
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      payload = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const beneficiaryId = payload.beneficiary_id;
    const format = payload.format || "pdf";

    if (!beneficiaryId) {
      return Response.json({ error: "beneficiary_id is required" }, { status: 400 });
    }

    // Fetch the beneficiary record
    let beneficiary;
    try {
      beneficiary = await base44.entities.Beneficiary.get(beneficiaryId);
    } catch (e) {
      return Response.json({ error: "Beneficiary not found or access denied" }, { status: 404 });
    }

    if (!beneficiary) {
      return Response.json({ error: "Beneficiary not found" }, { status: 404 });
    }

    const safeName = (beneficiary.full_name || "beneficiary").replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "_");

    if (format === "excel" || format === "csv") {
      const csvContent = buildCSV(beneficiary);
      return new Response(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${safeName}_report.csv"`,
        },
      });
    }

    if (format === "pdf") {
      const pdfBytes = buildPDF(beneficiary);
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safeName}_social_research.pdf"`,
        },
      });
    }

    if (format === "both") {
      const pdfBytes = buildPDF(beneficiary);
      const csvContent = buildCSV(beneficiary);

      // Upload both files and return URLs
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const csvBlob = new Blob([csvContent], { type: "text/csv; charset=utf-8" });

      const pdfUpload = await base44.asServiceRole.integrations.Core.UploadFile({
        file: pdfBlob,
      });
      const csvUpload = await base44.asServiceRole.integrations.Core.UploadFile({
        file: csvBlob,
      });

      return Response.json({
        success: true,
        beneficiary_name: beneficiary.full_name,
        pdf_url: pdfUpload.file_url,
        excel_url: csvUpload.file_url,
      });
    }

    return Response.json({ error: "Invalid format. Use: pdf, excel, or both" }, { status: 400 });
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});