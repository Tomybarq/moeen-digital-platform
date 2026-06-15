import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * A visually framed toggle with an icon/label on the left side
 * and a styled container around the Switch.
 */
export default function FramedToggle({ checked, onCheckedChange, label, activeLabel, inactiveLabel, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon }) {
  return (
    <div className="inline-flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-4 py-2.5 min-w-[160px]">
      {/* Label / icon */}
      <span className={cn(
        "text-xs font-medium transition-colors",
        checked ? "text-foreground" : "text-muted-foreground"
      )}>
        {ActiveIcon && InactiveIcon ? (
          checked ? <ActiveIcon className="w-4 h-4" /> : <InactiveIcon className="w-4 h-4" />
        ) : (
          checked ? (activeLabel || label || "مفعّل") : (inactiveLabel || "معطّل")
        )}
      </span>

      {/* Switch */}
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="cursor-pointer" />
    </div>
  );
}