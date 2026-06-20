/**
 * generateReport — Reporting Engine for Mo'een Digital Platform
 *
 * Fetches and aggregates data from multiple entities to produce
 * structured reports. Supports PDF/CSV/JSON output formats.
 *
 * Payload:
 * {
 *   report_type: "ngo_performance" | "beneficiary_distribution" | "marketing_effectiveness" | "platform_activity" | "financial_overview",
 *   filters: { ngo_id?, city?, case_type?, priority?, status?, date_from?, date_to? },
 *   format: "json" | "csv"
 * }
 */

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

const REPORT_TYPES = [
  "ngo_performance",
  "beneficiary_distribution",
  "marketing_effectiveness",
  "platform_activity",
  "financial_overview",
];

// Simple djb2 hash → 8-char hex for cache keys (no external deps)
function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "platform_admin") {
      return Response.json({ error: "Moeen Cloud Engine: Unauthorized Access" }, { status: 403 });
    }

    let payload;
    try {
      payload = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const reportType = payload.report_type;
    const filters = payload.filters || {};
    const format = payload.format || "json";
    const forceRefresh = payload.force_refresh === true;

    if (!reportType || !REPORT_TYPES.includes(reportType)) {
      return Response.json(
        { error: `Invalid report_type. Must be one of: ${REPORT_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // ── Cache check (skip if force_refresh) ────────────────────
    let cacheFilterHash = "";
    if (!forceRefresh) {
      cacheFilterHash = simpleHash(JSON.stringify({ report_type: reportType, ...filters }));
      const cacheNow = new Date().toISOString();
      try {
        const cached = await base44.asServiceRole.entities.ReportCache.filter({
          report_type: reportType,
          filters_hash: cacheFilterHash,
          expires_at: { $gt: cacheNow },
        }, "-generated_at", 1);
        if (cached.length > 0 && cached[0].payload) {
          const cacheAge = Math.round((Date.now() - new Date(cached[0].generated_at).getTime()) / 1000);
          const resp = Response.json({ success: true, data: cached[0].payload, from_cache: true });
          resp.headers.set("X-Cache", "HIT");
          resp.headers.set("X-Cache-Age", String(cacheAge));
          return resp;
        }
      } catch (e) {
        console.warn("ReportCache query failed, falling through to fresh generation:", e.message);
      }
    }

    // Resolve NGO scope for ngo_manager / marketer roles
    let ngoScopeId = filters.ngo_id || null;
    if (user.role === "ngo_manager" || user.role === "marketer") {
      const me = await base44.auth.me();
      ngoScopeId = me.ngo_id || ngoScopeId;
    }

    // Build date filter for entity queries
    const dateFilter = {};
    if (filters.date_from || filters.date_to) {
      if (filters.date_from) {
        dateFilter.created_date = { $gte: filters.date_from };
      }
      if (filters.date_to) {
        dateFilter.created_date = {
          ...(dateFilter.created_date || {}),
          $lte: filters.date_to,
        };
      }
    }

    // Helper: fetch all records of an entity type (paginated)
    async function fetchAll(entityName, extraFilter = {}) {
      const query = { ...dateFilter, ...extraFilter };
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

    let data = {};
    let csvHeaders = [];
    let csvRows = [];

    switch (reportType) {

      // ── NGO Performance ──────────────────────────────────────
      case "ngo_performance": {
        const beneficiaries = await fetchAll("Beneficiary");
        const ngos = await fetchAll("NGO");
        const ngoMap = {};
        for (const n of ngos) {
          ngoMap[n.id] = { name: n.name, city: n.city, category: n.category, total: 0, active: 0, archived: 0, supported: 0 };
        }

        for (const b of beneficiaries) {
          const ngoId = b.ngo_id;
          if (!ngoId) continue;
          if (!ngoMap[ngoId]) {
            ngoMap[ngoId] = { name: b.ngo_name || ngoId, city: "", category: "", total: 0, active: 0, archived: 0, supported: 0 };
          }
          ngoMap[ngoId].total++;
          if (b.status === "active") ngoMap[ngoId].active++;
          else if (b.status === "archived") ngoMap[ngoId].archived++;
          else if (b.status === "supported") ngoMap[ngoId].supported++;
        }

        const rows = Object.entries(ngoMap)
          .map(([id, info]) => ({ id, ...info }))
          .sort((a, b) => b.total - a.total);

        data = { report_type: reportType, title: "تقرير أداء المنظمات", rows, summary: { total_ngos: rows.length, total_beneficiaries: rows.reduce((s, r) => s + r.total, 0) } };
        csvHeaders = ["المنظمة", "المدينة", "التصنيف", "إجمالي المستفيدين", "نشط", "مؤرشفة", "مدعوم"];
        csvRows = rows.map(r => [r.name, r.city, r.category, r.total, r.active, r.archived, r.supported]);
        break;
      }

      // ── Beneficiary Distribution ────────────────────────────
      case "beneficiary_distribution": {
        const beneficiaries = await fetchAll(
          "Beneficiary",
          ngoScopeId ? { ngo_id: ngoScopeId } : {}
        );

        // Apply additional filters
        let filtered = beneficiaries;
        if (filters.city) filtered = filtered.filter(b => b.city === filters.city);
        if (filters.case_type) filtered = filtered.filter(b => b.case_type === filters.case_type);
        if (filters.priority) filtered = filtered.filter(b => b.priority === filters.priority);
        if (filters.status) filtered = filtered.filter(b => b.status === filters.status);

        const byCity = groupBy(filtered, "city");
        const byCaseType = groupBy(filtered, "case_type");
        const byPriority = groupBy(filtered, "priority");
        const byStatus = groupBy(filtered, "status");
        const byIncomeLevel = groupBy(filtered, "income_level");
        const byGender = groupBy(filtered, "gender");

        data = {
          report_type: reportType,
          title: "تقرير توزيع المستفيدين",
          summary: { total: filtered.length },
          byCity,
          byCaseType,
          byPriority,
          byStatus,
          byIncomeLevel,
          byGender,
        };
        csvHeaders = ["المدينة", "نوع الحالة", "الأولوية", "الحالة", "مستوى الدخل", "الجنس", "العدد"];
        // Cross-tab: flatten all combos
        for (const city of Object.keys(byCity)) {
          csvRows.push([city, "", "", "", "", "", byCity[city]]);
        }
        for (const ct of Object.keys(byCaseType)) {
          csvRows.push(["", ct, "", "", "", "", byCaseType[ct]]);
        }
        for (const pr of Object.keys(byPriority)) {
          csvRows.push(["", "", pr, "", "", "", byPriority[pr]]);
        }
        for (const st of Object.keys(byStatus)) {
          csvRows.push(["", "", "", st, "", "", byStatus[st]]);
        }
        break;
      }

      // ── Marketing Effectiveness ─────────────────────────────
      case "marketing_effectiveness": {
        const marketers = await fetchAll(
          "Marketer",
          ngoScopeId ? { ngo_id: ngoScopeId } : {}
        );
        const allBeneficiaries = await fetchAll("Beneficiary");

        const ngoBeneficiaryCount = {};
        for (const b of allBeneficiaries) {
          const nid = b.ngo_id;
          if (nid) ngoBeneficiaryCount[nid] = (ngoBeneficiaryCount[nid] || 0) + 1;
        }

        const rows = marketers.map(m => ({
          id: m.id,
          name: m.full_name,
          ngo_name: m.ngo_name,
          specialization: m.specialization,
          campaigns_count: m.campaigns_count || 0,
          beneficiary_count: ngoBeneficiaryCount[m.ngo_id] || 0,
          status: m.status,
          city: m.city,
        })).sort((a, b) => b.beneficiary_count - a.beneficiary_count);

        data = {
          report_type: reportType,
          title: "تقرير فعالية التسويق",
          rows,
          summary: {
            total_marketers: rows.length,
            active_marketers: rows.filter(r => r.status === "active").length,
            total_campaigns: rows.reduce((s, r) => s + r.campaigns_count, 0),
          },
        };
        csvHeaders = ["المسوّق", "المنظمة", "التخصص", "الحملات", "المستفيدين", "الحالة", "المدينة"];
        csvRows = rows.map(r => [r.name, r.ngo_name, r.specialization, r.campaigns_count, r.beneficiary_count, r.status, r.city]);
        break;
      }

      // ── Platform Activity ───────────────────────────────────
      case "platform_activity": {
        const users = await fetchAll("User");
        const auditLogs = await fetchAll("AuditLog");
        const ngosAll = await fetchAll("NGO");
        const beneficiariesAll = await fetchAll("Beneficiary");

        const usersByRole = groupBy(users, "role");
        const auditByType = groupBy(auditLogs, "event_type");
        const auditByResource = groupBy(auditLogs, "resource_type");

        // Recent activity timeline
        const recentActivity = auditLogs
          .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
          .slice(0, 50)
          .map(a => ({
            event_type: a.event_type,
            resource_type: a.resource_type,
            resource_label: a.resource_label,
            user_role: a.user_role,
            created_date: a.created_date,
          }));

        data = {
          report_type: reportType,
          title: "تقرير نشاط المنصة",
          summary: {
            total_users: users.length,
            total_ngos: ngosAll.length,
            total_beneficiaries: beneficiariesAll.length,
            total_audit_logs: auditLogs.length,
          },
          usersByRole,
          auditByType,
          auditByResource,
          recentActivity,
        };
        csvHeaders = ["نوع الحدث", "نوع المورد", "تصنيف المورد", "دور المستخدم", "التاريخ"];
        csvRows = recentActivity.map(a => [a.event_type, a.resource_type, a.resource_label || "", a.user_role || "", a.created_date]);
        break;
      }

      // ── Financial Overview ──────────────────────────────────
      case "financial_overview": {
        const beneficiaries = await fetchAll(
          "Beneficiary",
          ngoScopeId ? { ngo_id: ngoScopeId } : {}
        );

        let filtered = beneficiaries;
        if (filters.city) filtered = filtered.filter(b => b.city === filters.city);

        const incomeLevelBreakdown = groupBy(filtered, "income_level");
        const incomeRanges = calculateIncomeStats(filtered);
        const expenseRanges = calculateExpenseStats(filtered);
        const netIncomeRanges = calculateNetIncomeStats(filtered);

        data = {
          report_type: reportType,
          title: "تقرير الوضع المالي للمستفيدين",
          summary: { total_beneficiaries: filtered.length },
          incomeLevelBreakdown,
          incomeStats: incomeRanges,
          expenseStats: expenseRanges,
          netIncomeStats: netIncomeRanges,
        };
        csvHeaders = ["مستوى الدخل", "عدد المستفيدين", "متوسط الدخل", "متوسط المصروفات", "متوسط صافي الدخل"];
        for (const level of Object.keys(incomeLevelBreakdown)) {
          const count = incomeLevelBreakdown[level];
          const avgIncome = incomeRanges.byLevel?.[level]?.average || 0;
          const avgExpense = expenseRanges.byLevel?.[level]?.average || 0;
          const avgNet = netIncomeRanges.byLevel?.[level]?.average || 0;
          csvRows.push([level, count, avgIncome, avgExpense, avgNet]);
        }
        break;
      }

      default:
        return Response.json({ error: "Unknown report type" }, { status: 400 });
    }

    // ── Save to cache ─────────────────────────────────────────
    const saveHash = cacheFilterHash || simpleHash(JSON.stringify({ report_type: reportType, ...filters }));
    const saveNow = new Date();
    const expiresAt = new Date(saveNow.getTime() + 15 * 60 * 1000);
    try {
      // Upsert: remove old entries for this report_type + hash, then create fresh
      const existing = await base44.asServiceRole.entities.ReportCache.filter({
        report_type: reportType,
        filters_hash: saveHash,
      });
      for (const c of existing) {
        await base44.asServiceRole.entities.ReportCache.delete(c.id);
      }
      await base44.asServiceRole.entities.ReportCache.create({
        report_type: reportType,
        filters_hash: saveHash,
        payload: data,
        generated_at: saveNow.toISOString(),
        expires_at: expiresAt.toISOString(),
        generated_by_id: user.id,
        record_count: data?.summary?.total_beneficiaries || data?.summary?.total || data?.rows?.length || 0,
      });

      // Opportunistic cleanup of all expired caches
      const expired = await base44.asServiceRole.entities.ReportCache.filter({
        expires_at: { $lt: saveNow.toISOString() },
      });
      for (const c of expired) {
        await base44.asServiceRole.entities.ReportCache.delete(c.id);
      }
    } catch (e) {
      console.warn("ReportCache save/cleanup failed:", e.message);
    }

    // ── Format output ─────────────────────────────────────────
    if (format === "csv") {
      const bom = "\uFEFF"; // BOM for Arabic Excel compatibility
      const csvContent = [bom + csvHeaders.join(","), ...csvRows.map(r => r.map(c => `"${String(c || "").replace(/"/g, '""')}"`).join(","))].join("\n");
      const csvResp = new Response(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${reportType}_report.csv"`,
          "X-Cache": "MISS",
        },
      });
      return csvResp;
    }

    const resp = Response.json({ success: true, data, csvHeaders, csvRows });
    resp.headers.set("X-Cache", "MISS");
    return resp;
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});

