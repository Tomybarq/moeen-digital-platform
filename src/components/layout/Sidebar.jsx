import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Megaphone,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { ROLES } from "@/lib/rbac";

const baseNavItems = [
  { label: "لوحة التحكم", icon: LayoutDashboard, path: "/", roles: null },
  { label: "المنظمات", icon: Building2, path: "/ngos", roles: null },
  { label: "المستفيدون", icon: Users, path: "/beneficiaries", roles: null },
  { label: "المسوّقون", icon: Megaphone, path: "/marketers", roles: null },
];

const bottomNavItems = [
  { label: "إدارة المستخدمين", icon: ShieldCheck, path: "/users", roles: [ROLES.PLATFORM_ADMIN] },
  { label: "إعدادات المنصة", icon: Settings, path: "/settings", roles: null },
  { label: "الملف الشخصي", icon: UserCircle, path: "/profile", roles: null },
];

function NavLink({ item, collapsed, onNavigate, isActive }) {
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer group",
        isActive
          ? "bg-sidebar-accent text-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <item.icon className={cn(
        "w-5 h-5 shrink-0 transition-colors duration-200",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
      )} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default function Sidebar({ collapsed, onToggle, onNavigate }) {
  const location = useLocation();
  const { user } = useAuth();

  const visibleBottom = bottomNavItems.filter(
    item => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 h-screen z-30 flex flex-col border-l border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg text-sidebar-foreground whitespace-nowrap overflow-hidden"
            >
              مُعين
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            القائمة الرئيسية
          </p>
        )}
        {baseNavItems.map(item => (
          <NavLink
            key={item.path}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
            isActive={location.pathname === item.path}
          />
        ))}

        {!collapsed && <div className="border-t border-sidebar-border my-3" />}
        {collapsed && <div className="border-t border-sidebar-border my-2 mx-2" />}

        {visibleBottom.map(item => (
          <NavLink
            key={item.path}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 pb-4 shrink-0">
        <button
          onClick={onToggle}
          aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors duration-200 cursor-pointer"
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <>
              <ChevronRight className="w-5 h-5" />
              <span>طي القائمة</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}