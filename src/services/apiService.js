/**
 * @fileoverview Unified API Service — Mo'een Digital Platform
 *
 * THE SINGLE data-access layer for the entire frontend.
 * This is the ONLY file that imports MoeenCloudAdapter.
 *
 * All frontend components, domain services, hooks, and modals MUST call
 * functions exported from this file. No other file may import MoeenCloudAdapter
 * or the base44 SDK directly.
 *
 * ── HOW TO SWAP BACKENDS ──────────────────────────────────────────────────
 * 1. Create a new adapter (e.g. SupabaseAdapter, RESTAdapter, SQLAdapter)
 *    with the SAME method signatures as MoeenCloudAdapter.
 * 2. Change the single import below.
 * 3. Zero frontend changes required — every component already calls apiService.
 *
 * ── ERROR HANDLING ────────────────────────────────────────────────────────
 * All functions throw on failure. Components should catch errors and display
 * user-friendly Arabic messages via toast/alert — never raw technical errors.
 */

import MoeenCloudAdapter from "@/adapters/MoeenCloudAdapter";
import {
  mockGrowthSeries,
  mockPrioritySeries,
  mockStatusDistribution,
  mockNgos,
} from "@/lib/mockData";

// ═══════════════════════════════════════════════════════════════════════════
//  NGO — flat functions (backward‑compatible with Dashboard)
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchNGOs()                        { return MoeenCloudAdapter.ngo.getAll(); }
export async function createNGO(data)                    { return MoeenCloudAdapter.ngo.create(data); }
export async function updateNGO(id, data)                { return MoeenCloudAdapter.ngo.update(id, data); }
export async function deleteNGO(id)                      { return MoeenCloudAdapter.ngo.delete(id); }
export async function getNGOById(id)                     { return MoeenCloudAdapter.ngo.getById(id); }

// ═══════════════════════════════════════════════════════════════════════════
//  Beneficiary — flat functions (backward‑compatible with Dashboard)
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchBeneficiaries()               { return MoeenCloudAdapter.beneficiary.getAll(); }
export async function createBeneficiary(data)            { return MoeenCloudAdapter.beneficiary.create(data); }
export async function updateBeneficiary(id, data)        { return MoeenCloudAdapter.beneficiary.update(id, data); }
export async function deleteBeneficiary(id)              { return MoeenCloudAdapter.beneficiary.delete(id); }
export async function getBeneficiaryById(id)             { return MoeenCloudAdapter.beneficiary.getById(id); }

// ═══════════════════════════════════════════════════════════════════════════
//  Marketer — flat functions (backward‑compatible with Dashboard)
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchMarketers()                   { return MoeenCloudAdapter.marketer.getAll(); }
export async function createMarketer(data)               { return MoeenCloudAdapter.marketer.create(data); }
export async function updateMarketer(id, data)           { return MoeenCloudAdapter.marketer.update(id, data); }
export async function deleteMarketer(id)                 { return MoeenCloudAdapter.marketer.delete(id); }
export async function getMarketerById(id)                { return MoeenCloudAdapter.marketer.getById(id); }

// ═══════════════════════════════════════════════════════════════════════════
//  User — flat functions
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchUsers()                       { return MoeenCloudAdapter.user.getAll(); }
export async function updateUser(id, data)               { return MoeenCloudAdapter.user.update(id, data); }
export async function getUserMe()                        { return MoeenCloudAdapter.user.getMe(); }
export async function updateUserMe(data)                 { return MoeenCloudAdapter.user.updateMe(data); }
export async function inviteUser(email, role)            { return MoeenCloudAdapter.user.inviteUser(email, role); }

// ═══════════════════════════════════════════════════════════════════════════
//  Auth
// ═══════════════════════════════════════════════════════════════════════════

export async function authIsAuthenticated()              { return MoeenCloudAdapter.auth.isAuthenticated(); }
export async function authMe()                           { return MoeenCloudAdapter.auth.me(); }
export function authLogout(redirectUrl)                  { MoeenCloudAdapter.auth.logout(redirectUrl); }
export function authRedirectToLogin(nextUrl)             { MoeenCloudAdapter.auth.redirectToLogin(nextUrl); }
export async function authResetPasswordRequest(email)    { return MoeenCloudAdapter.auth.resetPasswordRequest(email); }

// ═══════════════════════════════════════════════════════════════════════════
//  Upload
// ═══════════════════════════════════════════════════════════════════════════

export async function uploadFile(file)                   { return MoeenCloudAdapter.uploadFile(file); }

// ═══════════════════════════════════════════════════════════════════════════
//  Dynamic entity access (for generic dialogs like ImportDialog)
// ═══════════════════════════════════════════════════════════════════════════

export async function entityBulkCreate(entityName, rows) { return MoeenCloudAdapter.entityBulkCreate(entityName, rows); }
export async function entityCreate(entityName, data)     { return MoeenCloudAdapter.entityCreate(entityName, data); }

