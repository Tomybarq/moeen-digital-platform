import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Save, Loader2, CheckCircle2, Palette, Globe, Bell, Shield, Database, Moon, Sun, Info, Settings } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

function ConfigRow({ icon: RowIcon, title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <RowIcon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function PlatformConfigTab() {
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  // Simulated toggleable platform settings
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [maintenanceMode, setMaintenanceMode]       = useState(false);
  const [emailNotifs, setEmailNotifs]               = useState(true);
  const [dataRetention, setDataRetention]           = useState(true);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5">

      {/* Appearance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" /> المظهر والعرض
          </CardTitle>
          <CardDescription>ضبط مظهر المنصة وتجربة المستخدم</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-5 divide-y divide-border">
          <ConfigRow icon={theme === "dark" ? Moon : Sun}
            title="الوضع الليلي"
            desc={theme === "dark" ? "المنصة تعمل حالياً بالوضع الداكن" : "المنصة تعمل حالياً بالوضع الفاتح"}>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} className="cursor-pointer" />
          </ConfigRow>
          <ConfigRow icon={Globe} title="اللغة والمنطقة" desc="العربية — المملكة العربية السعودية 🇸🇦">
            <Badge variant="secondary" className="font-mono text-xs">AR-SA</Badge>
          </ConfigRow>
        </CardContent>
      </Card>

      {/* Access & Registration */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> الوصول والتسجيل
          </CardTitle>
          <CardDescription>إدارة صلاحيات وصول المستخدمين</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-5 divide-y divide-border">
          <ConfigRow icon={Shield} title="السماح بتسجيل مستخدمين جدد"
            desc="عند التعطيل لن يتمكن أحد من التسجيل بدون دعوة">
            <Switch checked={allowRegistration} onCheckedChange={setAllowRegistration} className="cursor-pointer" />
          </ConfigRow>
          <ConfigRow icon={Shield} title="وضع الصيانة"
            desc="تعطيل المنصة مؤقتاً للصيانة — يظهر للمستخدمين رسالة توضيحية">
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} className="cursor-pointer" />
          </ConfigRow>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> الإشعارات
          </CardTitle>
          <CardDescription>إعدادات إشعارات المنصة</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-5 divide-y divide-border">
          <ConfigRow icon={Bell} title="إشعارات البريد الإلكتروني"
            desc="إرسال تنبيهات للمستخدمين عبر البريد الإلكتروني">
            <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} className="cursor-pointer" />
          </ConfigRow>
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" /> البيانات والنسخ الاحتياطي
          </CardTitle>
          <CardDescription>سياسات الاحتفاظ بالبيانات وأمنها</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-5 divide-y divide-border">
          <ConfigRow icon={Database} title="الاحتفاظ بالبيانات المؤرشفة"
            desc="الاحتفاظ بسجلات المستفيدين والمنظمات المؤرشفة لمدة عام">
            <Switch checked={dataRetention} onCheckedChange={setDataRetention} className="cursor-pointer" />
          </ConfigRow>
        </CardContent>
      </Card>

      {/* Info note */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          التغييرات في هذه الإعدادات تؤثر على جميع مستخدمي المنصة. تأكد من مراجعة أي تغيير قبل حفظه.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} className="cursor-pointer gap-2 min-w-36">
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" />جاري الحفظ…</>
            : saved
            ? <><CheckCircle2 className="w-4 h-4" />تم الحفظ ✓</>
            : <><Save className="w-4 h-4" />حفظ الإعدادات</>}
        </Button>
        {saved && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ تم حفظ إعدادات المنصة
          </motion.p>
        )}
      </div>
    </div>
  );
}