import { useState, useEffect, useCallback, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileBottomNav from "./MobileBottomNav";
import MouseGlowTrail from "@/components/ui/MouseGlowTrail";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";

/* ── Page titles (RTL Arabic) ──────────────────── */
const pageTitles = {
  "/dashboard": "لوحة التحكم الشاملة",
  "/ngos": "إدارة المنظمات",
  "/ngo-performance": "أداء المنظمات",
  "/beneficiaries": "إدارة المستفيدين",
  "/beneficiaries/detail": "تفاصيل المستفيد",
  "/marketers": "المسوّقون",
  "/marketer-dashboard": "لوحة المسوق الذكية",
  "/researcher": "مساحة الباحث الاجتماعي",
  "/profile": "الملف الشخصي",
  "/settings": "إعدادات المنصة",
  "/users": "إدارة المستخدمين والأعضاء",
  "/reports": "التقارير الإدارية",
  "/audit-logs": "سجل التدقيق الرقمي",
  "/forbidden": "غير مصرّح",
};

/* ── Animation constants ───────────────────────── */
const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const SIDEBAR_PANEL_VARIANTS = {
  hidden: { x: "100%" }, // RTL — slides in from right
  visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 34 } },
  exit: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 34 } },
};

/* ── localStorage key ──────────────────────────── */
const COLLAPSED_KEY = "moeen-sidebar-collapsed";

export default function AppLayout() {
  const location = useLocation();
  const isMobile = useBreakpoint(1024); // <1024px → overlay mode

  /* ── Desktop collapsed state (persisted) ────── */
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem(COLLAPSED_KEY);
      return saved !== null ? saved === "true" : true; // default collapsed
    } catch {
      return true;
    }
  });

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(COLLAPSED_KEY, String(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  /* ── Mobile overlay state ────────────────────── */
  const [mobileOpen, setMobileOpen] = useState(false);

  // Refs for focus management
  const hamburgerRef = useRef(null);
  const sidebarFirstItemRef = useRef(null);

  /* ── Auto-close overlay on route change ──────── */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* ── Auto-close on resize to desktop ─────────── */
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  /* ── Body scroll lock + ESC key ──────────────── */
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      // Focus trap: Tab / Shift+Tab loop inside sidebar
      if (e.key === "Tab") {
        const sidebar = document.getElementById("moeen-mobile-sidebar");
        if (!sidebar) return;
        const focusable = sidebar.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  /* ── Focus first sidebar item when overlay opens ── */
  useEffect(() => {
    if (!mobileOpen) return;
    // Small delay so the AnimatePresence DOM node mounts
    const timer = setTimeout(() => {
      const sidebar = document.getElementById("moeen-mobile-sidebar");
      const firstLink = sidebar?.querySelector('a[href]');
      firstLink?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [mobileOpen]);

  /* ── Return focus to hamburger on close ──────── */
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    // Delay so focus returns after AnimatePresence unmounts
    setTimeout(() => hamburgerRef.current?.focus(), 50);
  }, []);

  /* ── Determine effective layout ─────────────── */
  const pageTitle = pageTitles[location.pathname] || "مُعين";

  // Desktop: sidebar always visible with persisted collapsed state
  // Mobile/Tablet: hidden by default, overlay on demand
  const showDesktopSidebar = !isMobile;

  return (
    <div className="min-h-screen bg-background">
      <MouseGlowTrail />

      {/* ── Desktop Sidebar ─────────────────────── */}
      {showDesktopSidebar && (
        <Sidebar
          collapsed={collapsed}
          onToggle={toggleCollapsed}
          context="desktop"
        />
      )}

      {/* ── Mobile/Tablet Overlay ────────────────── */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="overlay"
              variants={OVERLAY_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
              onClick={closeMobile}
            />
            {/* Sidebar panel */}
            <motion.div
              key="panel"
              id="moeen-mobile-sidebar"
              variants={SIDEBAR_PANEL_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full z-50 shadow-2xl will-change-transform"
              role="dialog"
              aria-modal="true"
              aria-label="القائمة الرئيسية"
            >
              <Sidebar
                collapsed={false}
                context="mobile"
                onNavigate={closeMobile}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ────────────────────────── */}
      <main
        className={cn(
          "transition-[margin] duration-300 ease-in-out min-h-screen",
          // Desktop sidebar margin (no margin on mobile — overlay mode)
          showDesktopSidebar && (collapsed ? "md:mr-[72px]" : "md:mr-[260px]")
        )}
      >
        <TopBar
          hamburgerRef={hamburgerRef}
          onMenuToggle={() => setMobileOpen(true)}
          pageTitle={pageTitle}
          showHamburger={isMobile}
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

      {/* ── Mobile Bottom Nav ───────────────────── */}
      <MobileBottomNav />
    </div>
  );
}