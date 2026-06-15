/**
 * @fileoverview Centralised Role & Permission Configuration — Mo'een Digital Platform
 *
 * THIS IS THE SINGLE SOURCE OF TRUTH for all role definitions, permissions,
 * labels, colours, icons, and descriptions across the entire application.
 *
 * Every component, guard, badge, and sidebar that references roles or
 * permissions MUST import from this file.
 *
 * ── ADDING A NEW ROLE ────────────────────────────────────────────────────────
 * 1. Add it to ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_COLORS, ROLE_ICONS.
 * 2. Define its permission set in PERMISSIONS.
 * 3. Update entity RLS rules on the backend (Beneficiary, NGO, Marketer, User).
 * 4. Done. Every UI guard picks up the new role automatically.
 *
 * ── ADDING A NEW PERMISSION ─────────────────────────────────────────────────
 * 1. Add the `resource:action` string to the relevant roles in PERMISSIONS.
 * 2. Add a denial message in DENIAL_MESSAGES (optional).
 * 3. Guard with `<Can permission="new:perm">` in the frontend.
 * 4. If it controls a CRUD operation, ensure backend RLS enforces it.
 *
 * ── BACKEND ENFORCEMENT ─────────────────────────────────────────────────────
 * The frontend helpers (`hasPermission`, `hasRole`, `Can`, `RoleGuard`) are
 * PURELY COSMETIC — they hide/show UI elements for a better user experience.
 *
 * ALL actual data protection is enforced server-side through:
 *   1. Base44 Entity RLS rules (per-entity read/create/update/delete policies)
 *   2. /me endpoint returns user role → frontend maps role → permissions
 *
 * Never rely on frontend permission checks for security.
 */

/* ── Five fixed roles (Phase 1) ─────────────────────────────────────────── */

export const ROLES = {
  PLATFORM_ADMIN: "platform_admin",
  NGO_MANAGER:    "ngo_manager",
  RESEARCHER:     "researcher",
  MARKETER:       "marketer",
  PDO:            "pdo",
};

export const ROLE_LABELS = {
  platform_admin: "مدير المنصة",
  ngo_manager:    "مدير المنظمة",
  researcher:     "باحث اجتماعي",
  marketer:       "مسوّق",
  pdo:            "مسؤول حماية البيانات",
};

export const ROLE_DESCRIPTIONS = {
  platform_admin: "صلاحيات كاملة على جميع أقسام المنصة",
  ngo_manager:    "إدارة منظمتهم وعرض تقاريرها",
  researcher:     "البحث والمتابعة الميدانية للمستفيدين",
  marketer:       "إدارة الحملات التسويقية للمستفيدين",
  pdo:            "مسؤول امتثال حماية البيانات الشخصية",
};

export const ROLE_COLORS = {
  platform_admin: "bg-purple-500/15 text-purple-600 border-purple-300",
  ngo_manager:    "bg-blue-500/15 text-blue-600 border-blue-300",
  researcher:     "bg-emerald-500/15 text-emerald-600 border-emerald-300",
  marketer:       "bg-amber-500/15 text-amber-600 border-amber-300",
  pdo:            "bg-rose-500/15 text-rose-600 border-rose-300",
};

export const ROLE_ICONS = {
  platform_admin: "ShieldCheck",
  ngo_manager:    "Building2",
  researcher:     "Search",
  marketer:       "Megaphone",
  pdo:            "Lock",
};

export const ROLE_BANNERS = {
  platform_admin: { from: "#7c3aed", to: "#a78bfa", icon: "ShieldCheck" },
  ngo_manager:    { from: "#1d4ed8", to: "#60a5fa", icon: "Building2"  },
  researcher:     { from: "#059669", to: "#34d399", icon: "Search"     },
  marketer:       { from: "#d97706", to: "#fbbf24", icon: "Megaphone"  },
  pdo:            { from: "#e11d48", to: "#fb7185", icon: "Lock" },
};

/* ── Permission matrix ──────────────────────────────────────────────────── */

/**
 * Each role maps to an array of "resource:action" strings.
 *
 * Permissions are additive: a role has exactly the permissions listed.
 * The frontend uses these ONLY to show/hide UI elements.
 * The backend enforces the SAME rules via entity RLS policies.
 */
export const PERMISSIONS = {
  platform_admin: [
    "dashboard:view",
    "ngos:view", "ngos:create", "ngos:edit", "ngos:delete",
    "beneficiaries:view", "beneficiaries:create", "beneficiaries:edit",
    "beneficiaries:delete", "beneficiaries:import", "beneficiaries:export",
    "beneficiaries:archive",
    "marketers:view", "marketers:create", "marketers:edit", "marketers:delete",
    "users:view", "users:create", "users:edit", "users:delete",
    "settings:view", "settings:edit",
    "marketing:view",
    "researcher_workspace:view",
    "reports:view",
  ],
  ngo_manager: [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view", "beneficiaries:export",
    "marketers:view",
    "settings:view",
    "marketing:view",
    "reports:view",
  ],
  researcher: [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view", "beneficiaries:create", "beneficiaries:edit",
    "beneficiaries:import", "beneficiaries:archive",
    "settings:view",
    "researcher_workspace:view",
    "reports:view",
  ],
  marketer: [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view",
    "marketing:view",
    "marketers:view",
    "settings:view",
    "reports:view",
  ],
  pdo: [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view", "beneficiaries:delete", "beneficiaries:export",
    "settings:view",
    "reports:view",
  ],
};

/* ── Arabic denial messages (shown in UI when a button is hidden) ──────── */

export const DENIAL_MESSAGES = {
  "beneficiaries:delete": "حذف سجلات المستفيدين مقتصر على مسؤول حماية البيانات (PDO) وفق متطلبات الامتثال.",
  "beneficiaries:create": "ليس لديك صلاحية إضافة مستفيدين.",
  "beneficiaries:edit":   "ليس لديك صلاحية تعديل بيانات المستفيدين.",
  "beneficiaries:import": "ليس لديك صلاحية استيراد بيانات المستفيدين.",
  "settings:edit":        "إعدادات المنصة مقتصرة على مدير المنصة.",
  "users:view":           "إدارة المستخدمين مقتصرة على مدير المنصة.",
};

/* ── Aliases (used by <Can role="ADMIN"> for convenience) ───────────────── */

export const ROLE_ALIASES = {
  ADMIN:      "platform_admin",
  MANAGER:    "ngo_manager",
  RESEARCHER: "researcher",
  MARKETER:   "marketer",
  PDO:        "pdo",
};