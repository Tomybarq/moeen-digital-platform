import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Search, Paperclip, MapPin, Calendar, AlertTriangle, ArrowUp, Minus, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

const PRIORITY_CFG = {
  "عاجل":  { icon: AlertTriangle, cls: "text-red-600 bg-red-50 border-red-200" },
  "مرتفع": { icon: ArrowUp,       cls: "text-orange-600 bg-orange-50 border-orange-200" },
  "متوسط": { icon: Minus,         cls: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  "منخفض": { icon: ArrowDown,     cls: "text-green-600 bg-green-50 border-green-200" },
};

const CASE_COLORS = {
  "مادي":    "bg-blue-100 text-blue-700",
  "صحي":     "bg-rose-100 text-rose-700",
  "تعليمي":  "bg-violet-100 text-violet-700",
  "اجتماعي": "bg-teal-100 text-teal-700",
  "متعدد":   "bg-amber-100 text-amber-700",
};

const STATUS_MAP = {
  active:    { label: "نشط",   cls: "bg-emerald-100 text-emerald-700" },
  supported: { label: "مدعوم", cls: "bg-blue-100 text-blue-700" },
  archived:  { label: "مؤرشف", cls: "bg-gray-100 text-gray-500" },
};

export default function MyCasesList({ researcherName }) {
  const [search, setSearch] = useState("");

  const { data: allCases = [], isLoading } = useQuery({
    queryKey: ["beneficiaries", "researcher", researcherName],
    queryFn: () => base44.entities.Beneficiary.list("-created_date"),
    enabled: !!researcherName,
  });

  const myCases = useMemo(() => {
    const mine = researcherName
      ? allCases.filter(b => b.researcher_name === researcherName)
      : allCases;
    if (!search) return mine;
    return mine.filter(b =>
      b.full_name?.includes(search) || b.city?.includes(search) || b.case_type?.includes(search)
    );
  }, [allCases, researcherName, search]);

  const urgentCount = myCases.filter(b => b.priority === "عاجل").length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "إجمالي حالاتي", value: myCases.length, cls: "text-foreground" },
          { label: "حالات عاجلة",   value: urgentCount,   cls: "text-red-600" },
          { label: "مدعومة",        value: myCases.filter(b => b.status === "supported").length, cls: "text-blue-600" },
        ].map(({ label, value, cls }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-3 text-center">
            <p className={cn("text-2xl font-bold", cls)}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="البحث في حالاتي…" className="pr-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({length: 4}).map((_,i) => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}</div>
      ) : myCases.length === 0 ? (
        <EmptyState icon={Users} title="لا توجد حالات بعد" description="ابدأ برفع أول حالة باستخدام النموذج." />
      ) : (
        <div className="space-y-3">
          {myCases.map((b, i) => {
            const pcfg   = PRIORITY_CFG[b.priority] || PRIORITY_CFG["متوسط"];
            const PIcon  = pcfg.icon;
            const status = STATUS_MAP[b.status] || STATUS_MAP.active;
            const docsCount = b.documents?.length || 0;
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn("bg-card border rounded-xl p-4 flex items-start gap-3 hover:shadow-sm transition-all",
                  b.priority === "عاجل" ? "border-red-300" : "border-border"
                )}>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs">
                    {b.full_name?.split(" ").slice(0,2).map(w=>w[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{b.full_name}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium border", pcfg.cls)}>
                      <span className="flex items-center gap-1"><PIcon className="w-3 h-3" />{b.priority}</span>
                    </span>
                    {b.case_type && <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", CASE_COLORS[b.case_type])}>{b.case_type}</span>}
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", status.cls)}>{status.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    {b.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.city}</span>}
                    {b.visit_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.visit_date}</span>}
                    {docsCount > 0 && <span className="flex items-center gap-1 text-primary"><Paperclip className="w-3 h-3" />{docsCount} مرفق</span>}
                  </div>
                  {b.notes && <p className="text-xs text-muted-foreground line-clamp-1">{b.notes}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}