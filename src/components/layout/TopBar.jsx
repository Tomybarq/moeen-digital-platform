import { useState, useEffect } from "react";
import { Sun, Moon, Menu, LogOut, UserCircle } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import RoleBadge from "@/components/auth/RoleBadge";
import NotificationCenter from "@/components/layout/NotificationCenter";
import TenantSwitcher from "@/components/tenant/TenantSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export default function TopBar({ onMenuToggle, pageTitle, showHamburger, hamburgerRef }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 backdrop-blur-xl transition-all duration-300 ${scrolled ? "h-12 shadow-md" : "h-16"}`}
      style={{
        background: theme === "dark"
          ? "rgba(10,26,34,0.85)"
          : "rgba(255,255,255,0.85)",
        borderBottom: "1px solid rgba(0,166,81,0.25)",
        boxShadow: "0 1px 8px rgba(12,49,64,0.08)",
      }}
    >
      {/* Left: menu toggle + title */}
      <div className="flex items-center gap-3">
        {showHamburger && (
          <Button
            ref={hamburgerRef}
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:bg-[#0c3140]/10"
            onClick={onMenuToggle}
            aria-label="فتح القائمة"
            aria-haspopup="dialog"
          >
            <Menu className="w-5 h-5" style={{ color: "#0c3140" }} />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <div
            className="hidden md:block w-0.5 h-5 rounded-full"
            style={{ background: "#00A651" }}
          />
          <h1
            className="text-base font-bold font-display"
            style={{ color: theme === "dark" ? "#f4f5f9" : "#0c3140" }}
          >
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Tenant Switcher (admin/PDO only) */}
        <TenantSwitcher theme={theme} />

        {/* Notifications */}
        <NotificationCenter />

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
          className="cursor-pointer"
          style={{ color: theme === "dark" ? "#00A651" : "#0c3140" }}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {theme === "dark"
              ? <Sun className="w-4.5 h-4.5" />
              : <Moon className="w-4.5 h-4.5" />}
          </motion.div>
        </Button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#0c3140]/8 transition-colors duration-200 cursor-pointer outline-none"
                style={{ outline: "none" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold font-display shadow-sm"
                  style={{ background: "#0c3140" }}
                >
                  {user.full_name?.[0] || user.email?.[0]?.toUpperCase() || "؟"}
                </div>
                <div className="hidden sm:block text-right">
                  <p
                    className="text-xs font-semibold leading-none font-body"
                    style={{ color: theme === "dark" ? "#f4f5f9" : "#0c3140" }}
                  >
                    {user.full_name || "مستخدم"}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" dir="rtl">
              <DropdownMenuLabel className="font-normal pb-2">
                <p className="font-semibold text-sm">{user.full_name || "مستخدم"}</p>
                <p className="text-xs text-muted-foreground mt-0.5" dir="ltr">{user.email}</p>
                {user.role && <div className="mt-2"><RoleBadge role={user.role} size="sm" /></div>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  الملف الشخصي
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}