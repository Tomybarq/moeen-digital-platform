/**
 * NGO Domain Service — Mo'een Digital Platform
 *
 * Orchestrates all NGO operations. The UI never touches the adapter
 * or SDK directly — it only calls methods on this service.
 *
 * To swap backends, change the import from:
 *   import Base44Adapter from "@/adapters/Base44Adapter";
 * to:
 *   import SupabaseAdapter from "@/adapters/SupabaseAdapter";
 *
 * This file stays identical.
 */
import { ngoAPI } from "@/services/apiService";
import BaseService from "@/services/baseService";

const ngoAdapter = ngoAPI;

class NGOServiceClass extends BaseService {
  constructor() {
    super(ngoAdapter, "المنظمة");
  }

  /** Toggle between active and archived */
  async toggleArchive(id, currentStatus) {
    const next = currentStatus === "archived" ? "active" : "archived";
    return this.update(id, { status: next });
  }
}

const NGOService = new NGOServiceClass();
export default NGOService;