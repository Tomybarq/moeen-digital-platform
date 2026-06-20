import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Globe, Moon, Sun, Save, Loader2, CheckCircle2, RotateCcw, Shield } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { coreApi } from "@/api/coreClient";
import { useAuth } from "@/lib/AuthContext";

const NOTIFICATION_TYPES = [
  { id: "case_update",   label: "تحديثات الحالات",       desc: "تغييرات حالة المستفيدين",              icon: "🔄" },
  { id: "task_assigned", label: "المهام الجديدة",         desc: "عند إسناد مهمة إليك",                 icon: "📋" },
  { id: "message",       label: "الرسائل",                desc: "رسائل من أعضاء الفريق",               icon: "💬" },
  { id: "system_alert",  label: "تنبيهات النظام",         desc: "إشعارات إدارية وتحديثات المنصة",      icon: "⚠️" },
  { id: "import_complete", label: "اكتمال الاستيراد",     desc: "عند انتهاء عمليات استيراد البيانات",  icon: "📥" },
  { id: "status_change", label: "تغييرات الحالة",         desc: "تغييرات حالة السجلات العامة",         icon: "🔀" },
  { id: "role_change",   label: "تغييرات الصلاحيات",      desc: "عند تعديل صلاحيات المستخدمين",        icon: "🔐" },
];

const DEFAULT_PREFS = Object.fromEntries(NOTIFICATION_TYPES.map(t => [t.id, true]));

export default function ProfilePrefsTab() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const prefs = user?.notification_prefs || DEFAULT_PREFS;

  const [notifEmail, setNotifEmail]   = useState(user?.notif_email ?? true);
  const [notifSystem, setNotifSystem] = useState(user?.notif_system ?? true);
  const [notifPrefs, setNotifPrefs]   = useState(prefs);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  const togglePref = (typeId) => {
    setNotifPrefs(prev => ({ ...prev, [typeId]: !prev[typeId] }));
  };

  const resetPrefs = () => {
    setNotifPrefs(DEFAULT_PREFS);
  };

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await coreApi.auth.updateMe({
        notif_email: notifEmail,
        notif_system: notifSystem,
        notification_prefs: notifPrefs,
      });
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

        {/* Notification Types */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> أنواع الإشعارات
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground cursor-pointer"
              onClick={resetPrefs}
            >
              <RotateCcw className="w-3 h-3 ml-1" />
              إعادة التعيين
            </Button>
          </div>
          <div className="space-y-1.5">
            {NOTIFICATION_TYPES.map(item => (
              <div key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={notifPrefs[item.id] ?? true}
                  onCheckedChange={() => togglePref(item.id)}
                  className="cursor-pointer"
                  dir="ltr"
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

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