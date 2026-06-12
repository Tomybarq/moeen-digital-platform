// ─────────────────────────────────────────────────────────────────────────────
// Centralized Mock Data — single source of truth for all demo/placeholder data.
// Schemas follow SQL naming conventions (snake_case, *_id, *_name, created_at)
// so components stay props-driven and ready for future API integration.
// ─────────────────────────────────────────────────────────────────────────────

// ── NGOs ─────────────────────────────────────────────────────────────────────
export const mockNgos = [
  { ngo_id: "NGO-001", ngo_name: "جمعية الإحسان الخيرية",       city: "الرياض",  total_cases: 84, activity_pct: 88 },
  { ngo_id: "NGO-002", ngo_name: "مؤسسة الأمل للدعم الاجتماعي", city: "جدة",     total_cases: 71, activity_pct: 74 },
  { ngo_id: "NGO-003", ngo_name: "مركز رعاية الطفل",             city: "الدمام",  total_cases: 63, activity_pct: 66 },
  { ngo_id: "NGO-004", ngo_name: "جمعية نور المستقبل",           city: "مكة",     total_cases: 55, activity_pct: 57 },
  { ngo_id: "NGO-005", ngo_name: "مبادرة نماء الخيرية",          city: "المدينة", total_cases: 43, activity_pct: 45 },
];

// ── Beneficiaries (recent cases) ─────────────────────────────────────────────
export const mockBeneficiaries = [
  { beneficiary_id: "BNF-2025-001", full_name: "أحمد محمد السالم",    case_type: "مادي",    city: "الرياض",      priority: "عاجل",  researcher_name: "سارة المطيري", created_at: "١٢ يونيو ٢٠٢٥" },
  { beneficiary_id: "BNF-2025-002", full_name: "فاطمة علي الزهراني",  case_type: "صحي",     city: "جدة",         priority: "مرتفع", researcher_name: "خالد العتيبي", created_at: "١١ يونيو ٢٠٢٥" },
  { beneficiary_id: "BNF-2025-003", full_name: "عبدالله سعد القحطاني", case_type: "تعليمي", city: "الدمام",      priority: "متوسط", researcher_name: "نوف الغامدي",  created_at: "١١ يونيو ٢٠٢٥" },
  { beneficiary_id: "BNF-2025-004", full_name: "مريم يوسف الحربي",     case_type: "متعدد",  city: "مكة المكرمة", priority: "عاجل",  researcher_name: "هند الشهري",   created_at: "١٠ يونيو ٢٠٢٥" },
  { beneficiary_id: "BNF-2025-005", full_name: "سلمان عبدالعزيز",      case_type: "اجتماعي", city: "الرياض",     priority: "منخفض", researcher_name: "أحمد الدوسري", created_at: "١٠ يونيو ٢٠٢٥" },
  { beneficiary_id: "BNF-2025-006", full_name: "نورة خالد الرشيدي",    case_type: "مادي",   city: "تبوك",        priority: "مرتفع", researcher_name: "سارة المطيري", created_at: "٩ يونيو ٢٠٢٥" },
];

// ── Researchers ──────────────────────────────────────────────────────────────
export const mockResearchers = [
  { researcher_id: "RES-001", full_name: "سارة المطيري",  city: "الرياض", completed_cases: 42, status: "active" },
  { researcher_id: "RES-002", full_name: "خالد العتيبي",  city: "جدة",    completed_cases: 38, status: "active" },
  { researcher_id: "RES-003", full_name: "نوف الغامدي",   city: "الدمام", completed_cases: 31, status: "active" },
  { researcher_id: "RES-004", full_name: "هند الشهري",    city: "مكة",    completed_cases: 27, status: "active" },
  { researcher_id: "RES-005", full_name: "أحمد الدوسري",  city: "الرياض", completed_cases: 24, status: "active" },
];

// ── Marketers ────────────────────────────────────────────────────────────────
export const mockMarketers = [
  { marketer_id: "MKT-001", full_name: "خالد الحربي",   ngo_name: "جمعية الإحسان الخيرية", campaigns_count: 12, status: "active" },
  { marketer_id: "MKT-002", full_name: "ريم العنزي",    ngo_name: "مؤسسة الأمل",            campaigns_count: 9,  status: "active" },
  { marketer_id: "MKT-003", full_name: "فهد الشمري",    ngo_name: "مركز رعاية الطفل",       campaigns_count: 7,  status: "active" },
];

