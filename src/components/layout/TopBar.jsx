import { Sun, Moon, Menu, Bell, LogOut } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import RoleBadge from "@/components/auth/RoleBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";

export default function TopBar({ onMenuToggle, pageTitle }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
          onClick={onMenuToggle}
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative cursor-pointer" aria-label="الإشعارات">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-primary rounded-full" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
          className="cursor-pointer"
        >
          <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
            {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </motion.div>
        </Button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-muted/60 transition-colors duration-200 cursor-pointer outline-none">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {user.full_name?.[0] || user.email?.[0]?.toUpperCase() || "؟"}
                  </span>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-foreground leading-none">{user.full_name || "مستخدم"}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" dir="rtl">
              <DropdownMenuLabel className="font-normal pb-2">
                <p className="font-semibold text-sm text-foreground">{user.full_name || "مستخدم"}</p>
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