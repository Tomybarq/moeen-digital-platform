// ============================================================================
// Supabase Edge Function — getDashboardStats (index.ts)
// ============================================================================
//
// Deploy this to your Supabase project via:
//   supabase functions deploy get-dashboard-stats
//
// This function replaces the Base44 backend function with direct PostgreSQL
// queries using @supabase/supabase-js. It respects Row Level Security by
// passing the end-user's JWT from the Authorization header, and uses a
// dashboard_cache table + materialized view for performance.
//
// Expected request payload (JSON):
// {
//   period: "week" | "month" | "quarter",   // optional, default "month"
//   region: "all" | city name,              // optional, default "all"
//   force_refresh: boolean                  // optional, bypass cache
// }
//
// Response: { success: true, data: { ... aggregated stats ... } }
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2.49.1";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// ── Constants ────────────────────────────────────────────────────────────────
const CACHE_TTL_MINUTES = 5;

const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

// ── djb2 hash (no external deps) ─────────────────────────────────────────────
function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

// ── Service-role client (bypasses RLS for admin-level aggregation) ───────────
function getServiceClient(): ReturnType<typeof createClient> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ── Auth-aware client (respects RLS via end-user JWT) ────────────────────────
function getAuthClient(authHeader: string): ReturnType<typeof createClient> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const token = authHeader.replace("Bearer ", "");
  return createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

// ── Extract user info from JWT ───────────────────────────────────────────────
async function getUserFromJWT(authClient: ReturnType<typeof createClient>) {
  const { data } = await authClient.auth.getUser();
  return data?.user ?? null;
}

