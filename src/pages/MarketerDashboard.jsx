import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { coreApi } from "@/api/coreClient";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Megaphone, Sparkles, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MarketerStatsBar from "@/components/marketer/MarketerStatsBar";
import MarketerCaseCard from "@/components/marketer/MarketerCaseCard";

export default function MarketerDashboard() {
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCaseType, setFilterCaseType] = useState("all");

  // Fetch approved beneficiaries — RLS automatically scopes to marketer's NGO + case_status=معتمد
  const { data: beneficiaries = [], isLoading } = useQuery({
    queryKey: ["marketer-cases"],
    queryFn: () => coreApi.entities.Beneficiary.filter({ case_status: "معتمد" }, "-created_date", 100),
  });

  // Unique filter options
  const cities = useMemo(
    () => [...new Set(beneficiaries.map(b => b.city).filter(Boolean))].sort(),
    [beneficiaries]
  );
  const priorities = ["عاجل", "مرتفع", "متوسط", "منخفض"];
  const caseTypes = [...new Set(beneficiaries.map(b => b.case_type).filter(Boolean))].sort();

  // Filtered list
  const filtered = useMemo(() => {
    return beneficiaries.filter(b => {
      if (search) {
        const q = search.toLowerCase();
        const title = b.full_name || "";
        const story = b.notes || b.researcher_opinion_financial || "";
        if (!title.includes(q) && !story.includes(q) && !b.city?.includes(q) && !b.case_type?.includes(q)) return false;
      }
      if (filterCity !== "all" && b.city !== filterCity) return false;
      if (filterPriority !== "all" && b.priority !== filterPriority) return false;
      if (filterCaseType !== "all" && b.case_type !== filterCaseType) return false;
      return true;
    });
  }, [beneficiaries, search, filterCity, filterPriority, filterCaseType]);

  return (
    <div className="min-h-screen pb-12 space-y-6" dir="rtl">
      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 p-6 sm:p-8 text-white"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-teal-400/10 blur-xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              <Sparkles className="inline w-6 h-6 ml-2 -mt-1" />
              لوحة تحكم المسوّق
            </h1>
            <p className="text-teal-200 text-sm mt-1.5 max-w-lg">
              تصفّح الحالات المعتمدة الجاهزة للتسويق، وانسخ الحقائب التسويقية، وشاركها مع المتبرعين بضغطة زر.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-sm">
            <Megaphone className="w-5 h-5 text-teal-300" />
            <span className="font-bold">{filtered.length}</span>
            <span className="text-teal-200">حالة جاهزة</span>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Bar ── */}
      <MarketerStatsBar totalCases={filtered.length} />

      {/* ── Filters Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث في الحالات التسويقية..."
            className="pr-10 bg-white/80 backdrop-blur-sm border-gray-200 h-10 rounded-xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger className="w-36 h-10 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 text-sm">
              <Filter className="w-3.5 h-3.5 ml-1.5 text-muted-foreground" />
              <SelectValue placeholder="المدينة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المدن</SelectItem>
              {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32 h-10 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 text-sm">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأولويات</SelectItem>
              {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterCaseType} onValueChange={setFilterCaseType}>
            <SelectTrigger className="w-32 h-10 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 text-sm">
              <SelectValue placeholder="النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              {caseTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Cases Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 rounded-3xl bg-white/50 backdrop-blur-sm border border-dashed border-gray-200"
        >
          <Megaphone className="w-14 h-14 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">لا توجد حالات تسويقية متاحة حالياً</p>
          <p className="text-gray-400 text-sm mt-1">
            {search || filterCity !== "all" || filterPriority !== "all" || filterCaseType !== "all"
              ? "جرّب تغيير معايير البحث والتصفية"
              : "ستظهر هنا الحالات المعتمدة الجاهزة للتسويق"}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((b, i) => (
              <MarketerCaseCard key={b.id} beneficiary={b} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}