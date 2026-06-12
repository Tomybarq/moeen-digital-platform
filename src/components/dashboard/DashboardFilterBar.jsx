import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PERIODS = [
  { value: "week",    label: "هذا الأسبوع" },
  { value: "month",   label: "هذا الشهر" },
  { value: "quarter", label: "هذا الربع" },
  { value: "year",    label: "هذا العام" },
];

const REGIONS = [
  { value: "all",    label: "كل المناطق" },
  { value: "riyadh", label: "الرياض" },
  { value: "jeddah", label: "جدة" },
  { value: "dammam", label: "الدمام" },
  { value: "mecca",  label: "مكة المكرمة" },
];

export default function DashboardFilterBar({ onFilterChange }) {
  const [period, setPeriod]   = useState("month");
  const [region, setRegion]   = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
    onFilterChange?.({ period, region });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span>تصفية:</span>
      </div>

      <Select value={period} onValueChange={v => { setPeriod(v); onFilterChange?.({ period: v, region }); }}>
        <SelectTrigger className="w-40 h-9 text-sm gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={region} onValueChange={v => { setRegion(v); onFilterChange?.({ period, region: v }); }}>
        <SelectTrigger className="w-44 h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="flex-1" />

      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        className="gap-2 h-9 cursor-pointer"
      >
        <RefreshCw className={cn("w-3.5 h-3.5 transition-transform", refreshing && "animate-spin")} />
        تحديث
      </Button>

      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-muted-foreground">البيانات محدّثة الآن</span>
      </div>
    </motion.div>
  );
}