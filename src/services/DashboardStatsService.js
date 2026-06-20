/**
 * Dashboard Stats Service
 *
 * Single entry point for aggregated dashboard data.
 * Calls the server‑side getDashboardStats function which
 * returns lightweight pre‑computed stats (~2 KB vs the old ~8 MB).
 */
import { coreApi } from "@/api/coreClient";

const DashboardStatsService = {
  /**
   * Fetch aggregated dashboard statistics.
   *
   * @param {object} filters — { period?: "week"|"month"|"quarter", region?: string }
   * @returns {Promise<object>} The stats object from the backend
   */
  async getStats(filters = {}) {
    const response = await coreApi.functions.invoke("getDashboardStats", {
      period: filters.period || "month",
      region: filters.region || "all",
    });

    if (response.data?.success) {
      return response.data.data;
    }

    if (response.data?.error) {
      throw new Error(response.data.error);
    }

    throw new Error("فشل جلب إحصائيات لوحة التحكم");
  },
};

export default DashboardStatsService;