// ═══════════════════════════════════════════════════════════════════════════
//  Repository‑pattern API objects (for domain‑service layer)
//  Each object has the exact shape BaseService expects: { getAll, getById, create, update, delete }
// ═══════════════════════════════════════════════════════════════════════════

export const ngoAPI = {
  getAll:   fetchNGOs,
  getById:  getNGOById,
  create:   createNGO,
  update:   updateNGO,
  delete:   deleteNGO,
};

export const beneficiaryAPI = {
  getAll:   fetchBeneficiaries,
  getById:  getBeneficiaryById,
  create:   createBeneficiary,
  update:   updateBeneficiary,
  delete:   deleteBeneficiary,
};

export const marketerAPI = {
  getAll:   fetchMarketers,
  getById:  getMarketerById,
  create:   createMarketer,
  update:   updateMarketer,
  delete:   deleteMarketer,
};

export const userAPI = {
  getAll:      fetchUsers,
  getById:     async (id) => { throw new Error("getById غير مدعوم للمستخدمين"); },
  create:      async ()  => { throw new Error("create غير مدعوم للمستخدمين"); },
  update:      updateUser,
  delete:      async ()  => { throw new Error("delete غير مدعوم للمستخدمين"); },
  getMe:       getUserMe,
  updateMe:    updateUserMe,
  inviteUser,
};

// ═══════════════════════════════════════════════════════════════════════════
//  Dashboard Analytics  (MOCK — replace with aggregate queries on swap)
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchGrowthSeries()       { return Promise.resolve(mockGrowthSeries); }
export async function fetchPrioritySeries()     { return Promise.resolve(mockPrioritySeries); }
export async function fetchStatusDistribution() { return Promise.resolve(mockStatusDistribution); }
export async function fetchTopNGOs()            { return Promise.resolve(mockNgos); }
// ── AuditLog ───────────────────────────────────────────────────────────
export async function fetchAuditLogs(params)       { return MoeenCloudAdapter.auditLog.getAll(params); }
export async function createAuditLog(data)         { return MoeenCloudAdapter.auditLog.create(data); }
export async function getAuditLogById(id)          { return MoeenCloudAdapter.auditLog.getById(id); }
export async function fetchAllAuditLogs(params)    { return MoeenCloudAdapter.auditLog.exportAll(params); }

// ── Notification ─────────────────────────────────────────────────────────
export async function fetchNotifications(params)       { return MoeenCloudAdapter.notification.getAll(params); }
export async function createNotification(data)         { return MoeenCloudAdapter.notification.create(data); }
export async function markNotificationRead(id)          { return MoeenCloudAdapter.notification.markRead(id); }
export async function markAllNotificationsRead()        { return MoeenCloudAdapter.notification.markAllRead(); }
export async function deleteNotification(id)            { return MoeenCloudAdapter.notification.delete(id); }

// ═══════════════════════════════════════════════════════════════════════════
//  Reporting Engine
// ═══════════════════════════════════════════════════════════════════════════

export async function generateReport(reportType, filters = {}, format = "json") {
  const { coreApi } = await import("@/api/coreClient");
  return coreApi.functions.invoke("generateReport", {
    report_type: reportType,
    filters,
    format,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//  Multi-Tenant — Tenant-aware data access
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch data scoped to a specific tenant (NGO).
 * RLS already enforces server-side isolation — this is for admin/PDO views
 * where they explicitly filter by tenant.
 */
export async function fetchTenantBeneficiaries(tenantId, params = {}) {
  const { coreApi } = await import("@/api/coreClient");
  const query = { ...params, ngo_id: tenantId };
  return coreApi.entities.Beneficiary.filter(query, "-created_date", 500, 0) ?? [];
}

export async function fetchTenantMarketers(tenantId, params = {}) {
  const { coreApi } = await import("@/api/coreClient");
  const query = { ...params, ngo_id: tenantId };
  return coreApi.entities.Marketer.filter(query, "-created_date", 500, 0) ?? [];
}

export async function fetchTenantUsers(tenantId, params = {}) {
  const { coreApi } = await import("@/api/coreClient");
  const query = { ...params, ngo_id: tenantId };
  return coreApi.entities.User.filter(query, "", 200, 0) ?? [];
}

export async function fetchTenantAuditLogs(tenantId, params = {}) {
  const { coreApi } = await import("@/api/coreClient");
  const query = { ...params, associationId: tenantId };
  return coreApi.entities.AuditLog.filter(query, "-created_date", 200, 0) ?? [];
}

/**
 * Verify tenant data isolation (security test).
 * Only accessible by platform_admin and pdo.
 */
export async function verifyTenantIsolation(tenantIds = []) {
  const { coreApi } = await import("@/api/coreClient");
  return coreApi.functions.invoke("verifyTenantIsolation", { tenant_ids: tenantIds });
}