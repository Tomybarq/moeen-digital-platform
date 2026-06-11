import { ShieldCheck, Building2, Search, Megaphone } from "lucide-react";
import { getRoleColor, getRoleLabel } from "@/lib/rbac";
import { cn } from "@/lib/utils";

const iconMap = {
  platform_admin: ShieldCheck,
  ngo_admin: Building2,
  social_researcher: Search,
  marketer: Megaphone,
};

export default function RoleBadge({ role, size = "default" }) {
  const Icon = iconMap[role] ?? ShieldCheck;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        getRoleColor(role)
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {getRoleLabel(role)}
    </span>
  );
}