import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileBottomNav from "./MobileBottomNav";
import { cn } from "@/lib/utils";

const pageTitles = {
  "/": "لوحة التحكم",
  "/ngos": "المنظمات",
  "/beneficiaries": "المستفيدون",
  "/marketers": "المسوّقون",
  "/profile": "الملف الشخصي",
  "/settings": "إعدادات المنصة",
  "/users": "إدارة المستخدمين",
  "/researcher": "مساحة الباحث",
  "/beneficiaries/detail": "ملف المستفيد",
  "/reports": "التقارير",
};

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Route Change Listener — auto-close the mobile sidebar on every navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // While the mobile sidebar is open: lock body scroll + close on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const pageTitle = pageTitles[location.pathname] || "مُعين";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile overlay (backdrop) — click anywhere outside the sidebar to close.
          Always mounted so opacity transitions smoothly in and out. */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden transition-opacity duration-300 ease-in-out",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile sidebar — slides in/out with transform: translateX (RTL: off-canvas to the right) */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen z-50 md:hidden shadow-2xl transition-transform duration-300 ease-in-out will-change-transform",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Sidebar
          collapsed={false}
          onToggle={() => setMobileOpen(false)}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "transition-[margin] duration-300 ease-in-out min-h-screen",
          collapsed ? "md:mr-[72px]" : "md:mr-[260px]"
        )}
      >
        <TopBar
          onMenuToggle={() => setMobileOpen(true)}
          pageTitle={pageTitle}
        />
        <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div
            key={location.pathname}
            className="max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
}