/**
 * Moeen Cloud Adapter — Mo'een Digital Platform
 *
 * Wraps ALL Cloud API calls behind a standardised interface.
 * Pages never import the SDK directly — they go through services,
 * which call this adapter, which calls coreApi.
 *
 * To swap backends, replace this adapter with SupabaseAdapter,
 * FirebaseAdapter, or RestAdapter. The service layer stays untouched.
 */
import { coreApi } from "@/api/coreClient";

const MoeenCloudAdapter = {
  /* ── NGO ─────────────────────────────────── */
  ngo: {
    async getAll() {
      const result = await coreApi.entities.NGO.list("-created_date");
      return result ?? [];
    },
    async getById(id) {
      return coreApi.entities.NGO.get(id);
    },
    async create(data) {
      return coreApi.entities.NGO.create(data);
    },
    async update(id, data) {
      return coreApi.entities.NGO.update(id, data);
    },
    async delete(id) {
      return coreApi.entities.NGO.delete(id);
    },
  },

  /* ── Beneficiary ──────────────────────────── */
  beneficiary: {
    async getAll() {
      const result = await coreApi.entities.Beneficiary.list("-created_date");
      return result ?? [];
    },
    async getById(id) {
      return coreApi.entities.Beneficiary.get(id);
    },
    async create(data) {
      return coreApi.entities.Beneficiary.create(data);
    },
    async update(id, data) {
      return coreApi.entities.Beneficiary.update(id, data);
    },
    async delete(id) {
      return coreApi.entities.Beneficiary.delete(id);
    },
  },

  /* ── Marketer ─────────────────────────────── */
  marketer: {
    async getAll() {
      const result = await coreApi.entities.Marketer.list("-created_date");
      return result ?? [];
    },
    async getById(id) {
      return coreApi.entities.Marketer.get(id);
    },
    async create(data) {
      return coreApi.entities.Marketer.create(data);
    },
    async update(id, data) {
      return coreApi.entities.Marketer.update(id, data);
    },
    async delete(id) {
      return coreApi.entities.Marketer.delete(id);
    },
  },

  /* ── AuditLog ─────────────────────────────── */
  auditLog: {
    async create(data) {
      return coreApi.functions.invoke("logAudit", data);
    },
    async getAll(params = {}) {
      const { sort = "-created_date", limit = 100, skip = 0, query = {} } = params;
      const result = await coreApi.entities.AuditLog.filter(query, sort, limit, skip);
      return result ?? [];
    },
    async getById(id) {
      return coreApi.entities.AuditLog.get(id);
    },
    async exportAll(params = {}) {
      const { query = {}, sort = "-created_date" } = params;
      const results = [];
      let skip = 0;
      const limit = 500;
      let batch;
      do {
        batch = await coreApi.entities.AuditLog.filter(query, sort, limit, skip);
        results.push(...batch);
        skip += limit;
      } while (batch.length === limit);
      return results;
    },
  },

  /* ── Notification ─────────────────────────── */
  notification: {
    async getAll({ skip = 0, limit = 50, sort = "-created_date", query = {} } = {}) {
      const result = await coreApi.entities.Notification.filter(query, sort, limit, skip);
      return result ?? [];
    },
    async create(data) {
      return coreApi.entities.Notification.create(data);
    },
    async markRead(id) {
      return coreApi.entities.Notification.update(id, { is_read: true });
    },
    async markAllRead() {
      const unread = await coreApi.entities.Notification.filter({ is_read: false }, "-created_date", 500, 0);
      for (const notification of unread) {
        await coreApi.entities.Notification.update(notification.id, { is_read: true });
      }
    },
    async delete(id) {
      return coreApi.entities.Notification.delete(id);
    },
  },

  /* ── User ─────────────────────────────────── */
  user: {
    async getAll() {
      const result = await coreApi.entities.User.list("-created_date");
      return result ?? [];
    },
    async getMe() {
      return coreApi.auth.me();
    },
    async update(id, data) {
      return coreApi.entities.User.update(id, data);
    },
    async updateMe(data) {
      return coreApi.auth.updateMe(data);
    },
    async inviteUser(email, role) {
      return coreApi.users.inviteUser(email, role);
    },
  },

  /* ── Dynamic entity access (for generic dialogs like ImportDialog) ── */
  async entityBulkCreate(entityName, rows) {
    return coreApi.entities[entityName].bulkCreate(rows);
  },
  async entityCreate(entityName, data) {
    return coreApi.entities[entityName].create(data);
  },

  /* ── Upload (non-entity) ───────────────────── */
  async uploadFile(file) {
    return coreApi.integrations.Core.UploadFile({ file });
  },

  /* ── Auth ─────────────────────────────────── */
  auth: {
    async me() {
      return coreApi.auth.me();
    },
    async isAuthenticated() {
      return coreApi.auth.isAuthenticated();
    },
    async updateMe(data) {
      return coreApi.auth.updateMe(data);
    },
    logout(redirectUrl) {
      coreApi.auth.logout(redirectUrl);
    },
    redirectToLogin(nextUrl) {
      coreApi.auth.redirectToLogin(nextUrl);
    },
    async resetPasswordRequest(email) {
      return coreApi.auth.resetPasswordRequest(email);
    },
  },

  /* ── Integrations ─────────────────────────── */
  integrations: {
    async invokeLLM(params) {
      return coreApi.integrations.Core.InvokeLLM(params);
    },
  },
};

export default MoeenCloudAdapter;