import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Search, LayoutGrid, List, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/shared/EmptyState";
import ActionToolbar from "@/components/shared/ActionToolbar";
import MarketerCard from "@/components/marketers/MarketerCard";
import MarketerFormDialog from "@/components/marketers/MarketerFormDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { hasPermission } from "@/lib/rbac";

export default function Marketers() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [selected, setSelected]     = useState(null);
  const [formOpen, setFormOpen]     = useState(false);
  const [editing, setEditing]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch]         = useState("");
  const [filterNgo, setFilterNgo]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("active");
  const [view, setView]             = useState("grid");

  const canEdit = hasPermission(user, "marketers:create");

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: marketers = [], isLoading } = useQuery({
    queryKey: ["marketers"],
    queryFn: () => base44.entities.Marketer.list("-created_date"),
  });

  const { data: ngos = [] } = useQuery({
    queryKey: ["ngos-list"],
    queryFn: () => base44.entities.NGO.filter({ status: "active" }),
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createM = useMutation({
    mutationFn: (data) => base44.entities.Marketer.create(data),
    onSuccess: () => { qc.invalidateQueries(["marketers"]); toast({ title: "تمت إضافة المسوّق بنجاح" }); },
  });

  const updateM = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Marketer.update(id, data),
    onSuccess: () => { qc.invalidateQueries(["marketers"]); toast({ title: "تم تحديث بيانات المسوّق" }); },
  });

  const deleteM = useMutation({
    mutationFn: (id) => base44.entities.Marketer.delete(id),
    onSuccess: () => { qc.invalidateQueries(["marketers"]); setDeleteTarget(null); setSelected(null); toast({ title: "تم حذف المسوّق" }); },
  });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSave = (data) => {
    if (editing) {
      updateM.mutate({ id: editing.id, data });
    } else {
      createM.mutate(data);
    }
  };

  const handleEdit = (m) => { setEditing(m); setFormOpen(true); };

  const handleArchive = (m) => {
    const newStatus = m.status === "archived" ? "active" : "archived";
    updateM.mutate({ id: m.id, data: { status: newStatus } });
    if (selected?.id === m.id) setSelected(null);
  };

  const handleArchiveSelected = () => selected && handleArchive(selected);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return marketers.filter(m => {
      if (filterStatus !== "all" && m.status !== filterStatus) return false;
      if (filterNgo !== "all" && m.ngo_id !== filterNgo) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          m.full_name?.toLowerCase().includes(q) ||
          m.ngo_name?.toLowerCase().includes(q) ||
          m.city?.toLowerCase().includes(q) ||
          m.specialization?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [marketers, search, filterStatus, filterNgo]);

  const activeCount   = marketers.filter(m => m.status === "active").length;
  const archivedCount = marketers.filter(m => m.status === "archived").length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">إدارة المسوّقين</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            إجمالي <span className="font-semibold text-foreground">{marketers.length}</span> مسوّق —{" "}
            <span className="text-emerald-600">{activeCount} نشط</span>
            {archivedCount > 0 && <span className="text-muted-foreground"> · {archivedCount} مؤرشف</span>}
          </p>
        </div>
        {canEdit && (
          <ActionToolbar
            addLabel="إضافة مسوّق"
            editLabel="تعديل"
            archiveLabel={selected?.status === "archived" ? "إلغاء الأرشفة" : "أرشفة"}
            deleteLabel="حذف"
            hasSelection={!!selected}
            onAdd={() => { setEditing(null); setFormOpen(true); }}
            onEdit={() => selected && handleEdit(selected)}
            onArchive={handleArchiveSelected}
            onDelete={() => selected && setDeleteTarget(selected)}
            deleteConfirmText={`هل أنت متأكد من حذف المسوّق "${selected?.full_name}"؟ لا يمكن التراجع.`}
          />
        )}
      </motion.div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="البحث باسم المسوّق أو المنظمة…" className="pr-10"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-9">
            <Filter className="w-3.5 h-3.5 ml-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">النشطون</SelectItem>
            <SelectItem value="archived">المؤرشفون</SelectItem>
          </SelectContent>
        </Select>

        {ngos.length > 0 && (
          <Select value={filterNgo} onValueChange={setFilterNgo}>
            <SelectTrigger className="w-44 h-9"><SelectValue placeholder="كل المنظمات" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المنظمات</SelectItem>
              {ngos.map(n => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}

        {/* View toggle */}
        <div className="flex gap-1 border border-border rounded-lg p-0.5 mr-auto">
          <button onClick={() => setView("grid")} className={cn("p-1.5 rounded cursor-pointer transition-colors", view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView("list")} className={cn("p-1.5 rounded cursor-pointer transition-colors", view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState
            icon={Megaphone}
            title={search || filterNgo !== "all" ? "لا توجد نتائج مطابقة" : "لا يوجد مسوّقون مسجّلون بعد"}
            description={search || filterNgo !== "all" ? "جرب تغيير معايير البحث والتصفية." : "أضف أول مسوّق لبدء إدارة الحملات."}
            actionLabel={canEdit && !search ? "إضافة أول مسوّق" : undefined}
            onAction={canEdit && !search ? () => { setEditing(null); setFormOpen(true); } : undefined}
          />
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((m, i) => (
              <MarketerCard
                key={m.id}
                marketer={m}
                index={i}
                selected={selected?.id === m.id}
                onSelect={setSelected}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onDelete={setDeleteTarget}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* List view */
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground">
            <span>المسوّق</span>
            <span>المنظمة</span>
            <span>التخصص</span>
            <span>الحالة</span>
            <span>إجراءات</span>
          </div>
          <AnimatePresence>
            {filtered.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(m)}
                className={cn("grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 border-b border-border last:border-0 items-center cursor-pointer hover:bg-muted/20 transition-colors text-sm",
                  selected?.id === m.id && "bg-primary/5 border-primary/20"
                )}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-xs">
                      {m.full_name?.split(" ").slice(0, 2).map(w => w[0]).join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{m.full_name}</p>
                    {m.phone && <p className="text-xs text-muted-foreground" dir="ltr">{m.phone}</p>}
                  </div>
                </div>
                <span className="text-muted-foreground text-xs whitespace-nowrap">{m.ngo_name || "—"}</span>
                <span className="text-xs whitespace-nowrap">{m.specialization || "—"}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap",
                  m.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                  {m.status === "active" ? "نشط" : "مؤرشف"}
                </span>
                <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                  {canEdit && (
                    <>
                      <Button size="sm" variant="ghost" className="h-7 text-xs cursor-pointer" onClick={() => handleEdit(m)}>تعديل</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs cursor-pointer text-amber-600" onClick={() => handleArchive(m)}>
                        {m.status === "archived" ? "استعادة" : "أرشفة"}
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Form Dialog */}
      <MarketerFormDialog
        open={formOpen}
        onOpenChange={(v) => { setFormOpen(v); if (!v) setEditing(null); }}
        marketer={editing}
        onSave={handleSave}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف المسوّق <strong>{deleteTarget?.full_name}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="cursor-pointer">إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground cursor-pointer"
              onClick={() => deleteM.mutate(deleteTarget?.id)}>
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}