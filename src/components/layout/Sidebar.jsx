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
  ShieldCheck,
  ClipboardPlus,
  ScrollText,
  BarChart3,
  Share2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { ROLES } from "@/lib/rbac";

const mainNavItems = [
  { label: "لوحة التحكم الشاملة",    icon: LayoutDashboard, path: "/dashboard",           roles: null },
  { label: "إدارة المنظمات",          icon: Building2,       path: "/ngos",                 roles: [ROLES.PLATFORM_ADMIN] },
  { label: "أداء المنظمات",           icon: BarChart3,       path: "/ngo-performance",      roles: [ROLES.PLATFORM_ADMIN] },
  { label: "إدارة المستفيدين",       icon: Users,           path: "/beneficiaries",        roles: [ROLES.PLATFORM_ADMIN, ROLES.NGO_MANAGER, ROLES.PDO] },
  { label: "تفاصيل المستفيد",         icon: ClipboardPlus,   path: "/beneficiaries/detail", roles: [ROLES.PLATFORM_ADMIN, ROLES.NGO_MANAGER] },
  { label: "مساحة الباحث الاجتماعي",  icon: ClipboardPlus,   path: "/researcher",           roles: [ROLES.RESEARCHER, ROLES.PLATFORM_ADMIN, ROLES.NGO_MANAGER] },
  { label: "المسوّقون",               icon: Megaphone,       path: "/marketers",            roles: [ROLES.PLATFORM_ADMIN, ROLES.NGO_MANAGER] },
  { label: "لوحة المسوق الذكية",      icon: Share2,          path: "/marketer-dashboard",   roles: [ROLES.MARKETER] },
];

const bottomNavItems = [
  { label: "التقارير الإدارية",            icon: FileText,    path: "/reports",    roles: [ROLES.PLATFORM_ADMIN] },
  { label: "سجل التدقيق الرقمي",           icon: ScrollText,  path: "/audit-logs", roles: [ROLES.PLATFORM_ADMIN, ROLES.PDO] },
  { label: "إدارة المستخدمين والأعضاء",   icon: ShieldCheck, path: "/users",      roles: [ROLES.PLATFORM_ADMIN] },
  { label: "إعدادات المنصة",              icon: Settings,    path: "/settings",   roles: [ROLES.PLATFORM_ADMIN] },
  { label: "الملف الشخصي",                icon: UserCircle,  path: "/profile",    roles: null },
];

function NavLink({ item, collapsed, onNavigate, isActive, userRole }) {
  const isMarketer = userRole === ROLES.MARKETER;
  const isResearcher = userRole === ROLES.RESEARCHER;

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
        collapsed && "justify-center px-0",
        isActive
          ? isMarketer
            ? "bg-[#0d9488] text-white shadow-md shadow-[#0d9488]/30"
            : "bg-[#00A651] text-white shadow-md shadow-[#00A651]/30"
          : isMarketer
            ? "text-white/80 hover:bg-[#0d9488]/30 hover:text-white hover:translate-x-[-2px]"
            : "text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-[-2px]"
      )}
    >
      {isActive && (
        <span className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full",
          isMarketer ? "bg-[#5eead4]/90" : "bg-white/90"
        )} />
      )}
      <item.icon className={cn(
        "w-5 h-5 shrink-0 transition-colors duration-200",
        isActive ? "text-white" : "text-white/70 group-hover:text-white"
      )} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap overflow-hidden font-body"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

/* Brand logo mark — Moeen Digital Trading logo */
function LogoMark({ size = 36 }) {
  return (
    <img
      src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/9af41b6fb_logo-.jpg"
      alt="معين - الرقمية التجارية"
      className="shrink-0 rounded-lg object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export default function Sidebar({ collapsed, onToggle, onNavigate, context = "desktop" }) {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role;

  const isMobileCtx = context === "mobile";

  // Researcher: only show workspace + profile
  const isResearcher = userRole === ROLES.RESEARCHER;
  // Marketer: only show dashboard + profile
  const isMarketer = userRole === ROLES.MARKETER;

  const visibleMain = mainNavItems.filter(item => {
    if (!item.roles) return !isResearcher && !isMarketer;
    return item.roles.includes(userRole);
  });

  const visibleBottom = bottomNavItems.filter(item => {
    if (!item.roles) return true; // profile always visible
    return item.roles.includes(userRole);
  });

  return (
    <aside
      className={cn(
        "h-screen flex flex-col overflow-hidden",
        isMobileCtx
          ? "w-[260px]"
          : cn(
              "fixed top-0 right-0 z-30 transition-[width] duration-300 ease-in-out",
              collapsed ? "w-[72px]" : "w-[260px]"
            )
      )}
      style={isMobileCtx ? {
        background: "rgba(12,49,64,0.92)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderLeft: "1px solid rgba(0,166,81,0.4)",
      } : {
        background: "rgba(12,49,64,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderLeft: isMarketer ? "1px solid rgba(13,148,136,0.5)" : "1px solid rgba(0,166,81,0.25)",
      }}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 h-16 shrink-0",
          collapsed ? "justify-center px-0" : "px-4"
        )}
        style={{ borderBottom: isMarketer ? "1px solid rgba(13,148,136,0.35)" : "1px solid rgba(0,166,81,0.25)" }}
      >
        <LogoMark size={38} />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <p className="font-display font-bold text-white text-base leading-tight whitespace-nowrap">
                معين
              </p>
              <p className="text-[10px] font-medium whitespace-nowrap leading-tight tracking-wide" style={{ color: isMarketer ? "#5eead4" : "#34d27b" }}>
                الرقمية التجارية
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 pb-2 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
            القائمة الرئيسية
          </p>
        )}
        {visibleMain.map(item => (
          <NavLink
            key={item.path}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
            isActive={location.pathname === item.path}
            userRole={userRole}
          />
        ))}

        {visibleBottom.length > 0 && (
          <div className="my-3 mx-1" style={{ borderTop: isMarketer ? "1px solid rgba(13,148,136,0.35)" : "1px solid rgba(0,166,81,0.25)" }} />
        )}

        {visibleBottom.map(item => (
          <NavLink
            key={item.path}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
            isActive={location.pathname === item.path}
            userRole={userRole}
          />
        ))}
      </nav>

      {/* Collapse Toggle — desktop only */}
      {!isMobileCtx && (
        <div className="px-2 pb-4 shrink-0" style={{ borderTop: isMarketer ? "1px solid rgba(13,148,136,0.2)" : "1px solid rgba(0,166,81,0.2)" }}>
          <button
            onClick={onToggle}
            aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}
            aria-expanded={!collapsed}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors duration-200 cursor-pointer mt-2"
          >
            {collapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-xs">طي القائمة</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}