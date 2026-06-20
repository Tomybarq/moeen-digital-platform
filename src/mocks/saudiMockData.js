/**
 * @fileoverview Saudi-Localized Mock Dataset Generator — Mo'een Digital Platform
 *
 * Generates realistic Saudi NGO data, user hierarchies, beneficiary records,
 * and marketer referral metrics for board presentations and demo dashboards.
 *
 * Exports:
 *   - ngoProfiles     — 3 prominent Saudi NGOs
 *   - userDirectory   — Role-distributed users per NGO
 *   - generateBeneficiaries(count) — Scalable beneficiary blueprint
 *   - marketerMetrics — Referral tracking & fundraising leaderboard data
 */

/* ── Saudi Name Pools (authentic regional quad-names) ──────────────────── */

const MALE_FIRST_NAMES = [
  "فهد", "عبدالله", "محمد", "سعود", "خالد", "نايف", "سلطان", "تركي",
  "بندر", "مشعل", "سطام", "وليد", "ياسر", "طلال", "ماجد", "فيصل",
  "سلمان", "عمر", "صالح", "أحمد", "علي", "حسن", "إبراهيم", "راشد",
];

const FEMALE_FIRST_NAMES = [
  "نورة", "سارة", "مها", "هند", "ريم", "الجوهرة", "مشاعل", "عبير",
  "لطيفة", "منيرة", "فاطمة", "عائشة", "دلال", "أروى", "غادة", "نوف",
  "هيا", "عهود", "البندري", "موضي",
];

const MALE_TRIBAL_NISBA = [
  "الدوسري", "العتيبي", "القحطاني", "الغامدي", "الزهراني", "المطيري",
  "الحربي", "الشهري", "العنزي", "الشمري", "السبيعي", "الرشيدي",
];

const FEMALE_TRIBAL_NISBA = [
  "الدوسرية", "العتيبية", "القحطانية", "الغامدية", "الزهرانية", "المطيرية",
  "الحربية", "الشهرية", "العنزية", "الشمري",
];

const CITIES = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر",
  "الأحساء", "القطيف", "تبوك", "بريدة", "حائل", "أبها", "نجران", "جازان",
  "الطائف", "ينبع", "عرعر", "سكاكا", "الباحة", "القنفذة",
];

const DISTRICTS = [
  "الملز", "العليا", "النسيم", "الروضة", "الشفا", "الربوة", "الحمراء",
  "البساتين", "الصفا", "السليمانية", "قرطبة", "الياسمين", "النزهة",
  "العزيزية", "النهضة", "المغرزات", "القدس", "المروج",
];

/* ── NGO Profiles ──────────────────────────────────────────────────────── */

export const ngoProfiles = [
  {
    id: "NGO-RUH-001",
    name: "جمعية البر الأهلية بالرياض",
    responsible_person: "د. عبدالعزيز بن محمد آل الشيخ",
    phone: "٠١١٤٧٥١٠٠٠",
    email: "info@alberr-riyadh.sa",
    donation_url: "https://alberr-riyadh.sa/donate",
    city: "الرياض",
    category: "خيرية",
    status: "active",
    beneficiary_target: 1600,
  },
  {
    id: "NGO-JED-002",
    name: "جمعية ترافد للتنمية الأسرية بجدة",
    responsible_person: "أ. نورة بنت سليمان الزامل",
    phone: "٠١٢٦٥٢٨٨٠٠",
    email: "contact@tarafud-jeddah.sa",
    donation_url: "https://tarafud-jeddah.sa/donate",
    city: "جدة",
    category: "اجتماعية",
    status: "active",
    beneficiary_target: 1400,
  },
  {
    id: "NGO-DAM-003",
    name: "جمعية معين للخدمات الإنسانية بالمنطقة الشرقية",
    responsible_person: "م. سلمان بن عبدالرحمن التركي",
    phone: "٠١٣٨٥٩٢١٠٠",
    email: "info@moeen-sharqiya.sa",
    donation_url: "https://moeen-sharqiya.sa/donate",
    city: "الدمام",
    category: "خيرية",
    status: "archived",
    beneficiary_target: 0,
  },
];

/* ── User Directory (hierarchical allocation) ──────────────────────────── */

