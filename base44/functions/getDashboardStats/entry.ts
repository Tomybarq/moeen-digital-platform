/**
 * getDashboardStats — Lightweight aggregated dashboard data
 *
 * Replaces the old "fetch ALL records to frontend" pattern with
 * server‑side aggregation.  Returns ~2 KB instead of ~8 MB.
 *
 * Payload (optional):
 * {
 *   period: "week" | "month" | "quarter",
 *   region: "all" | city name,
 *   force_refresh: boolean   // bypass cache
 * }
 *
 * Cache:  ReportCache entity, report_type="dashboard_stats", TTL=5 min.
 */
import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

// Simple djb2 hash → 8-char hex (no external deps)
function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

// Fetch all records of an entity type (paginated, service role)
async function fetchAll(base44, entityName, query = {}) {
  const results = [];
  let skip = 0;
  const limit = 500;
  let batch;
  do {
    batch = await base44.asServiceRole.entities[entityName].filter(
      query, "-created_date", limit, skip
    );
    results.push(...batch);
    skip += limit;
  } while (batch.length === limit);
  return results;
}

// Cumulative growth series for last 6 months
function computeGrowthSeries(beneficiaries, ngos, marketers, researchers) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(
      now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999
    ).toISOString();
    months.push({ end: endOfMonth, label: AR_MONTHS[d.getMonth()] });
  }

  return months.map((m) => ({
    month: m.label,
    مستفيدون: beneficiaries.filter((b) => b.created_date && b.created_date <= m.end).length,
    منظمات: ngos.filter((n) => n.created_date && n.created_date <= m.end).length,
    باحثون: researchers.filter((r) => r.created_date && r.created_date <= m.end).length,
  }));
}

