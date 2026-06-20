/**
 * generateMarketerReport — Weekly Marketer Performance Report
 *
 * Aggregates marketer data, generates a structured summary, and
 * emails it to platform administrators.
 *
 * Can be called:
 *   - Manually from frontend via `base44.functions.invoke`
 *   - Automatically via a scheduled automation (weekly)
 *
 * Payload (optional, for manual calls):
 * {
 *   send_email: boolean  — whether to also email the report (default: true)
 * }
 */
import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // ── RBAC Gate: platform_admin only ──────────────────────
    let user = null;
    try { user = await base44.auth.me(); } catch { /* scheduled — no user */ }
    if (user && user.role !== "platform_admin") {
      return Response.json({ error: "Moeen Cloud Engine: Unauthorized Access" }, { status: 403 });
    }
    if (!user) {
      // Scheduled automation — verify it's not a frontend call masquerading
      // No user means automation; allow through
    }

    let payload = {};
    try { payload = await req.json(); } catch { /* no body = scheduled call */ }

    const sendEmail = payload.send_email !== false;

    // ── Fetch all marketers (service role) ──────────────────
    async function fetchAll(entityName) {
      const results = [];
      let skip = 0;
      const limit = 500;
      let batch;
      do {
        batch = await base44.asServiceRole.entities[entityName].filter(
          {}, "-created_date", limit, skip
        );
        results.push(...batch);
        skip += limit;
      } while (batch.length === limit);
      return results;
    }

    const marketers = await fetchAll("Marketer");

    if (marketers.length === 0) {
      return Response.json({
        success: true,
        data: {
          title: "تقرير أداء المسوّقين — أسبوعي",
          generated_at: new Date().toISOString(),
          summary: { total_marketers: 0, active: 0, archived: 0, total_campaigns: 0 },
          rows: [],
          by_ngo: [],
          by_specialization: [],
        },
      });
    }

    // ── Build report data ──────────────────────────────────
    const active = marketers.filter(m => m.status === "active");
    const archived = marketers.filter(m => m.status === "archived");

    const summary = {
      total_marketers: marketers.length,
      active: active.length,
      archived: archived.length,
      total_campaigns: marketers.reduce((s, m) => s + (m.campaigns_count || 0), 0),
      avg_campaigns_active: active.length
        ? Math.round(active.reduce((s, m) => s + (m.campaigns_count || 0), 0) / active.length)
        : 0,
    };

    // Per-marketer rows sorted by campaigns
    const rows = marketers
      .map(m => ({
        id: m.id,
        name: m.full_name || "—",
        ngo_name: m.ngo_name || "—",
        specialization: m.specialization || "غير محدد",
        campaigns_count: m.campaigns_count || 0,
        status: m.status,
        city: m.city || "—",
        created_date: m.created_date,
      }))
      .sort((a, b) => b.campaigns_count - a.campaigns_count);

    // Group by NGO
    const ngoMap = {};
    for (const m of marketers) {
      const key = m.ngo_name || "غير محدد";
      if (!ngoMap[key]) ngoMap[key] = { ngo_name: key, total: 0, active: 0, campaigns: 0 };
      ngoMap[key].total++;
      if (m.status === "active") ngoMap[key].active++;
      ngoMap[key].campaigns += (m.campaigns_count || 0);
    }
    const byNgo = Object.values(ngoMap).sort((a, b) => b.total - a.total);

    // Group by specialization
    const specMap = {};
    for (const m of marketers) {
      const key = m.specialization || "غير محدد";
      if (!specMap[key]) specMap[key] = { specialization: key, total: 0, campaigns: 0 };
      specMap[key].total++;
      specMap[key].campaigns += (m.campaigns_count || 0);
    }
    const bySpecialization = Object.values(specMap).sort((a, b) => b.total - a.total);

    const reportData = {
      title: "تقرير أداء المسوّقين — أسبوعي",
      generated_at: new Date().toISOString(),
      generated_date_arabic: new Date().toLocaleDateString("ar-SA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      summary,
      rows,
      by_ngo: byNgo,
      by_specialization: bySpecialization,
    };

    // ── Send email to platform admins ──────────────────────
    if (sendEmail) {
      const admins = await base44.asServiceRole.entities.User.filter(
        { role: "platform_admin" }, "", 50, 0
      );

      if (admins.length > 0) {
        const emailBody = buildEmailBody(reportData);

        for (const admin of admins) {
          if (!admin.email) continue;
          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: admin.email,
              subject: `📊 ${reportData.title} — ${reportData.generated_date_arabic}`,
              body: emailBody,
              from_name: "منصة معين الرقمية",
            });
          } catch (e) {
            console.error("Failed to email admin:", admin.email, e.message);
          }
        }
      }
    }

    return Response.json({ success: true, data: reportData });
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});

