import { Phone, Mail, ExternalLink, MapPin, User, Pencil, Archive, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const categoryColors = {
  "خيرية":   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "تعليمية": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "صحية":    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "بيئية":   "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
  "اجتماعية":"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "أخرى":    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function NGOCard({ ngo, onEdit, onArchive, onDelete, index = 0 }) {
  const initials = ngo.name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("") || "؟";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md hover:border-primary/30 transition-all duration-200"
    >
      {/* Archived badge */}
      {ngo.status === "archived" && (
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs text-amber-600 bg-amber-50 border-amber-200">
            مؤرشف
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        {ngo.logo_url ? (
          <img
            src={ngo.logo_url}
            alt={ngo.name}
            className="w-12 h-12 rounded-xl object-contain border border-border bg-muted flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-base">{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{ngo.name}</h3>
          {ngo.category && (
            <span className={cn("inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium", categoryColors[ngo.category] || categoryColors["أخرى"])}>
              {ngo.category}
            </span>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-2 text-sm">
        <InfoRow icon={User} value={ngo.responsible_person} label="المسؤول" />
        <InfoRow icon={Phone} value={ngo.phone} label="الهاتف" href={`tel:${ngo.phone}`} />
        <InfoRow icon={Mail} value={ngo.email} label="البريد" href={`mailto:${ngo.email}`} truncate />
        {ngo.city && <InfoRow icon={MapPin} value={ngo.city} label="المدينة" />}
      </div>

      {/* Donation link */}
      {ngo.donation_url && (
        <a
          href={ngo.donation_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs font-medium text-primary border border-primary/30 rounded-lg py-2 hover:bg-primary/5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          منصة التبرع الرسمية
        </a>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(ngo)}
          className="flex-1 gap-1.5 text-xs h-8 cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" /> تعديل
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onArchive(ngo)}
          className="flex-1 gap-1.5 text-xs h-8 cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
        >
          <Archive className="w-3.5 h-3.5" />
          {ngo.status === "archived" ? "إلغاء الأرشفة" : "أرشفة"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-1.5 text-xs h-8 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" /> حذف
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-destructive" /> تأكيد الحذف
              </AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف منظمة <strong>{ngo.name}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row-reverse gap-2">
              <AlertDialogCancel className="cursor-pointer">إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(ngo)}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
              >
                تأكيد الحذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, value, label, href, truncate }) {
  if (!value) return null;
  const content = (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className={cn("text-foreground text-xs", truncate && "truncate")}>{value}</span>
    </div>
  );
  if (href) {
    return (
      <a href={href} className="hover:text-primary transition-colors block">
        {content}
      </a>
    );
  }
  return content;
}