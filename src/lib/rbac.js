/**
 * Role-Based Access Control (RBAC) for Mo'een Platform
 * Defines roles, Arabic labels, permissions, and helper utilities.
 */

export const ROLES = {
  PLATFORM_ADMIN:    "platform_admin",
  NGO_ADMIN:         "ngo_admin",
  SOCIAL_RESEARCHER: "social_researcher",
  MARKETER:          "marketer",
};

export const ROLE_LABELS = {
  platform_admin:    "مدير المنصة",
  ngo_admin:         "مدير المنظمة",
  social_researcher: "باحث اجتماعي",
  marketer:          "مسوّق",
};

export const ROLE_DESCRIPTIONS = {
  platform_admin:    "صلاحيات كاملة على جميع أقسام المنصة",
  ngo_admin:         "إدارة منظمة غير ربحية ومستفيديها",
  social_researcher: "البحث والمتابعة الميدانية للمستفيدين",
  marketer:          "إدارة الحملات التسويقية والترويجية",
};

export const ROLE_COLORS = {
  platform_admin:    "bg-purple-500/15 text-purple-600 border-purple-300",
  ngo_admin:         "bg-blue-500/15 text-blue-600 border-blue-300",
  social_researcher: "bg-emerald-500/15 text-emerald-600 border-emerald-300",
  marketer:          "bg-amber-500/15 text-amber-600 border-amber-300",
};

export const ROLE_ICONS = {
  platform_admin:    "ShieldCheck",
  ngo_admin:         "Building2",
  social_researcher: "Search",
  marketer:          "Megaphone",
};

/**
 * Permission matrix: role -> array of allowed resource:action pairs
 */
export const PERMISSIONS = {
  platform_admin: [
    "dashboard:view",
    "ngos:view", "ngos:create", "ngos:edit", "ngos:delete",
    "beneficiaries:view", "beneficiaries:create", "beneficiaries:edit", "beneficiaries:delete",
    "marketers:view", "marketers:create", "marketers:edit", "marketers:delete",
    "users:view", "users:create", "users:edit", "users:delete",
    "settings:view", "settings:edit",
  ],
  ngo_admin: [
    "dashboard:view",
    "ngos:view", "ngos:edit",
    "beneficiaries:view", "beneficiaries:create", "beneficiaries:edit",
    "marketers:view",
    "settings:view",
  ],
  social_researcher: [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view", "beneficiaries:create", "beneficiaries:edit",
    "settings:view",
  ],
  marketer: [
    "dashboard:view",
    "marketers:view", "marketers:create", "marketers:edit",
    "ngos:view",
    "settings:view",
  ],
};

/**
 * Check if a user has a specific permission.
 * @param {object} user - The user object with a `role` field.
 * @param {string} permission - e.g. "beneficiaries:create"
 * @returns {boolean}
 */
export function hasPermission(user, permission) {
  if (!user?.role) return false;
  return PERMISSIONS[user.role]?.includes(permission) ?? false;
}

/**
 * Check if a user has at least one of the listed roles.
 * @param {object} user
 * @param {string[]} roles
 * @returns {boolean}
 */
export function hasRole(user, roles) {
  return roles.includes(user?.role);
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] ?? role;
}

export function getRoleColor(role) {
  return ROLE_COLORS[role] ?? "bg-muted text-muted-foreground border-border";
}