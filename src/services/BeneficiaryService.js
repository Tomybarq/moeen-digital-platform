/**
 * Beneficiary Domain Service — Mo'een Digital Platform
 *
 * All beneficiary CRUD operations go through this service.
 * The UI never touches the adapter or SDK directly.
 */
import { beneficiaryAPI } from "@/services/apiService";
import BaseService from "@/services/baseService";

const beneficiaryAdapter = beneficiaryAPI;

class BeneficiaryServiceClass extends BaseService {
  constructor() {
    super(beneficiaryAdapter, "المستفيد");
  }

  /** Toggle between active and archived */
  async toggleArchive(id, currentStatus) {
    const next = currentStatus === "archived" ? "active" : "archived";
    return this.update(id, { status: next });
  }
}

const BeneficiaryService = new BeneficiaryServiceClass();
export default BeneficiaryService;