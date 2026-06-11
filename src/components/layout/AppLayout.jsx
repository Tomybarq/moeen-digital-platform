import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { cn } from "@/lib/utils";

const pageTitles = {
  "/": "لوحة التحكم",
  "/ngos": "المنظمات",
  "/beneficiaries": "المستفيدون",
  "/marketers": "المسوّقون",
  "/profile": "الملف الشخصي",
  "/settings": "إعدادات المنصة",
  "/users": "إدارة المستخدمين",
};

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const pageTitle = pageTitles[location.pathname] || "مُعين";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen z-50 md:hidden transition-transform duration-300 ease-in-out",
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
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}