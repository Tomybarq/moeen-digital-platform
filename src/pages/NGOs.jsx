import { useState, useMemo } from "react";
import { Building2, Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NGOService from "@/services/NGOService";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/shared/EmptyState";
import ActionToolbar from "@/components/shared/ActionToolbar";
import NGOCard from "@/components/ngos/NGOCard";
import NGOFormDialog from "@/components/ngos/NGOFormDialog";

const CATEGORIES = ["الكل", "خيرية", "تعليمية", "صحية", "بيئية", "اجتماعية", "أخرى"];

export default function NGOs() {
  const queryClient = useQueryClient();

  // UI state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("active");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [formOpen, setFormOpen] = useState(false);
  const [editingNGO, setEditingNGO] = useState(null);

  // Data — goes through NGOService (adapter-agnostic)
  const { data: ngos = [], isLoading } = useQuery({
    queryKey: ["ngos"],
    queryFn: () => NGOService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => NGOService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ngos"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => NGOService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ngos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => NGOService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ngos"] }),
  });

  // Handlers
  const handleSave = async (formData) => {
    if (editingNGO) {
      await updateMutation.mutateAsync({ id: editingNGO.id, data: formData });
    } else {
      await createMutation.mutateAsync({ ...formData, status: "active" });
    }
  };

  const handleEdit = (ngo) => {
    setEditingNGO(ngo);
    setFormOpen(true);
  };

  const handleArchive = (ngo) => {
    updateMutation.mutate({ id: ngo.id, data: { status: ngo.status === "archived" ? "active" : "archived" } });
  };

  const handleDelete = (ngo) => {
    deleteMutation.mutate(ngo.id);
  };

  const openAdd = () => {
    setEditingNGO(null);
    setFormOpen(true);
  };

  // Filtered list
  const filtered = useMemo(() => {
    return ngos.filter((n) => {
      const matchSearch =
        !search ||
        n.name?.includes(search) ||
        n.responsible_person?.includes(search) ||
        n.city?.includes(search);
      const matchCategory =
        categoryFilter === "الكل" || n.category === categoryFilter;
      const matchStatus =
        statusFilter === "all" || n.status === statusFilter || (!n.status && statusFilter === "active");
      return matchSearch && matchCategory && matchStatus;
    });
  }, [ngos, search, categoryFilter, statusFilter]);

  const activeCount = ngos.filter((n) => n.status !== "archived").length;
  const archivedCount = ngos.filter((n) => n.status === "archived").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">إدارة المنظمات</h2>
          <p className="text-sm text-muted-foreground mt-1">
            عرض وإدارة جميع المنظمات غير الربحية المسجّلة
            {ngos.length > 0 && (
              <span className="mr-2">
                <Badge variant="secondary" className="text-xs">{activeCount} نشطة</Badge>
                {archivedCount > 0 && (
                  <Badge variant="outline" className="text-xs mr-1 text-amber-600">{archivedCount} مؤرشفة</Badge>
                )}
              </span>
            )}
          </p>
        </div>
        <ActionToolbar
          addLabel="إضافة منظمة"
          onAdd={openAdd}
          deleteConfirmText="هل أنت متأكد من حذف المنظمة المحددة؟ لا يمكن التراجع عن هذا الإجراء."
        />
      </motion.div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="البحث بالاسم أو المسؤول أو المدينة…"
            className="pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 h-9 text-xs">
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28 h-9 text-xs">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active" className="text-xs">النشطة</SelectItem>
              <SelectItem value="archived" className="text-xs">المؤرشفة</SelectItem>
              <SelectItem value="all" className="text-xs">الكل</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState
            icon={Building2}
            title={ngos.length === 0 ? "لا توجد منظمات مسجّلة بعد" : "لا توجد نتائج مطابقة"}
            description={
              ngos.length === 0
                ? "ابدأ بإضافة أول منظمة غير ربحية إلى المنصة لإدارة بياناتها وبرامجها."
                : "جرّب تغيير معايير البحث أو الفلترة."
            }
            actionLabel={ngos.length === 0 ? "إضافة أول منظمة" : undefined}
            onAction={ngos.length === 0 ? openAdd : undefined}
          />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-3"
            }
          >
            {filtered.map((ngo, i) => (
              <NGOCard
                key={ngo.id}
                ngo={ngo}
                index={i}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Form dialog */}
      <NGOFormDialog
        open={formOpen}
        onOpenChange={(v) => { setFormOpen(v); if (!v) setEditingNGO(null); }}
        ngo={editingNGO}
        onSave={handleSave}
      />
    </div>
  );
}