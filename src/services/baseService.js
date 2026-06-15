/**
 * Base Service — Mo'een Digital Platform
 *
 * Every domain service extends this class. It provides:
 *  - Simulated latency (configurable per environment)
 *  - Consistent interface: getAll, getById, create, update, delete, archive, restore
 *  - Error wrapping with Arabic messages
 *
 * Subclasses only define the adapter reference and entity name.
 */
import { simulateLatency } from "@/config";

export default class BaseService {
  /** @param {object} adapter  — a domain adapter (e.g. Adapter.ngo) */
  /** @param {string} entityName — for error messages (e.g. "المنظمة") */
  constructor(adapter, entityName) {
    this.adapter = adapter;
    this.entityName = entityName;
  }

  async getAll() {
    await simulateLatency();
    return this.adapter.getAll();
  }

  async getById(id) {
    await simulateLatency();
    if (!id) throw new Error(`معرّف ${this.entityName} غير صالح`);
    return this.adapter.getById(id);
  }

  async create(data) {
    await simulateLatency();
    if (!data || typeof data !== "object") {
      throw new Error(`بيانات ${this.entityName} غير صالحة`);
    }
    return this.adapter.create(data);
  }

  async update(id, data) {
    await simulateLatency();
    if (!id) throw new Error(`معرّف ${this.entityName} غير صالح`);
    return this.adapter.update(id, data);
  }

  async delete(id) {
    await simulateLatency();
    if (!id) throw new Error(`معرّف ${this.entityName} غير صالح`);
    return this.adapter.delete(id);
  }

  async archive(id) {
    return this.update(id, { status: "archived" });
  }

  async restore(id) {
    return this.update(id, { status: "active" });
  }
}