import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Search, Megaphone, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useQuery } from "@tanstack/react-query";
import DashboardStatsService from "@/services/DashboardStatsService";
import { getRoleLabel, ROLES } from "@/lib/rbac";

import KPICard from "@/components/dashboard/KPICard";
import KPICardSkeleton from "@/components/dashboard/KPICardSkeleton";
import GrowthLineChart from "@/components/dashboard/GrowthLineChart";
import CasePriorityChart from "@/components/dashboard/CasePriorityChart";
import BeneficiaryStatusChart from "@/components/dashboard/BeneficiaryStatusChart";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import RecentCasesTable from "@/components/dashboard/RecentCasesTable";
import TopNGOsWidget from "@/components/dashboard/TopNGOsWidget";
import MarketerActivityWidget from "@/components/dashboard/MarketerActivityWidget";
import DashboardFilterBar from "@/components/dashboard/DashboardFilterBar";

export default function Dashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ period: "month", region: "all" });

  // Single aggregated query — server‑side stats (~2 KB instead of ~8 MB)
  const { data: statsData, isFetching } = useQuery({
    queryKey: ["dashboard-stats", filters],
    queryFn: () => DashboardStatsService.getStats(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const stats = statsData || {};
  const isLoading = isFetching && !statsData;

  // Transform server stats → chart‑compatible shapes
  const statusDistributionChart = useMemo(() => {
    const dist = stats.status_distribution || {};
    const total = Object.values(dist).reduce((s, v) => s + (v || 0), 0) || 1;
    return [
      { name: "حالات نشطة",   value: dist.active || 0,    color: "#0c3140", percent: (dist.active || 0) / total },
      { name: "حالات مدعومة", value: dist.supported || 0, color: "#00A651", percent: (dist.supported || 0) / total },
      { name: "حالات عاجلة",  value: stats.urgent_cases_count || 0, color: "#dc2626", percent: (stats.urgent_cases_count || 0) / total },
      { name: "مؤرشفة",       value: dist.archived || 0,   color: "#94a3b8", percent: (dist.archived || 0) / total },
    ];
  }, [stats]);

  const topNgosFormatted = useMemo(() => {
    const ngos = stats.top_ngos || [];
    const maxCount = Math.max(...ngos.map((n) => n.beneficiary_count || 0), 1);
    return ngos.map((n) => ({
      ngo_id: n.id,
      ngo_name: n.name,
      city: n.city,
      total_cases: n.beneficiary_count || 0,
      activity_pct: Math.round(((n.beneficiary_count || 0) / maxCount) * 100),
    }));
  }, [stats]);

  const recentCasesFormatted = useMemo(() => {
    return (stats.recent_beneficiaries || []).map((b) => ({
      beneficiary_id: b.id?.slice(-8) || b.id || "—",
      full_name: b.full_name || "—",
      case_type: b.case_type || "—",
      city: b.city || "—",
      priority: b.priority || "—",
      researcher_name: b.researcher_name || "—",
      created_at: b.created_date
        ? new Date(b.created_date).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })
        : "—",
    }));
  }, [stats]);

  const isAdmin = user?.role === ROLES.PLATFORM_ADMIN;
  const isNgoManager = user?.role === ROLES.NGO_MANAGER;
  const isResearcher = user?.role === ROLES.RESEARCHER;
  const isMarketer = user?.role === ROLES.MARKETER;
  const isPdo = user?.role === ROLES.PDO;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "صباح الخير";
    if (h < 17) return "مساء الخير";
    return "مساء النور";
  })();

  const dashSubtitle = {
    platform_admin: "لوحة التحكم الشاملة — نظرة كاملة على المنصة",
    ngo_manager: "لوحة مدير المنظمة — مستفيدو منظمتك وتقاريرها",
    researcher: "مساحة الباحث الميداني — حالاتك المسجّلة",
    marketer: "لوحة التسويق — الحملات والحالات القابلة للمشاركة",
    pdo: "لوحة مسؤول حماية البيانات — الامتثال والتدقيق"
  }[user?.role] || "لوحة التحكم";

  return (
    <div className="space-y-6">

      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #0c3140 0%, #0d4a60 60%, #0c3140 100%)",
          boxShadow: "0 8px 32px rgba(12,49,64,0.25)"
        }}>
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10 -translate-x-24 -translate-y-24"
        style={{ background: "#00A651" }} />
        <div className="absolute bottom-0 right-8 w-40 h-40 rounded-full opacity-5"
        style={{ background: "#ffffff" }} />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              
              
              {user?.ngo_name && !isAdmin &&
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/80">
                  {user.ngo_name}
                </span>
              }
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {user?.full_name ? user.full_name.split(" ").slice(0, 2).join(" ") : "مرحباً"}
            </h1>
            <p className="text-white/60 text-sm">{dashSubtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role &&
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-white text-sm font-medium">{getRoleLabel(user.role)}</span>
              </div>
            }
            <div className="text-left hidden sm:block">
              <p className="text-white/40 text-xs">اليوم</p>
              <p className="text-white text-sm font-medium">
                {new Date().toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Filter Bar ── */}
      {(isAdmin || isNgoManager || isPdo) &&
      <DashboardFilterBar onFilterChange={setFilters} />
      }

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {(isAdmin || isNgoManager) && (
          isLoading
            ? <KPICardSkeleton />
            : <KPICard
                title="المنظمات المسجّلة"
                value={stats.ngo_count || 0}
                icon={Building2}
                trend={null}
                trendLabel="مقارنةً بالشهر الماضي"
                color="navy"
                delay={0.05} />
        )}
        {isLoading
          ? <KPICardSkeleton />
          : <KPICard
              title="إجمالي المستفيدين"
              value={stats.beneficiary_count || 0}
              icon={Users}
              trend={null}
              trendLabel="مستفيد جديد هذا الشهر"
              color="gold"
              delay={0.1} />
        }
        {(isAdmin || isNgoManager || isPdo) && (
          isLoading
            ? <KPICardSkeleton />
            : <KPICard
                title="الباحثون النشطون"
                value={stats.researcher_count || 0}
                icon={Search}
                trend={null}
                trendLabel="باحث ميداني"
                color="emerald"
                delay={0.15} />
        )}
        {(isAdmin || isNgoManager || isMarketer) && (
          isLoading
            ? <KPICardSkeleton />
            : <KPICard
                title="المسوّقون النشطون"
                value={stats.marketer_count || 0}
                icon={Megaphone}
                trend={null}
                trendLabel="مسوّق مسجّل"
                color="purple"
                delay={0.2} />
        )}
        {isLoading
          ? <KPICardSkeleton />
          : <KPICard
              title="الحالات العاجلة"
              value={stats.urgent_cases_count || 0}
              icon={AlertTriangle}
              trend={null}
              trendLabel="تحسّن عن الشهر الماضي"
              color="red"
              delay={0.25} />
        }
      </div>

      {/* ── Main Charts Row ── */}
      {(isAdmin || isNgoManager || isPdo) &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <GrowthLineChart data={stats.growth_by_month} />
          </div>
          <BeneficiaryStatusChart data={statusDistributionChart} />
        </div>
      }

      {/* ── Secondary Charts Row ── */}
      {(isAdmin || isNgoManager) &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <CasePriorityChart data={stats.priority_by_month} />
          </div>
          <TopNGOsWidget ngos={topNgosFormatted} />
        </div>
      }

      {/* ── Researcher / Marketer view ── */}
      {(isResearcher || isMarketer) &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BeneficiaryStatusChart data={statusDistributionChart} />
          <TopNGOsWidget ngos={topNgosFormatted} />
        </div>
      }

      {/* ── Marketer Leaderboard Row ── */}
      {(isAdmin || isNgoManager) &&
      <div className="grid grid-cols-1 gap-5">
          <MarketerActivityWidget />
        </div>
      }

      {/* ── Activity + Table Row ── */}
      {(isAdmin || isNgoManager || isPdo) &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RecentCasesTable cases={recentCasesFormatted} />
          </div>
          <RecentActivityFeed />
        </div>
      }

      {/* Researcher / Marketer activity */}
      {(isResearcher || isMarketer) &&
      <div className="grid grid-cols-1 gap-5">
          <RecentCasesTable cases={recentCasesFormatted} />
        </div>
      }
    </div>);

}