// =============================================================================
// MAIN HANDLER
// =============================================================================
serve(async (req: Request) => {
  try {
    // ── 1. Parse payload ────────────────────────────────────────────────────
    let payload: Record<string, unknown> = {};
    try {
      payload = await req.json();
    } catch {
      /* use defaults */
    }

    const period = (payload.period as string) || "month";
    const region = (payload.region as string) || "all";
    const forceRefresh = payload.force_refresh === true;

    // ── 2. Authenticate end-user ────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const authClient = getAuthClient(authHeader);
    const supabaseUser = await getUserFromJWT(authClient);
    if (!supabaseUser) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch the user's app profile for role & NGO scope
    const serviceClient = getServiceClient();
    const { data: appUser } = await serviceClient
      .from("users")
      .select("id, role, ngo_id")
      .eq("id", supabaseUser.id)
      .single();

    const userRole = appUser?.role || "user";
    const ngoScope =
      userRole === "ngo_manager" || userRole === "marketer"
        ? appUser?.ngo_id || null
        : null;

    // ── 3. Cache check ──────────────────────────────────────────────────────
    const cacheKey = { period, region, ngoScope: ngoScope || "all" };
    const cacheHash = simpleHash(JSON.stringify(cacheKey));

    if (!forceRefresh) {
      const { data: cached } = await serviceClient
        .from("dashboard_cache")
        .select("payload")
        .eq("report_type", "dashboard_stats")
        .eq("filters_hash", cacheHash)
        .gt("expires_at", new Date().toISOString())
        .order("generated_at", { ascending: false })
        .limit(1)
        .single();

      if (cached?.payload) {
        return new Response(
          JSON.stringify({ success: true, data: cached.payload, from_cache: true }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "X-Cache": "HIT",
            },
          }
        );
      }
    }

    // ── 4. Build query filters ──────────────────────────────────────────────
    const bFilter: Record<string, unknown> = {};
    if (ngoScope) bFilter.ngo_id = ngoScope;
    if (region !== "all") bFilter.city = region;

    // ── 5. Fetch & aggregate via SQL ────────────────────────────────────────

    // NGO count (service role bypasses RLS for aggregation)
    const { count: ngoCount } = await serviceClient
      .from("ngos")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    // Beneficiary counts
    const bQuery = serviceClient.from("beneficiaries").select("*", { count: "exact", head: true });
    for (const [k, v] of Object.entries(bFilter)) {
      bQuery.eq(k, v as string);
    }
    const { count: totalBeneficiaryCount } = await bQuery;

    // Active beneficiaries (not archived)
    const activeBQuery = serviceClient
      .from("beneficiaries")
      .select("*", { count: "exact", head: true })
      .neq("status", "archived");
    for (const [k, v] of Object.entries(bFilter)) {
      activeBQuery.eq(k, v as string);
    }
    const { count: activeBeneficiaryCount } = await activeBQuery;

    // Urgent cases
    const urgentQuery = serviceClient
      .from("beneficiaries")
      .select("*", { count: "exact", head: true })
      .eq("priority", "عاجل")
      .neq("status", "archived");
    for (const [k, v] of Object.entries(bFilter)) {
      urgentQuery.eq(k, v as string);
    }
    const { count: urgentCasesCount } = await urgentQuery;

    // Researcher count (distinct researcher_name from active beneficiaries)
    const { data: researcherNames } = await serviceClient
      .from("beneficiaries")
      .select("researcher_name")
      .neq("status", "archived")
      .not("researcher_name", "is", null);

    const distinctResearchers = new Set(
      (researcherNames || [])
        .filter((b: { researcher_name: string | null }) => b.researcher_name)
        .map((b: { researcher_name: string }) => b.researcher_name)
    );

    // Marketer count
    const mQuery = serviceClient
      .from("marketers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");
    if (ngoScope) mQuery.eq("ngo_id", ngoScope);
    const { count: marketerCount } = await mQuery;

    // Top 5 NGOs (by beneficiary count)
    const { data: topNgosResult } = await serviceClient.rpc("get_top_ngos", {
      scope_ngo_id: ngoScope || null,
    }).throwOnError().catch(() => ({ data: [] }));

    const topNgos = (topNgosResult || []).slice(0, 5).map((n: Record<string, unknown>) => ({
      id: n.id,
      name: n.name,
      city: n.city || "",
      beneficiary_count: Number(n.beneficiary_count) || 0,
    }));

    // Recent 5 beneficiaries
    const recentQuery = serviceClient
      .from("beneficiaries")
      .select("id, full_name, city, case_type, priority, researcher_name, status, created_date");
    for (const [k, v] of Object.entries(bFilter)) {
      recentQuery.eq(k, v as string);
    }
    const { data: recentBens } = await recentQuery
      .order("created_date", { ascending: false })
      .limit(5);

    const recentBeneficiaries = (recentBens || []).map((b: Record<string, unknown>) => ({
      id: b.id,
      full_name: b.full_name || "",
      city: b.city || "",
      case_type: b.case_type || "",
      priority: b.priority || "",
      researcher_name: b.researcher_name || "",
      status: b.status || "active",
      created_date: b.created_date,
    }));

    // Status & priority distribution — fetched with one aggregate query each
    const { data: statusDistQuery } = await serviceClient
      .from("beneficiaries")
      .select("status");
    const statusDist: Record<string, number> = { active: 0, archived: 0, supported: 0 };
    for (const b of (statusDistQuery || [])) {
      const s = (b as { status: string }).status || "active";
      if (s in statusDist) statusDist[s]++;
    }

    const { data: priorityDistQuery } = await serviceClient
      .from("beneficiaries")
      .select("priority")
      .neq("status", "archived");
    const priorityDist: Record<string, number> = { عاجل: 0, مرتفع: 0, متوسط: 0, منخفض: 0 };
    for (const b of (priorityDistQuery || [])) {
      const p = (b as { priority: string }).priority;
      if (p in priorityDist) priorityDist[p]++;
    }

    // ── 6. Growth & priority-by-month series ────────────────────────────────
    // Fetch creation dates for all relevant records (only date column)
    const { data: benDates } = await serviceClient
      .from("beneficiaries")
      .select("created_date, priority, status");
    const { data: ngoDates } = await serviceClient
      .from("ngos")
      .select("created_date");
    const { data: mktDates } = await serviceClient
      .from("marketers")
      .select("created_date");
    const { data: resDates } = await serviceClient
      .from("users")
      .select("created_date")
      .eq("role", "researcher");

    const growthByMonth = computeGrowthSeries(
      benDates || [], ngoDates || [], mktDates || [], resDates || []
    );
    const priorityByMonth = computePrioritySeries(benDates || []);

    // ── 7. Assemble response ────────────────────────────────────────────────
    const statsData = {
      ngo_count: ngoCount || 0,
      beneficiary_count: activeBeneficiaryCount || 0,
      active_beneficiary_count: totalBeneficiaryCount || 0,
      urgent_cases_count: urgentCasesCount || 0,
      researcher_count: distinctResearchers.size,
      marketer_count: marketerCount || 0,
      recent_beneficiaries: recentBeneficiaries,
      top_ngos: topNgos,
      growth_by_month: growthByMonth,
      priority_by_month: priorityByMonth,
      status_distribution: statusDist,
      priority_distribution: priorityDist,
      generated_at: new Date().toISOString(),
    };

    // ── 8. Save to cache ────────────────────────────────────────────────────
    const expireTime = new Date(Date.now() + CACHE_TTL_MINUTES * 60 * 1000);
    try {
      // Replace existing cache entry for this hash
      await serviceClient
        .from("dashboard_cache")
        .delete()
        .eq("report_type", "dashboard_stats")
        .eq("filters_hash", cacheHash);

      await serviceClient.from("dashboard_cache").insert({
        report_type: "dashboard_stats",
        filters_hash: cacheHash,
        payload: statsData,
        generated_at: new Date().toISOString(),
        expires_at: expireTime.toISOString(),
        generated_by_id: supabaseUser.id,
        record_count: (benDates || []).length,
      });

      // Cleanup expired entries
      await serviceClient
        .from("dashboard_cache")
        .delete()
        .lt("expires_at", new Date().toISOString());
    } catch (e) {
      console.warn("Cache write/cleanup failed:", (e as Error).message);
    }

    return new Response(JSON.stringify({ success: true, data: statsData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", (error as Error).message);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// =============================================================================
// HELPERS
// =============================================================================

function computeGrowthSeries(
  benDates: Array<{ created_date: string }>,
  ngoDates: Array<{ created_date: string }>,
  mktDates: Array<{ created_date: string }>,
  resDates: Array<{ created_date: string }>,
) {
  const now = new Date();
  const months: Array<{ end: string; label: string }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(
      now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999
    ).toISOString();
    months.push({ end: endOfMonth, label: AR_MONTHS[d.getMonth()] });
  }

  return months.map((m) => ({
    month: m.label,
    مستفيدون: benDates.filter((b) => b.created_date <= m.end).length,
    منظمات: ngoDates.filter((n) => n.created_date <= m.end).length,
    باحثون: resDates.filter((r) => r.created_date <= m.end).length,
  }));
}

function computePrioritySeries(
  benDates: Array<{ created_date: string; priority?: string }>,
) {
  const now = new Date();
  const months: Array<{ start: string; end: string; label: string }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = d.toISOString();
    const endOfMonth = new Date(
      now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999
    ).toISOString();
    months.push({ start: startOfMonth, end: endOfMonth, label: AR_MONTHS[d.getMonth()] });
  }

  return months.map((m) => {
    const inMonth = benDates.filter(
      (b) => b.created_date >= m.start && b.created_date <= m.end
    );
    return {
      month: m.label,
      عاجل: inMonth.filter((b) => b.priority === "عاجل").length,
      مرتفع: inMonth.filter((b) => b.priority === "مرتفع").length,
      متوسط: inMonth.filter((b) => b.priority === "متوسط").length,
      منخفض: inMonth.filter((b) => b.priority === "منخفض").length,
    };
  });
}