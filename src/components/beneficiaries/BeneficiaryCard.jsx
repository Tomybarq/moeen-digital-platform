import { Phone, MapPin, User, Briefcase, Users, Pencil, Archive, Trash2, Paperclip, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PriorityBadge from "./PriorityBadge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { hasPermission } from "@/lib/rbac";

const CASE_COLORS = {
  "مادي":     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "صحي":      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "تعليمي":   "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "اجتماعي":  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "متعدد":    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const STATUS_MAP = {
  active:    { label: "نشط",       cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  supported: { label: "مدعوم",     cls: "bg-blue-100 text-blue-700 border-blue-200" },
  archived:  { label: "مؤرشف",     cls: "bg-gray-100 text-gray-600 border-gray-200" },
};

export default function BeneficiaryCard({ beneficiary: b, index = 0, onEdit, onArchive, onDelete, onViewDocs, onStatusChange }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = b.full_name?.split(" ").slice(0, 2).map(w => w[0]).join("") || "؟";
  const status = STATUS_MAP[b.status] || STATUS_MAP.active;
  const docsCount = b.documents?.length || 0;

  const canEdit    = hasPermission(user, "beneficiaries:edit");
  const canArchive = hasPermission(user, "beneficiaries:archive");
  const canDelete  = hasPermission(user, "beneficiaries:delete");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        "group relative glass-card border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        b.priority === "عاجل" ? "border-red-300 dark:border-red-800" : "border-border hover:border-primary/40"
      )}
    >
      {/* Priority stripe */}
      {b.priority === "عاجل" && (
        <div className="absolute top-0 right-0 w-1 h-full bg-red-500 rounded-r-2xl" />
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-bold text-sm">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-foreground leading-tight">{b.full_name}</h3>
            <PriorityBadge priority={b.priority} />
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {b.case_type && (
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", CASE_COLORS[b.case_type] || "bg-muted text-muted-foreground")}>
                {b.case_type}
              </span>
            )}
            {canEdit && onStatusChange ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn("text-xs px-2 py-0.5 rounded-full border font-medium cursor-pointer hover:ring-1 hover:ring-primary/40 transition-shadow", status.cls)}>
                    {status.label} ▾
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" dir="rtl">
                  {Object.entries(STATUS_MAP).map(([key, s]) => (
                    <DropdownMenuItem key={key} className="cursor-pointer text-xs"
                      onClick={() => key !== b.status && onStatusChange(b, key)}>
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", status.cls)}>
                {status.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
        {b.age && <InfoItem icon={User} label={`${b.age} سنة · ${b.gender || ""}`} />}
        {b.city && <InfoItem icon={MapPin} label={`${b.city}${b.district ? ` · ${b.district}` : ""}`} />}
        {b.phone && (
          <a href={`tel:${b.phone}`} className="hover:text-primary transition-colors">
            <InfoItem icon={Phone} label={b.phone} />
          </a>
        )}
        {b.social_status && <InfoItem icon={Users} label={`${b.social_status}${b.dependents_count ? ` · ${b.dependents_count} أفراد` : ""}`} />}
        {b.income_level && <InfoItem icon={Briefcase} label={b.income_level} />}
        {b.ngo_name && <InfoItem icon={Briefcase} label={b.ngo_name} />}
      </div>

      {/* Notes */}
      {b.notes && (
        <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/40 rounded-lg px-3 py-2">{b.notes}</p>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-1 pt-1 border-t border-border flex-wrap">
        <Button variant="ghost" size="sm"
          onClick={() => navigate(`/beneficiaries/detail?id=${b.id}`)}
          className="flex-1 text-xs h-7 gap-1 cursor-pointer text-primary">
          <Eye className="w-3 h-3" /> تفاصيل
        </Button>

        {canEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(b)}
            className="flex-1 text-xs h-7 gap-1 cursor-pointer">
            <Pencil className="w-3 h-3" /> تعديل
          </Button>
        )}

        {docsCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => onViewDocs(b)}
            className="flex-1 text-xs h-7 gap-1 cursor-pointer text-primary">
            <Paperclip className="w-3 h-3" /> {docsCount} وثيقة
          </Button>
        )}

        {canArchive && (
          <Button variant="ghost" size="sm" onClick={() => onArchive(b)}
            className="flex-1 text-xs h-7 gap-1 cursor-pointer text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
            <Archive className="w-3 h-3" /> {b.status === "archived" ? "تفعيل" : "أرشفة"}
          </Button>
        )}

        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm"
                className="flex-1 text-xs h-7 gap-1 cursor-pointer text-destructive hover:bg-destructive/10">
                <Trash2 className="w-3 h-3" /> حذف
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف ملف المستفيد <strong>{b.full_name}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
                  <br />
                  <span className="text-xs text-rose-600 font-medium mt-1 block">
                    ⚠️ هذا الإجراء مقتصر على مسؤول حماية البيانات (PDO) وفق متطلبات الامتثال.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row-reverse gap-2">
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(b)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer">
                  تأكيد الحذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}