// Priority distribution per month (stacked‑bar chart) for last 6 months
function computePrioritySeries(beneficiaries) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = d.toISOString();
    const endOfMonth = new Date(
      now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999
    ).toISOString();
    months.push({ start: startOfMonth, end: endOfMonth, label: AR_MONTHS[d.getMonth()] });
  }

  return months.map((m) => {
    const inMonth = beneficiaries.filter((b) => {
      return b.created_date && b.created_date >= m.start && b.created_date <= m.end;
    });
    return {
      month: m.label,
      عاجل: inMonth.filter((b) => b.priority === "عاجل").length,
      مرتفع: inMonth.filter((b) => b.priority === "مرتفع").length,
      متوسط: inMonth.filter((b) => b.priority === "متوسط").length,
      منخفض: inMonth.filter((b) => b.priority === "منخفض").length,
    };
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload = {};
    try {
      payload = await req.json();
    } catch {
      /* use defaults */
    }

    const period = payload.period || "month";
    const region = payload.region || "all";
    const ngoScope =
      user.role === "ngo_manager" || user.role === "marketer"
        ? user.data?.ngo_id || null
        : null;
    const forceRefresh = payload.force_refresh === true;

    // ── Cache check ──────────────────────────────────────────
    const cacheKey = { period, region, ngoScope: ngoScope || "all" };
    const cacheHash = simpleHash(JSON.stringify(cacheKey));

    if (!forceRefresh) {
      const cacheNow = new Date().toISOString();
      try {
        const cached = await base44.entities.ReportCache.filter(
          {
            report_type: "dashboard_stats",
            filters_hash: cacheHash,
            expires_at: { $gt: cacheNow },
          },
          "-generated_at",
          1
        );
        if (cached.length > 0 && cached[0].payload) {
          const resp = Response.json({
            success: true,
            data: cached[0].payload,
            from_cache: true,
          });
          resp.headers.set("X-Cache", "HIT");
          return resp;
        }
      } catch (e) {
        console.warn("Dashboard cache lookup failed:", e.message);
      }
    }

    // ── Build queries ────────────────────────────────────────
    const beneficiaryQuery = {};
    if (ngoScope) beneficiaryQuery.ngo_id = ngoScope;
    if (region !== "all") beneficiaryQuery.city = region;

    const ngoQuery = { status: "active" };
    if (ngoScope) ngoQuery.id = ngoScope;

    const marketerQuery = { status: "active" };
    if (ngoScope) marketerQuery.ngo_id = ngoScope;

    // ── Fetch data ───────────────────────────────────────────
    const beneficiaries = await fetchAll(base44, "Beneficiary", beneficiaryQuery);
    const ngos = ngoScope
      ? await fetchAll(base44, "NGO", ngoQuery)
      : await fetchAll(base44, "NGO", { status: "active" });
    const marketers = await fetchAll(base44, "Marketer", marketerQuery);
    const allUsers = await fetchAll(base44, "User", {});
    const researchers = allUsers.filter((u) => u.role === "researcher");

    // ── Compute stats ────────────────────────────────────────
    const activeBeneficiaries = beneficiaries.filter(
      (b) => b.status !== "archived"
    );
    const urgentCases = activeBeneficiaries.filter(
      (b) => b.priority === "عاجل"
    ).length;
    const distinctResearchers = new Set(
      activeBeneficiaries
        .filter((b) => b.researcher_name)
        .map((b) => b.researcher_name)
    );

    // Top 5 NGOs by beneficiary count
    const ngoBenMap = {};
    for (const b of beneficiaries) {
      if (b.ngo_id) {
        ngoBenMap[b.ngo_id] = (ngoBenMap[b.ngo_id] || 0) + 1;
      }
    }
    const topNgos = ngos
      .map((n) => ({
        id: n.id,
        name: n.name,
        city: n.city || "",
        beneficiary_count: ngoBenMap[n.id] || 0,
      }))
      .sort((a, b) => b.beneficiary_count - a.beneficiary_count)
      .slice(0, 5);

    // Last 5 beneficiaries
    const recentBeneficiaries = [...beneficiaries]
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        full_name: b.full_name,
        city: b.city || "",
        case_type: b.case_type || "",
        priority: b.priority || "",
        researcher_name: b.researcher_name || "",
        status: b.status,
        created_date: b.created_date,
      }));

    // Status distribution
    const statusDist = { active: 0, archived: 0, supported: 0 };
    for (const b of beneficiaries) {
      const s = b.status || "active";
      if (statusDist[s] !== undefined) statusDist[s]++;
    }

    // Priority distribution (non‑archived only)
    const priorityDist = { عاجل: 0, مرتفع: 0, متوسط: 0, منخفض: 0 };
    for (const b of activeBeneficiaries) {
      const p = b.priority;
      if (priorityDist[p] !== undefined) priorityDist[p]++;
    }

    // Growth & priority series
    const growthByMonth = computeGrowthSeries(
      beneficiaries, ngos, marketers, researchers
    );
    const priorityByMonth = computePrioritySeries(beneficiaries);

    const data = {
      ngo_count: ngos.length,
      beneficiary_count: activeBeneficiaries.length,
      active_beneficiary_count: beneficiaries.filter(
        (b) => b.status === "active"
      ).length,
      urgent_cases_count: urgentCases,
      researcher_count: distinctResearchers.size,
      marketer_count: marketers.filter((m) => m.status === "active").length,
      recent_beneficiaries: recentBeneficiaries,
      top_ngos: topNgos,
      growth_by_month: growthByMonth,
      priority_by_month: priorityByMonth,
      status_distribution: statusDist,
      priority_distribution: priorityDist,
      generated_at: new Date().toISOString(),
    };

    // ── Save to cache (5 min TTL) ────────────────────────────
    const saveNow = new Date();
    const expiresAt = new Date(saveNow.getTime() + 5 * 60 * 1000);
    try {
      const existing = await base44.entities.ReportCache.filter({
        report_type: "dashboard_stats",
        filters_hash: cacheHash,
      });
      for (const c of existing) {
        await base44.entities.ReportCache.delete(c.id);
      }
      await base44.entities.ReportCache.create({
        report_type: "dashboard_stats",
        filters_hash: cacheHash,
        payload: data,
        generated_at: saveNow.toISOString(),
        expires_at: expiresAt.toISOString(),
        generated_by_id: user.id,
        record_count: beneficiaries.length,
      });

      // Opportunistic cleanup of all expired caches
      const expired = await base44.entities.ReportCache.filter({
        expires_at: { $lt: saveNow.toISOString() },
      });
      for (const c of expired) {
        await base44.entities.ReportCache.delete(c.id);
      }
    } catch (e) {
      console.warn("Dashboard stats cache save/cleanup failed:", e.message);
    }

    const resp = Response.json({ success: true, data });
    resp.headers.set("X-Cache", "MISS");
    return resp;
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});