import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ClipboardPlus, Building2, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { ROLES } from "@/lib/rbac";

const items = [
  { label: "الرئيسية",   icon: LayoutDashboard, path: "/" },
  { label: "المستفيدون", icon: Users,           path: "/beneficiaries" },
  { label: "تسجيل",      icon: ClipboardPlus,   path: "/researcher", center: true, roles: [ROLES.RESEARCHER, ROLES.PLATFORM_ADMIN, ROLES.NGO_MANAGER] },
  { label: "المنظمات",   icon: Building2,       path: "/ngos" },
  { label: "حسابي",      icon: UserCircle,      path: "/profile" },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const visible = items.filter(i => !i.roles || i.roles.includes(user?.role));

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden glass-sidebar border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 h-16">
        {visible.map(item => {
          const active = location.pathname === item.path;
          if (item.center) {
            return (
              <Link key={item.path} to={item.path} className="relative -top-4 flex flex-col items-center">
                <span
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-95",
                    active ? "bg-white text-[#00A651]" : "bg-[#00A651] text-white shadow-[#00A651]/40"
                  )}
                >
                  <item.icon className="w-5 h-5" strokeWidth={2} />
                </span>
                <span className="text-[10px] text-white/80 mt-1">{item.label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors duration-200",
                active ? "text-[#34d27b]" : "text-white/60 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" strokeWidth={2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}