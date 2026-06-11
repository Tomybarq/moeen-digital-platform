import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Building2, Megaphone, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SPEC_COLORS = {
  "تسويق رقمي":   "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  "تسويق ميداني": "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  "علاقات عامة":  "bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300",
  "إعلام اجتماعي":"bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
  "أخرى":         "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

export default function MarketerCard({ marketer, index, selected, onSelect, onEdit, onArchive, onDelete }) {
  const isArchived = marketer.status === "archived";
  const initials = marketer.full_name?.split(" ").slice(0, 2).map(w => w[0]).join("") || "م";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onSelect(marketer)}
      className={cn(
        "bg-card border rounded-2xl p-5 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-all duration-200 relative",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border",
        isArchived && "opacity-60"
      )}
    >
      {/* Archive ribbon */}
      {isArchived && (
        <div className="absolute top-3 left-3">
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">مؤرشف</span>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-bold text-sm">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{marketer.full_name}</p>
          {marketer.specialization && (
            <span className={cn("mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium", SPEC_COLORS[marketer.specialization] || SPEC_COLORS["أخرى"])}>
              {marketer.specialization}
            </span>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-1.5 text-sm text-muted-foreground">
        {marketer.ngo_name && (
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
            <span className="truncate">{marketer.ngo_name}</span>
          </div>
        )}
        {marketer.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span dir="ltr">{marketer.phone}</span>
          </div>
        )}
        {marketer.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{marketer.email}</span>
          </div>
        )}
        {marketer.city && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{marketer.city}</span>
          </div>
        )}
      </div>

      {/* Campaigns stat */}
      {marketer.campaigns_count != null && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm">
          <BarChart2 className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">الحملات المنجزة:</span>
          <span className="font-semibold text-foreground">{marketer.campaigns_count}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-border" onClick={e => e.stopPropagation()}>
        <Button size="sm" variant="outline" className="flex-1 cursor-pointer text-xs h-8" onClick={() => onEdit(marketer)}>
          تعديل
        </Button>
        <Button size="sm" variant="outline" className="flex-1 cursor-pointer text-xs h-8 text-amber-600 hover:bg-amber-50"
          onClick={() => onArchive(marketer)}>
          {isArchived ? "إلغاء الأرشفة" : "أرشفة"}
        </Button>
        <Button size="sm" variant="outline" className="h-8 w-8 p-0 cursor-pointer text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(marketer)}>
          <Megaphone className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}