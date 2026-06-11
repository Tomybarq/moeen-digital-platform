import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Megaphone, Search, Package, TrendingUp, MapPin, Building2,
  AlertTriangle, ArrowUp, Minus, ArrowDown, BarChart2, Users,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PRIORITY_CFG = {
  "عاجل":  { icon: AlertTriangle, cls: "text-red-600",    bg: "bg-red-100 text-red-700" },
  "مرتفع": { icon: ArrowUp,       cls: "text-orange-500", bg: "bg-orange-100 text-orange-700" },
  "متوسط": { icon: Minus,         cls: "text-yellow-600", bg: "bg-yellow-100 text-yellow-700" },
  "منخفض": { icon: ArrowDown,     cls: "text-green-600",  bg: "bg-green-100 text-green-700" },
};

const CHART_COLORS = ["#059669", "#1d4ed8", "#d97706", "#7c3aed", "#be185d", "#0891b2"];

function StatMini({ label, value, sub, color = "text-primary" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-bold", color)}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function ActivityMonitorTab() {
  const { data: marketers = [] } = useQuery({
    queryKey: ["marketers-monitor"],
    queryFn: () => base44.entities.Marketer.list("-created_date"),
  });

  const { data: beneficiaries = [] } = useQuery({
    queryKey: ["beneficiaries-monitor"],
    queryFn: () => base44.entities.Beneficiary.list("-created_date"),
  });

  const { data: ngos = [] } = useQuery({
    queryKey: ["ngos-monitor"],
    queryFn: () => base44.entities.NGO.list(),
  });

  // ── Marketer Activity stats ──────────────────────────────────────────────
  const activeMarketers = marketers.filter(m => m.status === "active").length;
  const archivedMarketers = marketers.filter(m => m.status === "archived").length;
  const totalCampaigns = marketers.reduce((sum, m) => sum + (m.campaigns_count || 0), 0);

  const marketersBySpec = marketers.reduce((acc, m) => {
    if (m.specialization) acc[m.specialization] = (acc[m.specialization] || 0) + 1;
    return acc;
  }, {});
  const marketersBySpecChart = Object.entries(marketersBySpec).map(([name, value]) => ({ name, value }));

  const marketersByNgo = marketers.reduce((acc, m) => {
    if (m.ngo_name) acc[m.ngo_name] = (acc[m.ngo_name] || 0) + 1;
    return acc;
  }, {});
  const marketersByNgoChart = Object.entries(marketersByNgo)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  // ── Researcher Activity stats ────────────────────────────────────────────
  const activeResearchers = beneficiaries.reduce((acc, b) => {
    if (b.researcher_name) acc.add(b.researcher_name);
    return acc;
  }, new Set());

  const casesByType = beneficiaries.reduce((acc, b) => {
    if (b.case_type) acc[b.case_type] = (acc[b.case_type] || 0) + 1;
    return acc;
  }, {});
  const casesByTypeChart = Object.entries(casesByType).map(([name, value]) => ({ name, value }));

  const casesByCity = beneficiaries.reduce((acc, b) => {
    if (b.city) acc[b.city] = (acc[b.city] || 0) + 1;
    return acc;
  }, {});
  const casesByCityChart = Object.entries(casesByCity)
    .sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const casesByPriority = beneficiaries.reduce((acc, b) => {
    if (b.priority) acc[b.priority] = (acc[b.priority] || 0) + 1;
    return acc;
  }, {});

  const urgentCases = beneficiaries.filter(b => b.priority === "عاجل" && b.status !== "archived");
  const activeCases = beneficiaries.filter(b => b.status === "active");

  // ── Marketing Kit usage proxy ─────────────────────────────────────────────
  // We infer kit usage from beneficiaries with notes/documents (active cases ready to share)
  const kitReadyCases = beneficiaries.filter(b => b.status === "active" && b.notes && b.notes.length > 10);
  const kitCoverageByCity = Object.entries(casesByCity)
    .sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">

      {/* ── Marketer Activity ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">نشاط المسوّقين</h3>
            <p className="text-xs text-muted-foreground">إجمالي الأنشطة والتوزيع حسب التخصص والمنظمة</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatMini label="إجمالي المسوّقين" value={marketers.length} />
          <StatMini label="مسوّق نشط" value={activeMarketers} color="text-emerald-600" />
          <StatMini label="مؤرشف" value={archivedMarketers} color="text-muted-foreground" />
          <StatMini label="إجمالي الحملات" value={totalCampaigns} color="text-amber-600" sub="حملة منجزة" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm">توزيع المسوّقين حسب التخصص</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {marketersBySpecChart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">لا بيانات بعد</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={marketersBySpecChart} cx="50%" cy="50%" outerRadius={70}
                      dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}>
                      {marketersBySpecChart.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm">المسوّقون حسب المنظمة</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {marketersByNgoChart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">لا بيانات بعد</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={marketersByNgoChart} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#d97706" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* ── Social Researcher Activity ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Search className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">نشاط الباحثين الاجتماعيين</h3>
            <p className="text-xs text-muted-foreground">الحالات المرصودة والتوزيع الجغرافي والأولويات</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatMini label="إجمالي الحالات" value={beneficiaries.length} />
          <StatMini label="حالات نشطة" value={activeCases.length} color="text-emerald-600" />
          <StatMini label="حالات عاجلة" value={urgentCases.length} color="text-red-600" sub="تحتاج تدخلاً" />
          <StatMini label="باحثون نشطون" value={activeResearchers.size} color="text-blue-600" sub="باحث" />
        </div>

        {/* Priority breakdown */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm">توزيع الحالات حسب الأولوية</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(casesByPriority).map(([p, count]) => {
                const cfg = PRIORITY_CFG[p] || {};
                const total = beneficiaries.length || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={p} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", cfg.bg)}>{p}</span>
                      <span className="text-xs font-bold text-foreground">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-left">{pct}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm">الحالات حسب نوع الاحتياج</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {casesByTypeChart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">لا بيانات بعد</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={casesByTypeChart} cx="50%" cy="50%" outerRadius={70}
                      dataKey="value" nameKey="name">
                      {casesByTypeChart.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {casesByTypeChart.map((item, i) => (
                  <span key={item.name} className="text-xs flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" /> الحالات حسب المدينة
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {casesByCityChart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">لا بيانات بعد</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={casesByCityChart}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* ── Marketing Kit Usage ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">استخدام الطاقم التسويقي</h3>
            <p className="text-xs text-muted-foreground">نظرة عامة على الحالات الجاهزة للمشاركة</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatMini label="حالات جاهزة للمشاركة" value={kitReadyCases.length} color="text-purple-600" />
          <StatMini label="نسبة التغطية" value={`${Math.round((kitReadyCases.length / Math.max(beneficiaries.length, 1)) * 100)}%`} color="text-blue-600" />
          <StatMini label="مدن مشمولة" value={Object.keys(casesByCity).length} sub="مدينة" />
        </div>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm">أعلى المدن في حالات التسويق</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {kitCoverageByCity.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-xs">لا بيانات بعد</div>
            ) : (
              kitCoverageByCity.map(([city, count], i) => {
                const max = kitCoverageByCity[0][1] || 1;
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={city} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5 text-left">{i + 1}</span>
                    <span className="text-sm font-medium w-24 truncate">{city}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground w-6 text-left">{count}</span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}