/* ── Utility helpers ────────────────────────────────── */

function groupBy(arr, key) {
  const result = {};
  for (const item of arr) {
    const val = item[key] || "غير محدد";
    result[val] = (result[val] || 0) + 1;
  }
  return result;
}

function calculateIncomeStats(beneficiaries) {
  const totals = { total_income: 0, salary: 0, social_security: 0, citizen_account: 0, rehab: 0, other_ngos: 0, count: 0 };
  const byLevel = {};

  for (const b of beneficiaries) {
    totals.count++;
    totals.total_income += b.total_income || 0;
    totals.salary += b.income_salary || 0;
    totals.social_security += b.income_social_security || 0;
    totals.citizen_account += b.income_account_citizen || 0;
    totals.rehab += b.income_rehab || 0;
    totals.other_ngos += b.income_other_ngos || 0;

    const level = b.income_level || "غير محدد";
    if (!byLevel[level]) byLevel[level] = { total: 0, count: 0 };
    byLevel[level].total += b.total_income || 0;
    byLevel[level].count++;
  }

  for (const level of Object.keys(byLevel)) {
    byLevel[level].average = byLevel[level].count ? Math.round(byLevel[level].total / byLevel[level].count) : 0;
  }

  return { ...totals, average: totals.count ? Math.round(totals.total_income / totals.count) : 0, byLevel };
}