// ── Audit Logs (activity feed) ───────────────────────────────────────────────
export const mockAuditLogs = [
  { log_id: 1, log_text: "إضافة منظمة جديدة: جمعية الإحسان",            created_at: "منذ ٢ دقيقة",  log_type: "ngo" },
  { log_id: 2, log_text: "باحث: سارة المطيري أضافت ٣ حالات جديدة",      created_at: "منذ ٨ دقائق",  log_type: "researcher" },
  { log_id: 3, log_text: "انطلاق حملة 'رمضان الخيري' بنجاح",            created_at: "منذ ٢٠ دقيقة", log_type: "campaign" },
  { log_id: 4, log_text: "تسجيل ١٢ مستفيداً جديداً هذا اليوم",          created_at: "منذ ٣٥ دقيقة", log_type: "beneficiary" },
  { log_id: 5, log_text: "مراجعة طلب تسجيل: مؤسسة الأمل",               created_at: "منذ ساعة",     log_type: "ngo" },
  { log_id: 6, log_text: "أحمد العتيبي أتم ٩ حالات هذا الأسبوع",        created_at: "منذ ساعتين",   log_type: "researcher" },
];

export const mockLiveAuditEvents = [
  { log_id: 7, log_text: "انضمام مسوّق جديد: خالد الحربي",              log_type: "campaign" },
  { log_id: 8, log_text: "تحديث بيانات منظمة: مركز رعاية الطفل",        log_type: "ngo" },
  { log_id: 9, log_text: "نوف الزهراني: تسجيل حالتين ميدانيتين",        log_type: "researcher" },
];

// ── Chart Series ─────────────────────────────────────────────────────────────
export const mockGrowthSeries = [
  { month: "يناير",  مستفيدون: 180, منظمات: 38, باحثون: 18 },
  { month: "فبراير", مستفيدون: 220, منظمات: 40, باحثون: 19 },
  { month: "مارس",   مستفيدون: 260, منظمات: 41, باحثون: 21 },
  { month: "أبريل",  مستفيدون: 295, منظمات: 43, باحثون: 22 },
  { month: "مايو",   مستفيدون: 340, منظمات: 45, باحثون: 23 },
  { month: "يونيو",  مستفيدون: 390, منظمات: 48, باحثون: 26 },
  { month: "يوليو",  مستفيدون: 426, منظمات: 50, باحثون: 28 },
  { month: "أغسطس",  مستفيدون: 471, منظمات: 52, باحثون: 30 },
  { month: "سبتمبر", مستفيدون: 510, منظمات: 55, باحثون: 32 },
  { month: "أكتوبر", مستفيدون: 548, منظمات: 57, باحثون: 34 },
  { month: "نوفمبر", مستفيدون: 580, منظمات: 59, باحثون: 35 },
  { month: "ديسمبر", مستفيدون: 626, منظمات: 61, باحثون: 38 },
];

export const mockPrioritySeries = [
  { month: "يناير",  عاجل: 22, مرتفع: 45, متوسط: 110, منخفض: 60 },
  { month: "فبراير", عاجل: 28, مرتفع: 52, متوسط: 98,  منخفض: 55 },
  { month: "مارس",   عاجل: 19, مرتفع: 48, متوسط: 125, منخفض: 70 },
  { month: "أبريل",  عاجل: 35, مرتفع: 60, متوسط: 140, منخفض: 65 },
  { month: "مايو",   عاجل: 30, مرتفع: 55, متوسط: 132, منخفض: 72 },
  { month: "يونيو",  عاجل: 47, مرتفع: 63, متوسط: 155, منخفض: 80 },
];

export const mockStatusDistribution = [
  { name: "حالات نشطة",   value: 312, color: "#0c3140" },
  { name: "حالات مدعومة", value: 178, color: "#00A651" },
  { name: "حالات عاجلة",  value: 47,  color: "#dc2626" },
  { name: "مؤرشفة",       value: 89,  color: "#94a3b8" },
];