/* ── HTML Email body builder (RTL Arabic) ────────────── */
function buildEmailBody(report) {
  const { summary, rows, by_ngo, by_specialization, generated_date_arabic } = report;

  const topRow = by_ngo.slice(0, 10);
  const topSpec = by_specialization.slice(0, 5);

  const rowsHtml = rows.slice(0, 30).map((r, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${i + 1}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">${esc(r.name)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${esc(r.ngo_name)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${esc(r.specialization)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${r.campaigns_count}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
        <span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;background:${r.status === 'active' ? '#dcfce7' : '#f3f4f6'};color:${r.status === 'active' ? '#16a34a' : '#6b7280'};">${r.status === 'active' ? 'نشط' : 'مؤرشفة'}</span>
      </td>
    </tr>
  `).join("");

  const ngoRows = topRow.map(r => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${esc(r.ngo_name)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${r.total}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${r.active}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${r.campaigns}</td>
    </tr>
  `).join("");

  const specRows = topSpec.map(r => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${esc(r.specialization)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${r.total}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${r.campaigns}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:Tajawal,IBM Plex Sans Arabic,sans-serif;background:#f4f5f9;direction:rtl;">
  <div style="max-width:720px;margin:0 auto;padding:24px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0c3140,#0d2e42);border-radius:16px;padding:28px 24px;margin-bottom:24px;text-align:center;">
      <h1 style="color:#fff;font-size:22px;margin:0 0 6px;">📊 تقرير أداء المسوّقين — أسبوعي</h1>
      <p style="color:#34d27b;font-size:13px;margin:0;">${generated_date_arabic}</p>
    </div>

    <!-- KPI Cards -->
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
      ${kpiCard("👥 إجمالي المسوّقين", summary.total_marketers, "#0c3140")}
      ${kpiCard("✅ النشطون", summary.active, "#00A651")}
      ${kpiCard("📦 المؤرشفة", summary.archived, "#6b7280")}
      ${kpiCard("📣 إجمالي الحملات", summary.total_campaigns, "#c8972a")}
      ${kpiCard("📐 متوسط الحملات (للنشط)", summary.avg_campaigns_active, "#3b82f6")}
    </div>

    <!-- Per-Marketer Table -->
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:24px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <h2 style="color:#0c3140;font-size:16px;margin:0 0 16px;">🏅 ترتيب المسوّقين (حسب عدد الحملات)</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f4f5f9;">
            <th style="padding:10px 12px;text-align:right;">#</th>
            <th style="padding:10px 12px;text-align:right;">المسوّق</th>
            <th style="padding:10px 12px;text-align:right;">المنظمة</th>
            <th style="padding:10px 12px;text-align:right;">التخصص</th>
            <th style="padding:10px 12px;text-align:center;">الحملات</th>
            <th style="padding:10px 12px;text-align:center;">الحالة</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      ${rows.length > 30 ? `<p style="text-align:center;color:#6b7280;font-size:12px;margin-top:12px;">+ ${rows.length - 30} مسوّق إضافي</p>` : ""}
    </div>

    <!-- By NGO -->
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:24px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <h2 style="color:#0c3140;font-size:16px;margin:0 0 16px;">🏢 حسب المنظمة</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f4f5f9;">
            <th style="padding:10px 12px;text-align:right;">المنظمة</th>
            <th style="padding:10px 12px;text-align:center;">عدد المسوّقين</th>
            <th style="padding:10px 12px;text-align:center;">النشطون</th>
            <th style="padding:10px 12px;text-align:center;">الحملات</th>
          </tr>
        </thead>
        <tbody>${ngoRows}</tbody>
      </table>
    </div>

    <!-- By Specialization -->
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:24px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <h2 style="color:#0c3140;font-size:16px;margin:0 0 16px;">🎯 حسب التخصص</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f4f5f9;">
            <th style="padding:10px 12px;text-align:right;">التخصص</th>
            <th style="padding:10px 12px;text-align:center;">عدد المسوّقين</th>
            <th style="padding:10px 12px;text-align:center;">الحملات</th>
          </tr>
        </thead>
        <tbody>${specRows}</tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:16px;color:#9ca3af;font-size:11px;">
      <p style="margin:0;">تم إنشاء هذا التقرير تلقائياً من منصة معين الرقمية</p>
      <p style="margin:4px 0 0;">لتعديل إعدادات التقرير، تواصل مع مدير المنصة</p>
    </div>
  </div>
</body>
</html>`;
}

function kpiCard(label, value, color) {
  return `
    <div style="flex:1;min-width:120px;background:#fff;border-radius:10px;padding:14px 16px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);border-top:3px solid ${color};">
      <p style="color:#6b7280;font-size:11px;margin:0 0 4px;">${label}</p>
      <p style="color:${color};font-size:22px;font-weight:700;margin:0;">${value}</p>
    </div>`;
}

function esc(str) {
  if (!str) return "—";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}