export const userDirectory = [
  /* Platform Admin (global) */
  {
    id: "USR-ADM-001",
    full_name: "د. عبدالرحمن بن صالح الناصر",
    email: "admin@moeen.sa",
    role: "platform_admin",
    ngo_id: null,
    ngo_name: null,
    city: "الرياض",
  },

  /* ── NGO 1: جمعية البر الأهلية بالرياض ─────────────── */
  // Researchers
  {
    id: "USR-RES-R1",
    full_name: "م. أحمد بن فهد الغامدي",
    email: "a.ghamdi@ngo-riyadh.sa",
    role: "researcher",
    ngo_id: "NGO-RUH-001",
    ngo_name: "جمعية البر الأهلية بالرياض",
    city: "الرياض",
  },
  {
    id: "USR-RES-R2",
    full_name: "أ. سارة بنت محمد العتيبي",
    email: "s.otaibi@ngo-riyadh.sa",
    role: "researcher",
    ngo_id: "NGO-RUH-001",
    ngo_name: "جمعية البر الأهلية بالرياض",
    city: "الرياض",
  },
  // Marketers
  {
    id: "USR-MKT-R1",
    full_name: "خالد بن فهد الحربي",
    email: "k.harbi@ngo-riyadh.sa",
    role: "marketer",
    ngo_id: "NGO-RUH-001",
    ngo_name: "جمعية البر الأهلية بالرياض",
    city: "الرياض",
  },
  {
    id: "USR-MKT-R2",
    full_name: "فاطمة بنت عبدالله الزهراني",
    email: "f.zahrani@ngo-riyadh.sa",
    role: "marketer",
    ngo_id: "NGO-RUH-001",
    ngo_name: "جمعية البر الأهلية بالرياض",
    city: "الرياض",
  },

  /* ── NGO 2: جمعية ترافد للتنمية الأسرية بجدة ─────── */
  // Researchers
  {
    id: "USR-RES-J1",
    full_name: "أ. هند بنت سليمان الشهري",
    email: "h.shehri@ngo-jeddah.sa",
    role: "researcher",
    ngo_id: "NGO-JED-002",
    ngo_name: "جمعية ترافد للتنمية الأسرية بجدة",
    city: "جدة",
  },
  {
    id: "USR-RES-J2",
    full_name: "م. نايف بن تركي المطيري",
    email: "n.mutairi@ngo-jeddah.sa",
    role: "researcher",
    ngo_id: "NGO-JED-002",
    ngo_name: "جمعية ترافد للتنمية الأسرية بجدة",
    city: "جدة",
  },
  // Marketers
  {
    id: "USR-MKT-J1",
    full_name: "ريم بنت محمد العنزي",
    email: "r.anazi@ngo-jeddah.sa",
    role: "marketer",
    ngo_id: "NGO-JED-002",
    ngo_name: "جمعية ترافد للتنمية الأسرية بجدة",
    city: "جدة",
  },
  {
    id: "USR-MKT-J2",
    full_name: "وليد بن سعد القحطاني",
    email: "w.qahtani@ngo-jeddah.sa",
    role: "marketer",
    ngo_id: "NGO-JED-002",
    ngo_name: "جمعية ترافد للتنمية الأسرية بجدة",
    city: "جدة",
  },
];

/* ── Name Generator Utilities ──────────────────────────────────────────── */

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a Saudi-compliant 10-digit national ID starting with '1' or '2'.
 */
export function generateNationalID() {
  const prefix = Math.random() < 0.5 ? "1" : "2";
  const suffix = Array.from({ length: 9 }, () => randomInt(0, 9)).join("");
  return prefix + suffix;
}

/**
 * Generates a Saudi quad-name with bin/bint pattern.
 */
function generateQuadName(gender) {
  const first = gender === "ذكر" ? pickRandom(MALE_FIRST_NAMES) : pickRandom(FEMALE_FIRST_NAMES);
  const father = pickRandom(MALE_FIRST_NAMES);
  const grandpa = pickRandom(MALE_FIRST_NAMES);
  const tribe = gender === "ذكر" ? pickRandom(MALE_TRIBAL_NISBA) : pickRandom(FEMALE_TRIBAL_NISBA);
  const connector = gender === "ذكر" ? "بن" : "بنت";
  return `${first} ${connector} ${father} ${connector} ${grandpa} ${tribe}`;
}

/* ── 3000 Beneficiary Generator ────────────────────────────────────────── */

const CASE_TYPES = ["مادي", "صحي", "تعليمي", "اجتماعي", "متعدد"];

