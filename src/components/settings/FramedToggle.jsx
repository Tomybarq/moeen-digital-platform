import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * A visually framed toggle with an icon/label on the left side
 * and a styled container around the Switch.
 */
export default function FramedToggle({ checked, onCheckedChange, label, activeLabel, inactiveLabel, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon }) {
  const offLabel = inactiveLabel || "معطّل";
  const onLabel  = activeLabel   || "مفعّل";

  return (
    <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2.5 select-none">
      {/* OFF label — stable width, no layout shift */}
      <span className="inline-flex items-center justify-end min-w-[42px]">
        {ActiveIcon && InactiveIcon ? (
          <InactiveIcon className={cn("w-4 h-4 transition-colors duration-200", !checked ? "text-destructive/80" : "text-muted-foreground/40")} />
        ) : (
          <span className={cn(
            "text-xs font-medium transition-colors duration-200",
            !checked ? "text-destructive/80" : "text-muted-foreground/40"
          )}>
            {offLabel}
          </span>
        )}
      </span>

      {/* Switch — centred focal point */}
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="cursor-pointer shrink-0" />

      {/* ON label — stable width, no layout shift */}
      <span className="inline-flex items-center justify-start min-w-[42px]">
        {ActiveIcon && InactiveIcon ? (
          <ActiveIcon className={cn("w-4 h-4 transition-colors duration-200", checked ? "text-primary" : "text-muted-foreground/40")} />
        ) : (
          <span className={cn(
            "text-xs font-medium transition-colors duration-200",
            checked ? "text-primary" : "text-muted-foreground/40"
          )}>
            {onLabel}
          </span>
        )}
      </span>
    </div>
  );
}