function calculateExpenseStats(beneficiaries) {
  const totals = { total_expenses: 0, rent: 0, electricity: 0, water: 0, internet: 0, medical: 0, transport: 0, food: 0, debt: 0, count: 0 };
  const byLevel = {};

  for (const b of beneficiaries) {
    totals.count++;
    totals.total_expenses += b.total_expenses || 0;
    totals.rent += b.expense_rent || 0;
    totals.electricity += b.expense_electricity || 0;
    totals.water += b.expense_water || 0;
    totals.internet += b.expense_internet || 0;
    totals.medical += b.expense_medical || 0;
    totals.transport += b.expense_transport || 0;
    totals.food += b.expense_food || 0;
    totals.debt += b.expense_debt_installment || 0;

    const level = b.income_level || "غير محدد";
    if (!byLevel[level]) byLevel[level] = { total: 0, count: 0 };
    byLevel[level].total += b.total_expenses || 0;
    byLevel[level].count++;
  }

  for (const level of Object.keys(byLevel)) {
    byLevel[level].average = byLevel[level].count ? Math.round(byLevel[level].total / byLevel[level].count) : 0;
  }

  return { ...totals, average: totals.count ? Math.round(totals.total_expenses / totals.count) : 0, byLevel };
}

function calculateNetIncomeStats(beneficiaries) {
  const totals = { total_net: 0, count: 0 };
  const byLevel = {};

  for (const b of beneficiaries) {
    totals.count++;
    const net = (b.total_income || 0) - (b.total_expenses || 0);
    totals.total_net += net;

    const level = b.income_level || "غير محدد";
    if (!byLevel[level]) byLevel[level] = { total: 0, count: 0 };
    byLevel[level].total += net;
    byLevel[level].count++;
  }

  for (const level of Object.keys(byLevel)) {
    byLevel[level].average = byLevel[level].count ? Math.round(byLevel[level].total / byLevel[level].count) : 0;
  }

  return { ...totals, average: totals.count ? Math.round(totals.total_net / totals.count) : 0, byLevel };
}