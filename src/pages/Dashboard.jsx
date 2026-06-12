import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Search, Megaphone, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { getRoleLabel, ROLES, filterByNGO } from "@/lib/rbac";

import KPICard from "@/components/dashboard/KPICard";
import GrowthLineChart from "@/components/dashboard/GrowthLineChart";
import CasePriorityChart from "@/components/dashboard/CasePriorityChart";
import BeneficiaryStatusChart from "@/components/dashboard/BeneficiaryStatusChart";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import RecentCasesTable from "@/components/dashboard/RecentCasesTable";
import TopNGOsWidget from "@/components/dashboard/TopNGOsWidget";
import DashboardFilterBar from "@/components/dashboard/DashboardFilterBar";

export default function Dashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ period: "month", region: "all" });

  const { data: ngos = [] } = useQuery({
    queryKey: ["dashboard-ngos"],
    queryFn: () => base44.entities.NGO.filter({ status: "active" }, "-created_date", 200),
    staleTime: 60_000,
  });

  const { data: rawBeneficiaries = [] } = useQuery({
    queryKey: ["dashboard-beneficiaries"],
    queryFn: () => base44.entities.Beneficiary.list("-created_date", 500),
    staleTime: 60_000,
  });

  const { data: marketers = [] } = useQuery({
    queryKey: ["dashboard-marketers"],
    queryFn: () => base44.entities.Marketer.filter({ status: "active" }, "-created_date", 200),
    staleTime: 60_000,
  });

  const beneficiaries = useMemo(
    () => filterByNGO(user, rawBeneficiaries),
    [user, rawBeneficiaries]
  );

  const stats = useMemo(() => {
    const activeResearchers = new Set(
      beneficiaries
        .filter(b => b.researcher_name && b.status !== "archived")
        .map(b => b.researcher_name)
    ).size;

    const urgentCases = beneficiaries.filter(
      b => b.priority === "عاجل" && b.status !== "archived"
    ).length;

    return {
      ngoCount: ngos.length,
      beneficiaryCount: beneficiaries.filter(b => b.status !== "archived").length,
      researcherCount: activeResearchers,
      marketerCount: marketers.length,
      urgentCases,
    };
  }, [ngos, beneficiaries, marketers]);

  const isAdmin      = user?.role === ROLES.PLATFORM_ADMIN;
  const isNgoManager = user?.role === ROLES.NGO_MANAGER;
  const isResearcher = user?.role === ROLES.RESEARCHER;
  const isMarketer   = user?.role === ROLES.MARKETER;
  const isPdo        = user?.role === ROLES.PDO;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "صباح الخير";
    if (h < 17) return "مساء الخير";
    return "مساء النور";
  })();

  const dashSubtitle = {
    platform_admin: "لوحة التحكم الشاملة — نظرة كاملة على المنصة",
    ngo_manager:    "لوحة مدير المنظمة — مستفيدو منظمتك وتقاريرها",
    researcher:     "مساحة الباحث الميداني — حالاتك المسجّلة",
    marketer:       "لوحة التسويق — الحملات والحالات القابلة للمشاركة",
    pdo:            "لوحة مسؤول حماية البيانات — الامتثال والتدقيق",
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
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10 -translate-x-24 -translate-y-24"
          style={{ background: "#c8972a" }} />
        <div className="absolute bottom-0 right-8 w-40 h-40 rounded-full opacity-5"
          style={{ background: "#ffffff" }} />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">{greeting}</span>
              {user?.ngo_name && !isAdmin && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/80">
                  {user.ngo_name}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {user?.full_name ? user.full_name.split(" ").slice(0, 2).join(" ") : "مرحباً"}
            </h1>
            <p className="text-white/60 text-sm">{dashSubtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-white text-sm font-medium">{getRoleLabel(user.role)}</span>
              </div>
            )}
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
      {(isAdmin || isNgoManager || isPdo) && (
        <DashboardFilterBar onFilterChange={setFilters} />
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {(isAdmin || isNgoManager) && (
          <KPICard
            title="المنظمات المسجّلة"
            value={stats.ngoCount || 61}
            icon={Building2}
            trend={8}
            trendLabel="مقارنةً بالشهر الماضي"
            color="navy"
            delay={0.05}
          />
        )}
        <KPICard
          title="إجمالي المستفيدين"
          value={stats.beneficiaryCount || 626}
          icon={Users}
          trend={12}
          trendLabel="مستفيد جديد هذا الشهر"
          color="gold"
          delay={0.1}
        />
        {(isAdmin || isNgoManager || isPdo) && (
          <KPICard
            title="الباحثون النشطون"
            value={stats.researcherCount || 38}
            icon={Search}
            trend={5}
            trendLabel="باحث ميداني"
            color="emerald"
            delay={0.15}
          />
        )}
        {(isAdmin || isNgoManager || isMarketer) && (
          <KPICard
            title="المسوّقون النشطون"
            value={stats.marketerCount || 95}
            icon={Megaphone}
            trend={3}
            trendLabel="مسوّق مسجّل"
            color="purple"
            delay={0.2}
          />
        )}
        <KPICard
          title="الحالات العاجلة"
          value={stats.urgentCases || 47}
          icon={AlertTriangle}
          trend={-6}
          trendLabel="تحسّن عن الشهر الماضي"
          color="red"
          delay={0.25}
        />
      </div>

      {/* ── Main Charts Row ── */}
      {(isAdmin || isNgoManager || isPdo) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <GrowthLineChart />
          </div>
          <BeneficiaryStatusChart />
        </div>
      )}

      {/* ── Secondary Charts Row ── */}
      {(isAdmin || isNgoManager) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <CasePriorityChart />
          </div>
          <TopNGOsWidget />
        </div>
      )}

      {/* ── Researcher / Marketer view ── */}
      {(isResearcher || isMarketer) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BeneficiaryStatusChart />
          <TopNGOsWidget />
        </div>
      )}

      {/* ── Activity + Table Row ── */}
      {(isAdmin || isNgoManager || isPdo) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <RecentCasesTable />
          </div>
          <RecentActivityFeed />
        </div>
      )}

      {/* Researcher / Marketer activity */}
      {(isResearcher || isMarketer) && (
        <div className="grid grid-cols-1 gap-5">
          <RecentCasesTable />
        </div>
      )}
    </div>
  );
}