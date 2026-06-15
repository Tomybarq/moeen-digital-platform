/**
 * @fileoverview Unified API Service — Mo'een Digital Platform
 *
 * THE SINGLE data-access layer for the entire frontend.
 * This is the ONLY file that imports Base44Adapter.
 *
 * All frontend components, domain services, hooks, and modals MUST call
 * functions exported from this file. No other file may import Base44Adapter
 * or the base44 SDK directly.
 *
 * ── HOW TO SWAP BACKENDS ──────────────────────────────────────────────────
 * 1. Create a new adapter (e.g. SupabaseAdapter, RESTAdapter, SQLAdapter)
 *    with the SAME method signatures as Base44Adapter.
 * 2. Change the single import below.
 * 3. Zero frontend changes required — every component already calls apiService.
 *
 * ── ERROR HANDLING ────────────────────────────────────────────────────────
 * All functions throw on failure. Components should catch errors and display
 * user-friendly Arabic messages via toast/alert — never raw technical errors.
 */

import Base44Adapter from "@/adapters/Base44Adapter";
import {
  mockGrowthSeries,
  mockPrioritySeries,
  mockStatusDistribution,
  mockNgos,
  mockAuditLogs,
} from "@/lib/mockData";

// ═══════════════════════════════════════════════════════════════════════════
//  NGO — flat functions (backward‑compatible with Dashboard)
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchNGOs()                        { return Base44Adapter.ngo.getAll(); }
export async function createNGO(data)                    { return Base44Adapter.ngo.create(data); }
export async function updateNGO(id, data)                { return Base44Adapter.ngo.update(id, data); }
export async function deleteNGO(id)                      { return Base44Adapter.ngo.delete(id); }
export async function getNGOById(id)                     { return Base44Adapter.ngo.getById(id); }

// ═══════════════════════════════════════════════════════════════════════════
//  Beneficiary — flat functions (backward‑compatible with Dashboard)
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchBeneficiaries()               { return Base44Adapter.beneficiary.getAll(); }
export async function createBeneficiary(data)            { return Base44Adapter.beneficiary.create(data); }
export async function updateBeneficiary(id, data)        { return Base44Adapter.beneficiary.update(id, data); }
export async function deleteBeneficiary(id)              { return Base44Adapter.beneficiary.delete(id); }
export async function getBeneficiaryById(id)             { return Base44Adapter.beneficiary.getById(id); }

// ═══════════════════════════════════════════════════════════════════════════
//  Marketer — flat functions (backward‑compatible with Dashboard)
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchMarketers()                   { return Base44Adapter.marketer.getAll(); }
export async function createMarketer(data)               { return Base44Adapter.marketer.create(data); }
export async function updateMarketer(id, data)           { return Base44Adapter.marketer.update(id, data); }
export async function deleteMarketer(id)                 { return Base44Adapter.marketer.delete(id); }
export async function getMarketerById(id)                { return Base44Adapter.marketer.getById(id); }

// ═══════════════════════════════════════════════════════════════════════════
//  User — flat functions
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchUsers()                       { return Base44Adapter.user.getAll(); }
export async function updateUser(id, data)               { return Base44Adapter.user.update(id, data); }
export async function getUserMe()                        { return Base44Adapter.user.getMe(); }
export async function updateUserMe(data)                 { return Base44Adapter.user.updateMe(data); }
export async function inviteUser(email, role)            { return Base44Adapter.user.inviteUser(email, role); }

// ═══════════════════════════════════════════════════════════════════════════
//  Auth
// ═══════════════════════════════════════════════════════════════════════════

export async function authIsAuthenticated()              { return Base44Adapter.auth.isAuthenticated(); }
export async function authMe()                           { return Base44Adapter.auth.me(); }
export function authLogout(redirectUrl)                  { Base44Adapter.auth.logout(redirectUrl); }
export function authRedirectToLogin(nextUrl)             { Base44Adapter.auth.redirectToLogin(nextUrl); }
export async function authResetPasswordRequest(email)    { return Base44Adapter.auth.resetPasswordRequest(email); }

// ═══════════════════════════════════════════════════════════════════════════
//  Upload
// ═══════════════════════════════════════════════════════════════════════════

export async function uploadFile(file)                   { return Base44Adapter.uploadFile(file); }

// ═══════════════════════════════════════════════════════════════════════════
//  Dynamic entity access (for generic dialogs like ImportDialog)
// ═══════════════════════════════════════════════════════════════════════════

export async function entityBulkCreate(entityName, rows) { return Base44Adapter.entityBulkCreate(entityName, rows); }
export async function entityCreate(entityName, data)     { return Base44Adapter.entityCreate(entityName, data); }

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
export async function fetchAuditLogs()          { return Promise.resolve(mockAuditLogs); }