import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import UnauthorizedBanner from "@/components/auth/UnauthorizedBanner";
import RolesPermissionsTab from "@/components/settings/RolesPermissionsTab";
import ActivityMonitorTab from "@/components/settings/ActivityMonitorTab";
import PlatformConfigTab from "@/components/settings/PlatformConfigTab";
import { Shield, BarChart2, Settings, ShieldCheck } from "lucide-react";

const TABS = [
  { id: "roles",    label: "الأدوار والصلاحيات",    icon: Shield,    desc: "إدارة المستخدمين وتعيين الأدوار" },
  { id: "monitor",  label: "مراقبة النشاط",           icon: BarChart2, desc: "تتبع الأداء والأنشطة" },
  { id: "config",   label: "إعدادات المنصة",          icon: Settings,  desc: "تكوين إعدادات المنصة" },
];

export default function PlatformSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("roles");

  if (user?.role !== "platform_admin") {
    return <UnauthorizedBanner message="هذه الصفحة مخصصة لمدير المنصة فقط. تواصل مع المسؤول لمنحك الصلاحيات المناسبة." />;
  }

  const activeTabData = TABS.find(t => t.id === activeTab);

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">إعدادات المنصة</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              منصة مُعين الرقمية — لوحة تحكم مدير المنصة
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Tab bar ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.06 }}>
        <div className="flex border border-border rounded-xl overflow-hidden bg-muted/20">
          {TABS.map(tab => {
            const TIcon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-3 text-sm font-medium transition-all cursor-pointer",
                  active
                    ? "bg-card shadow-sm text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}>
                <TIcon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline text-xs sm:text-sm">{tab.label}</span>
                <span className="sm:hidden text-[10px] leading-tight text-center">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active tab description */}
        {activeTabData && (
          <p className="text-xs text-muted-foreground mt-2 px-1">{activeTabData.desc}</p>
        )}
      </motion.div>

      {/* ── Tab content ── */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "roles"   && <RolesPermissionsTab />}
        {activeTab === "monitor" && <ActivityMonitorTab />}
        {activeTab === "config"  && <PlatformConfigTab />}
      </motion.div>
    </div>
  );
}