import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Globe, Moon, Sun, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function ProfilePrefsTab() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [notifEmail, setNotifEmail]   = useState(user?.notif_email ?? true);
  const [notifSystem, setNotifSystem] = useState(user?.notif_system ?? true);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await base44.auth.updateMe({ notif_email: notifEmail, notif_system: notifSystem });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const notifItems = [
    { label: "إشعارات البريد الإلكتروني", desc: "تلقي تنبيهات عبر البريد الإلكتروني", val: notifEmail, set: setNotifEmail },
    { label: "الإشعارات داخل المنصة",     desc: "تنبيهات تظهر أثناء تصفحك للمنصة",    val: notifSystem, set: setNotifSystem },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" /> التفضيلات
        </CardTitle>
        <CardDescription>تخصيص مظهر المنصة وإعدادات الإشعارات</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 space-y-6">

        {/* Appearance */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> المظهر واللغة
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                {theme === "dark"
                  ? <Moon className="w-4 h-4 text-indigo-400" />
                  : <Sun className="w-4 h-4 text-amber-500" />}
                <div>
                  <p className="text-sm font-medium">الوضع الليلي</p>
                  <p className="text-xs text-muted-foreground">{theme === "dark" ? "مفعّل" : "معطّل"}</p>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} className="cursor-pointer" dir="ltr" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">اللغة والمنطقة</p>
                  <p className="text-xs text-muted-foreground">العربية — المملكة العربية السعودية</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs font-mono">AR-SA 🇸🇦</Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Notifications */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> الإشعارات
          </p>
          <div className="space-y-2">
            {notifItems.map(item => (
              <div key={item.label}
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <Switch checked={item.val} onCheckedChange={item.set} className="cursor-pointer" dir="ltr" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer gap-2 min-w-36">
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" />جاري الحفظ…</>
              : saved
              ? <><CheckCircle2 className="w-4 h-4" />تم الحفظ ✓</>
              : <><Save className="w-4 h-4" />حفظ التفضيلات</>}
          </Button>
          {saved && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ تم حفظ التفضيلات
            </motion.p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}