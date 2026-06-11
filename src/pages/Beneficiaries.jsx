import { useState } from "react";
import { Users, Search } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import ActionToolbar from "@/components/shared/ActionToolbar";
import ImportDialog from "@/components/shared/ImportDialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Beneficiaries() {
  const [selected, setSelected] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">إدارة المستفيدين</h2>
          <p className="text-sm text-muted-foreground mt-1">تتبع وإدارة بيانات المستفيدين من الخدمات</p>
        </div>
        <ActionToolbar
          addLabel="تسجيل مستفيد"
          editLabel="تعديل"
          importLabel="استيراد"
          archiveLabel="أرشفة"
          deleteLabel="حذف"
          hasSelection={!!selected}
          onAdd={() => {}}
          onEdit={() => {}}
          onImport={() => setImportOpen(true)}
          onArchive={() => {}}
          onDelete={() => setSelected(null)}
          deleteConfirmText="هل أنت متأكد من حذف بيانات هذا المستفيد؟ لا يمكن التراجع عن هذا الإجراء."
        />
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="البحث عن مستفيد…" className="pr-10" />
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <EmptyState
          icon={Users}
          title="لا يوجد مستفيدون مسجّلون بعد"
          description="ابدأ بتسجيل المستفيدين لتتبع خدماتهم وبرامج الدعم المقدّمة لهم."
          actionLabel="تسجيل أول مستفيد"
          onAction={() => {}}
        />
      </div>

      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        entityLabel="المستفيدين"
        onImport={(file) => console.log("Import Beneficiaries:", file.name)}
      />
    </div>
  );
}