const SOCIAL_STATUSES = ["أعزب", "متزوج", "مطلق", "أرمل", "مهجور"];

const EDUCATION_LEVELS = [
  "أمي", "ابتدائي", "متوسط", "ثانوي", "دبلوم", "جامعي", "دراسات عليا",
];

const HEALTH_STATUSES = ["سليم", "معاق", "مريض"];

const HOUSING_TYPES = ["شعبي", "شقة", "فيلا", "ملحق"];

const HOUSING_TENURES = ["إيجار", "ملك", "إرث", "وقف"];

const ENVIRONMENT_TYPES = ["هجرة", "بادية", "قرية", "محافظة", "مدينة"];

const INCOME_LEVELS = ["لا يوجد دخل", "دخل منخفض", "دخل متوسط"];

const PRIORITIES = ["عاجل", "مرتفع", "متوسط", "منخفض"];

const CASE_STATUSES = ["معتمد", "قيد الدراسة", "مؤرشف"];

const CASE_STATUS_FIELD = ["معتمد", "جديد", "تحديث"];

const RESEARCHERS_BY_NGO = {
  "NGO-RUH-001": ["م. أحمد بن فهد الغامدي", "أ. سارة بنت محمد العتيبي"],
  "NGO-JED-002": ["أ. هند بنت سليمان الشهري", "م. نايف بن تركي المطيري"],
};

const CITIES_BY_NGO = {
  "NGO-RUH-001": ["الرياض", "بريدة", "حائل", "الخرج", "المجمعة"],
  "NGO-JED-002": ["جدة", "مكة المكرمة", "الطائف", "ينبع", "القنفذة"],
};

