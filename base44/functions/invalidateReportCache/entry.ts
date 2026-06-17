/**
 * invalidateReportCache — Purges stale or targeted cache entries
 *
 * Payload (optional):
 * {
 *   report_type?: string  — if provided, deletes ALL entries for that report type;
 *                           otherwise, only deletes expired entries (expires_at < now)
 * }
 *
 * Returns: { success: true, deleted_count: number }
 */
import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "platform_admin" && user.role !== "ngo_manager") {
      return Response.json({ error: "Forbidden: admin or NGO manager required" }, { status: 403 });
    }

    let payload;
    try {
      payload = await req.json();
    } catch {
      payload = {};
    }

    const reportType = payload.report_type || null;
    const now = new Date().toISOString();
    let deletedCount = 0;

    if (reportType) {
      // Delete ALL cache entries for the specified report type (both fresh and expired)
      const entries = await base44.asServiceRole.entities.ReportCache.filter({
        report_type: reportType,
      });
      for (const c of entries) {
        await base44.asServiceRole.entities.ReportCache.delete(c.id);
        deletedCount++;
      }
    } else {
      // Cleanup only expired entries across all report types
      const expired = await base44.asServiceRole.entities.ReportCache.filter({
        expires_at: { $lt: now },
      });
      for (const c of expired) {
        await base44.asServiceRole.entities.ReportCache.delete(c.id);
        deletedCount++;
      }
    }

    return Response.json({ success: true, deleted_count: deletedCount });
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});