/**
 * Base44 Backend Adapter — Mo'een Digital Platform
 *
 * Wraps ALL Base44 SDK calls behind a standardized interface.
 * Pages never import base44 directly — they go through services,
 * which call this adapter, which calls the SDK.
 *
 * To swap backends, replace this adapter with SupabaseAdapter,
 * FirebaseAdapter, or RestAdapter. The service layer stays untouched.
 */
import { base44 } from "@/api/base44Client";

const Base44Adapter = {
  /* ── NGO ─────────────────────────────────── */
  ngo: {
    async getAll() {
      const result = await base44.entities.NGO.list("-created_date");
      return result ?? [];
    },
    async getById(id) {
      return base44.entities.NGO.get(id);
    },
    async create(data) {
      return base44.entities.NGO.create(data);
    },
    async update(id, data) {
      return base44.entities.NGO.update(id, data);
    },
    async delete(id) {
      return base44.entities.NGO.delete(id);
    },
  },

  /* ── Beneficiary ──────────────────────────── */
  beneficiary: {
    async getAll() {
      const result = await base44.entities.Beneficiary.list("-created_date");
      return result ?? [];
    },
    async getById(id) {
      return base44.entities.Beneficiary.get(id);
    },
    async create(data) {
      return base44.entities.Beneficiary.create(data);
    },
    async update(id, data) {
      return base44.entities.Beneficiary.update(id, data);
    },
    async delete(id) {
      return base44.entities.Beneficiary.delete(id);
    },
  },

  /* ── Marketer ─────────────────────────────── */
  marketer: {
    async getAll() {
      const result = await base44.entities.Marketer.list("-created_date");
      return result ?? [];
    },
    async getById(id) {
      return base44.entities.Marketer.get(id);
    },
    async create(data) {
      return base44.entities.Marketer.create(data);
    },
    async update(id, data) {
      return base44.entities.Marketer.update(id, data);
    },
    async delete(id) {
      return base44.entities.Marketer.delete(id);
    },
  },

  /* ── User ─────────────────────────────────── */
  user: {
    async getAll() {
      const result = await base44.entities.User.list("-created_date");
      return result ?? [];
    },
    async getMe() {
      return base44.auth.me();
    },
    async updateMe(data) {
      return base44.auth.updateMe(data);
    },
    async inviteUser(email, role) {
      return base44.users.inviteUser(email, role);
    },
  },

  /* ── Auth ─────────────────────────────────── */
  auth: {
    async isAuthenticated() {
      return base44.auth.isAuthenticated();
    },
    logout(redirectUrl) {
      base44.auth.logout(redirectUrl);
    },
    redirectToLogin(nextUrl) {
      base44.auth.redirectToLogin(nextUrl);
    },
  },

  /* ── Integrations ─────────────────────────── */
  integrations: {
    async uploadFile(file) {
      return base44.integrations.Core.UploadFile({ file });
    },
    async invokeLLM(params) {
      return base44.integrations.Core.InvokeLLM(params);
    },
  },
};

export default Base44Adapter;