function randomDistinct(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Generates `count` beneficiaries distributed across active NGOs.
 */
export function generateBeneficiaries(count = 3000) {
  const activeNgos = ngoProfiles.filter(n => n.status === "active");
  const results = [];
  let fileCounter = 0;

  // Distribute proportionally
  const totalTarget = activeNgos.reduce((s, n) => s + n.beneficiary_target, 0);
  let cumulative = 0;

  activeNgos.forEach(ngo => {
    const ngoAllocation = Math.round((ngo.beneficiary_target / totalTarget) * count);

    for (let i = 0; i < ngoAllocation; i++) {
      fileCounter++;
      const gender = Math.random() < 0.55 ? "ذكر" : "أنثى";
      const caseStatusField = Math.random() < 0.6
        ? "معتمد"
        : Math.random() < 0.75
          ? "جديد"
          : "تحديث";

      const incomeSalary = Math.random() < 0.5 ? randomInt(0, 4000) : 0;
      const incomeSec = randomInt(0, 1100);
      const incomeAccount = Math.random() < 0.3 ? randomInt(0, 500) : 0;
      const totalIncome = incomeSalary + incomeSec + incomeAccount;

      const expenseRent = randomInt(500, 2500);
      const expenseElec = randomInt(100, 600);
      const expenseWater = randomInt(30, 200);
      const expenseNet = randomInt(50, 350);
      const expenseMed = randomInt(0, 800);
      const expenseTrans = randomInt(50, 500);
      const expenseFood = randomInt(400, 1500);
      const expenseDebt = randomInt(0, 3000);
      const totalExpenses =
        expenseRent + expenseElec + expenseWater + expenseNet +
        expenseMed + expenseTrans + expenseFood + expenseDebt;

      const dependentsCount = randomInt(2, 7);
      const dependentsData = Array.from({ length: randomInt(0, dependentsCount) }, (_, j) => ({
        name: `${j + 1} تابع`,
        age: randomInt(1, 55),
        relation: pickRandom(["ابن", "ابنة", "زوجة", "أخ", "أخت"]),
        health_status: pickRandom(HEALTH_STATUSES),
        education: pickRandom(EDUCATION_LEVELS),
      }));

      // Disability weighted
      const isDisabled = Math.random() < 0.08;
      const disabilityType = isDisabled
        ? pickRandom(["إعاقة حركية", "إعاقة بصرية", "إعاقة سمعية", "إعاقة ذهنية", ""])
        : "";
      const sicknessType = !isDisabled && Math.random() < 0.15
        ? pickRandom(["السكري", "ضغط الدم", "السرطان", "فشل كلوي", "الربو", ""])
        : "";

      const fileNum = String(fileCounter).padStart(5, "0");

      results.push({
        full_name: generateQuadName(gender),
        national_id: generateNationalID(),
        birth_year: 1380 + randomInt(0, 50),
        age: 18 + randomInt(0, 55),
        gender,
        phone: "05" + String(randomInt(0, 9)) + String(randomInt(0, 9)).repeat(7),
        phone_alt: Math.random() < 0.3 ? "05" + String(randomInt(0, 9)) + String(randomInt(0, 9)).repeat(7) : "",
        city: pickRandom(CITIES_BY_NGO[ngo.id] || CITIES),
        district: pickRandom(DISTRICTS),
        national_address: `ص.ب ${randomInt(1000, 99999)} — ${pickRandom(CITIES_BY_NGO[ngo.id] || CITIES)}`,
        social_status: pickRandom(SOCIAL_STATUSES),
        education_level: pickRandom(EDUCATION_LEVELS),
        health_status: isDisabled ? "معاق" : Math.random() < 0.12 ? "مريض" : "سليم",
        disability: isDisabled,
        disability_type: disabilityType,
        sickness_type: sicknessType,
        dependents_count: 1 + dependentsCount,
        dependents_data: dependentsData,
        income_salary: incomeSalary,
        income_social_security: incomeSec,
        income_account_citizen: incomeAccount,
        income_rehab: 0,
        income_other_ngos: 0,
        income_other_sources: Math.random() < 0.1 ? "دخل مزرعة" : "",
        total_income: totalIncome,
        expense_rent: expenseRent,
        expense_electricity: expenseElec,
        expense_water: expenseWater,
        expense_internet: expenseNet,
        expense_medical: expenseMed,
        expense_transport: expenseTrans,
        expense_food: expenseFood,
        expense_debt_installment: expenseDebt,
        debt_reason: expenseDebt > 1000 ? pickRandom(["علاج", "زواج", "دراسة", "قرض سابق", ""]) : "",
        debt_period: expenseDebt > 1000 ? `${randomInt(6, 48)} شهراً` : "",
        total_expenses: totalExpenses,
        net_income: totalIncome - totalExpenses,
        researcher_opinion_basic: pickRandom(["", "البيانات موثوقة", "بحاجة لزيارة ميدانية للتأكد", ""]),
        researcher_opinion_dependents: pickRandom(["", "عدد التابعين مطابق للمعاينة", ""]),
        researcher_opinion_financial: pickRandom([
          "", "الدخل الشهري منخفض جداً", "المصاريف تفوق الدخل", "بحاجة لدعم مالي عاجل", "",
        ]),
        researcher_opinion_housing: pickRandom(["", "المسكن بحاجة لصيانة عاجلة", "", ""]),
        researcher_opinion_needs: pickRandom(["", "حالة إنسانية تستحق الدعم", "", ""]),
        environment_type: pickRandom(ENVIRONMENT_TYPES),
        housing_type: pickRandom(HOUSING_TYPES),
        housing_tenure: pickRandom(HOUSING_TENURES),
        basic_needs: "{}",
        non_basic_needs: "{}",
        final_recommendation: pickRandom([
          "أولوية قصوى", "أولوية متوسطة", "غير مستحقة", "",
        ]),
        income_level: totalIncome < 2000 ? "لا يوجد دخل" : totalIncome < 5000 ? "دخل منخفض" : "دخل متوسط",
        case_type: pickRandom(CASE_TYPES),
        case_classification: pickRandom(["أولوية قصوى", "أولوية متوسطة", "غير مستحقة"]),
        priority: pickRandom(PRIORITIES),
        status: pickRandom(["active", "archived", "supported"]),
        file_number: `MF-${ngo.id.slice(-3)}-${fileNum}`,
        case_status: caseStatusField,
        ngo_id: ngo.id,
        ngo_name: ngo.name,
        researcher_name: pickRandom(RESEARCHERS_BY_NGO[ngo.id] || []),
        notes: caseStatusField === "معتمد"
          ? "تم اعتماد الحالة بعد التدقيق المكتبي والميداني"
          : "",
        visit_date: new Date(
          2025,
          randomInt(0, 5),
          randomInt(1, 28),
        ).toISOString().slice(0, 10),
      });
    }
  });

  return results;
}

/**
 * Generates a lightweight summary for dashboard tables (no nested dependents).
 */
export function generateBeneficiaryDigest(count = 3000) {
  return generateBeneficiaries(count).map(b => ({
    beneficiary_id: b.file_number,
    full_name: b.full_name,
    national_id: b.national_id,
    case_type: b.case_type,
    city: b.city,
    priority: b.priority,
    status: b.status,
    case_status: b.case_status,
    ngo_name: b.ngo_name,
    researcher_name: b.researcher_name,
    income_level: b.income_level,
    case_classification: b.case_classification,
    visit_date: b.visit_date,
  }));
}

/* ── Marketer Metrics & Referral Tracking ──────────────────────────────── */

export const marketerMetrics = [
  {
    id: "USR-MKT-R1",
    name: "خالد بن فهد الحربي",
    ngo_id: "NGO-RUH-001",
    ngo_name: "جمعية البر الأهلية بالرياض",
    total_funds: 48750,
    conversion_rate: 14,
    active_links: 8,
    campaigns_count: 15,
    trendData: [
      { day: "السبت", value: 13 },
      { day: "الأحد", value: 18 },
      { day: "الاثنين", value: 14 },
      { day: "الثلاثاء", value: 22 },
      { day: "الأربعاء", value: 19 },
      { day: "الخميس", value: 26 },
      { day: "الجمعة", value: 23 },
    ],
  },
  {
    id: "USR-MKT-R2",
    name: "فاطمة بنت عبدالله الزهراني",
    ngo_id: "NGO-RUH-001",
    ngo_name: "جمعية البر الأهلية بالرياض",
    total_funds: 42350,
    conversion_rate: 12,
    active_links: 6,
    campaigns_count: 12,
    trendData: [
      { day: "السبت", value: 10 },
      { day: "الأحد", value: 15 },
      { day: "الاثنين", value: 13 },
      { day: "الثلاثاء", value: 18 },
      { day: "الأربعاء", value: 16 },
      { day: "الخميس", value: 22 },
      { day: "الجمعة", value: 19 },
    ],
  },
  {
    id: "USR-MKT-J1",
    name: "ريم بنت محمد العنزي",
    ngo_id: "NGO-JED-002",
    ngo_name: "جمعية ترافد للتنمية الأسرية بجدة",
    total_funds: 36100,
    conversion_rate: 10,
    active_links: 5,
    campaigns_count: 10,
    trendData: [
      { day: "السبت", value: 9 },
      { day: "الأحد", value: 13 },
      { day: "الاثنين", value: 11 },
      { day: "الثلاثاء", value: 15 },
      { day: "الأربعاء", value: 14 },
      { day: "الخميس", value: 19 },
      { day: "الجمعة", value: 17 },
    ],
  },
  {
    id: "USR-MKT-J2",
    name: "وليد بن سعد القحطاني",
    ngo_id: "NGO-JED-002",
    ngo_name: "جمعية ترافد للتنمية الأسرية بجدة",
    total_funds: 29300,
    conversion_rate: 9,
    active_links: 4,
    campaigns_count: 8,
    trendData: [
      { day: "السبت", value: 8 },
      { day: "الأحد", value: 12 },
      { day: "الاثنين", value: 10 },
      { day: "الثلاثاء", value: 14 },
      { day: "الأربعاء", value: 12 },
      { day: "الخميس", value: 17 },
      { day: "الجمعة", value: 15 },
    ],
  },
];

/** Aggregate: total active links across all marketers. */
export const totalActiveLinks = marketerMetrics.reduce((s, m) => s + m.active_links, 0);

/** Aggregate: total collected funds (formatted). */
export const totalCollectedFunds = Math.round(
  marketerMetrics.reduce((s, m) => s + m.total_funds, 0) / 1000,
) + "K";

/** Top 4 marketers for the leaderboard widget. */
export const topMarketersLeaderboard = marketerMetrics
  .slice(0, 4)
  .sort((a, b) => b.total_funds - a.total_funds)
  .map((m, i) => ({
    rank: i + 1,
    id: m.id,
    name: m.name,
    funds: m.total_funds.toLocaleString("ar-SA"),
    conversion: m.conversion_rate,
    active_links: m.active_links,
    ngo_name: m.ngo_name,
  }));

/** Aggregate weekly trend (sum across all marketers). */
export const aggregateWeeklyTrend = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"]
  .map(day => {
    const total = marketerMetrics.reduce((s, m) => {
      const entry = m.trendData.find(d => d.day === day);
      return s + (entry ? entry.value : 0);
    }, 0);
    const avg = Math.round(total / marketerMetrics.length);
    return { day, value: avg };
  });