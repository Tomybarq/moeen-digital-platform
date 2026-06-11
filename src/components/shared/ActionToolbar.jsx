import { Button } from "@/components/ui/button";
import { Plus, Pencil, Upload, Archive, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * ActionToolbar — reusable context-aware action buttons.
 *
 * Props:
 *   onAdd      — show Add button
 *   onEdit     — show Edit button (requires selection)
 *   onImport   — show Import button
 *   onArchive  — show Archive button (requires selection)
 *   onDelete   — show Delete button with confirmation (requires selection)
 *   hasSelection — bool, enables Edit/Archive/Delete when true
 *   addLabel, editLabel, importLabel, archiveLabel, deleteLabel — custom labels
 *   deleteConfirmText — body text for delete confirm dialog
 */
export default function ActionToolbar({
  onAdd,
  onEdit,
  onImport,
  onArchive,
  onDelete,
  hasSelection = false,
  addLabel = "إضافة",
  editLabel = "تعديل",
  importLabel = "استيراد",
  archiveLabel = "أرشفة",
  deleteLabel = "حذف",
  deleteConfirmText = "هذا الإجراء لا يمكن التراجع عنه. هل أنت متأكد من حذف العنصر المحدد؟",
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Add — always visible */}
        {onAdd && (
          <Button onClick={onAdd} className="cursor-pointer gap-2" size="sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{addLabel}</span>
          </Button>
        )}

        {/* Import — always visible */}
        {onImport && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onImport}
                className="cursor-pointer gap-2"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">{importLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{importLabel} من ملف CSV</TooltipContent>
          </Tooltip>
        )}

        {/* Edit — requires selection */}
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                disabled={!hasSelection}
                className="cursor-pointer gap-2"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">{editLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {hasSelection ? editLabel : "اختر عنصراً أولاً"}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Archive — requires selection */}
        {onArchive && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onArchive}
                disabled={!hasSelection}
                className="cursor-pointer gap-2 text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:text-muted-foreground disabled:border-border"
              >
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">{archiveLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {hasSelection ? archiveLabel : "اختر عنصراً أولاً"}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Delete — requires selection + confirmation dialog */}
        {onDelete && (
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasSelection}
                    className="cursor-pointer gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 disabled:text-muted-foreground disabled:border-border"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{deleteLabel}</span>
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {hasSelection ? deleteLabel : "اختر عنصراً أولاً"}
              </TooltipContent>
            </Tooltip>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-destructive" />
                  تأكيد الحذف
                </AlertDialogTitle>
                <AlertDialogDescription>{deleteConfirmText}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row-reverse gap-2">
                <AlertDialogCancel className="cursor-pointer">إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
                >
                  تأكيد الحذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </TooltipProvider>
  );
}