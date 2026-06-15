import { Switch } from "@/components/ui/switch";

/**
 * A clean framed container around a Switch toggle —
 * no labels, just the switch centred inside a border card.
 */
export default function FramedToggle({ checked, onCheckedChange }) {
  return (
    <div className="inline-flex items-center justify-center rounded-xl border border-border bg-muted/30 px-3 py-2.5 select-none">
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="cursor-pointer" />
    </div>
  );
}