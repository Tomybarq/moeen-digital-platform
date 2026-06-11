import { useState, useMemo } from "react";
import { Users, Search, Download, Upload, LayoutGrid, List, Package } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import ImportDialog from "@/components/shared/ImportDialog";
import BeneficiaryCard from "@/components/beneficiaries/BeneficiaryCard";
import BeneficiaryFormDialog from "@/components/beneficiaries/BeneficiaryFormDialog";
import BeneficiaryFilters from "@/components/beneficiaries/BeneficiaryFilters";
import DocumentsDialog from "@/components/beneficiaries/DocumentsDialog";
import MarketingKitDialog from "@/components/marketing/MarketingKitDialog";

const PRIORITY_ORDER = { "عاجل": 0, "مرتفع": 1, "متوسط": 2, "منخفض": 3 };

const DEFAULT_FILTERS = {
  priority: "الكل", case_type: "الكل", social_status: "الكل",
  income_level: "الكل", status: "active", sort: "priority_asc",
};

export default function Beneficiaries() {
  const queryClient = useQueryClient();

  const [search, setSearch]       = useState("");
  const [filters, setFilters]     = useState(DEFAULT_FILTERS);
  const [viewMode, setViewMode]   = useState("grid");
  const [formOpen, setFormOpen]   = useState(false);
  const [editingB, setEditingB]   = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [docsTarget, setDocsTarget] = useState(null);
  const [kitOpen, setKitOpen]     = useState(false);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: beneficiaries = [], isLoading } = useQuery({
    queryKey: ["beneficiaries"],
    queryFn: () => base44.entities.Beneficiary.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Beneficiary.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["beneficiaries"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Beneficiary.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["beneficiaries"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Beneficiary.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["beneficiaries"] }),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = async (data) => {
    if (editingB) await updateMutation.mutateAsync({ id: editingB.id, data });
    else await createMutation.mutateAsync(data);
  };

  const handleArchive = (b) =>
    updateMutation.mutate({ id: b.id, data: { status: b.status === "archived" ? "active" : "archived" } });

  const handleDelete = (b) => deleteMutation.mutate(b.id);

  const handleDocUpdate = (id, data) =>
    updateMutation.mutateAsync({ id, data }).then(() =>
      setDocsTarget(prev => prev ? { ...prev, ...data } : prev)
    );

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [
      ["الاسم", "الهوية", "العمر", "الجنس", "الجوال", "المدينة", "الحي", "الحالة الاجتماعية", "أفراد الأسرة", "نوع الحالة", "الأولوية", "مستوى الدخل", "الباحث", "المنظمة", "الحالة", "ملاحظات"],
      ...filtered.map(b => [
        b.full_name, b.national_id, b.age, b.gender, b.phone, b.city, b.district,
        b.social_status, b.dependents_count, b.case_type, b.priority, b.income_level,
        b.researcher_name, b.ngo_name, b.status, b.notes,
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "beneficiaries.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Filter + Sort ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = beneficiaries.filter(b => {
      if (search && !b.full_name?.includes(search) && !b.city?.includes(search) &&
          !b.national_id?.includes(search) && !b.ngo_name?.includes(search)) return false;
      if (filters.priority !== "الكل" && b.priority !== filters.priority) return false;
      if (filters.case_type !== "الكل" && b.case_type !== filters.case_type) return false;
      if (filters.social_status !== "الكل" && b.social_status !== filters.social_status) return false;
      if (filters.income_level !== "الكل" && b.income_level !== filters.income_level) return false;
      if (filters.status !== "all") {
        const effectiveStatus = b.status || "active";
        if (effectiveStatus !== filters.status) return false;
      }
      return true;
    });

    switch (filters.sort) {
      case "priority_asc":  list.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4)); break;
      case "priority_desc": list.sort((a, b) => (PRIORITY_ORDER[b.priority] ?? 4) - (PRIORITY_ORDER[a.priority] ?? 4)); break;
      case "age_asc":       list.sort((a, b) => (a.age || 0) - (b.age || 0)); break;
      case "age_desc":      list.sort((a, b) => (b.age || 0) - (a.age || 0)); break;
      case "name_asc":      list.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || "", "ar")); break;
      case "date_desc":     list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)); break;
    }
    return list;
  }, [beneficiaries, search, filters]);

  // ── Summary counts ────────────────────────────────────────────────────────
  const urgentCount = beneficiaries.filter(b => b.priority === "عاجل" && b.status !== "archived").length;
  const activeCount = beneficiaries.filter(b => b.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">إدارة المستفيدين</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-sm text-muted-foreground">تتبع وإدارة ملفات المستفيدين</p>
            {activeCount > 0 && <Badge variant="secondary" className="text-xs">{activeCount} مستفيد نشط</Badge>}
            {urgentCount > 0 && <Badge className="text-xs bg-red-100 text-red-700 border-red-200 hover:bg-red-100">{urgentCount} حالة عاجلة</Badge>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Marketing Kit */}
          <Button variant="outline" size="sm" onClick={() => setKitOpen(true)}
            className="cursor-pointer gap-2 text-purple-600 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">الطاقم التسويقي</span>
          </Button>
          {/* Export */}
          <Button variant="outline" size="sm" onClick={handleExport} disabled={filtered.length === 0}
            className="cursor-pointer gap-2 text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير البيانات</span>
          </Button>
          {/* Import */}
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}
            className="cursor-pointer gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">استيراد Excel</span>
          </Button>
          {/* Add */}
          <Button size="sm" onClick={() => { setEditingB(null); setFormOpen(true); }}
            className="cursor-pointer gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">تسجيل مستفيد</span>
          </Button>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="البحث بالاسم أو الهوية أو المدينة…" className="pr-10"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {/* View toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden flex-shrink-0">
            <button onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <BeneficiaryFilters filters={filters} onFilterChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
      </div>

      {/* Results count */}
      {!isLoading && beneficiaries.length > 0 && (
        <p className="text-xs text-muted-foreground">
          عرض <span className="font-medium text-foreground">{filtered.length}</span> من أصل {beneficiaries.length} مستفيد
        </p>
      )}

      {/* Content */}
      {isLoading ? (
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState
            icon={Users}
            title={beneficiaries.length === 0 ? "لا يوجد مستفيدون مسجّلون بعد" : "لا توجد نتائج مطابقة"}
            description={beneficiaries.length === 0
              ? "ابدأ بتسجيل المستفيدين أو استيراد بياناتهم من ملف Excel."
              : "جرّب تغيير معايير البحث أو الفلترة."}
            actionLabel={beneficiaries.length === 0 ? "تسجيل أول مستفيد" : undefined}
            onAction={beneficiaries.length === 0 ? () => { setEditingB(null); setFormOpen(true); } : undefined}
          />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "flex flex-col gap-3"}>
            {filtered.map((b, i) => (
              <BeneficiaryCard
                key={b.id} beneficiary={b} index={i}
                onEdit={(b) => { setEditingB(b); setFormOpen(true); }}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onViewDocs={(b) => setDocsTarget(b)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Dialogs */}
      <BeneficiaryFormDialog open={formOpen} onOpenChange={v => { setFormOpen(v); if (!v) setEditingB(null); }}
        beneficiary={editingB} onSave={handleSave} />

      <ImportDialog open={importOpen} onOpenChange={setImportOpen} entityLabel="المستفيدين"
        onImport={(file) => console.log("Import:", file.name)} />

      <DocumentsDialog open={!!docsTarget} onOpenChange={v => { if (!v) setDocsTarget(null); }}
        beneficiary={docsTarget} onUpdate={handleDocUpdate} />

      <MarketingKitDialog open={kitOpen} onOpenChange={setKitOpen} beneficiaries={beneficiaries} />
    </div>
  );
}