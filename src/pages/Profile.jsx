import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCircle, Mail, Phone, Building2, Save, Loader2, Shield, LogOut, KeyRound, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import RoleBadge from "@/components/auth/RoleBadge";
import ChangePasswordDialog from "@/components/auth/ChangePasswordDialog";

export default function Profile() {
  const { user, logout } = useAuth();
  const [fullName, setFullName]       = useState(user?.full_name || "");
  const [phone, setPhone]             = useState(user?.phone || "");
  const [organization, setOrganization] = useState(user?.organization || "");
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await base44.auth.updateMe({ phone, organization });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold text-foreground">الملف الشخصي</h2>
        <p className="text-sm text-muted-foreground mt-1">عرض وتحديث بيانات حسابك الشخصي</p>
      </motion.div>

      {/* Identity card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground truncate">
                  {user?.full_name || "—"}
                </p>
                <p className="text-sm text-muted-foreground truncate" dir="ltr">
                  {user?.email}
                </p>
                <div className="mt-2">
                  {user?.role && <RoleBadge role={user.role} size="sm" />}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">المعلومات الشخصية</CardTitle>
            <CardDescription>تحديث بيانات ملفك الشخصي</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fname">الاسم الكامل</Label>
                <div className="relative">
                  <UserCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="pr-10 h-11 bg-muted/40 cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">الاسم لا يمكن تغييره من هنا</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email-view">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email-view"
                    value={user?.email || ""}
                    className="pr-10 h-11 bg-muted/40 text-left cursor-not-allowed"
                    dir="ltr"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 5x xxx xxxx"
                      className="pr-10 h-11"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="org">المنظمة</Label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="org"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="اسم المنظمة"
                      className="pr-10 h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={saving} className="cursor-pointer gap-2">
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" />جاري الحفظ…</>
                    : saved
                    ? <><CheckCircle2 className="w-4 h-4" />تم الحفظ</>
                    : <><Save className="w-4 h-4" />حفظ التغييرات</>
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              الأمان
            </CardTitle>
            <CardDescription>إدارة كلمة المرور وأمان الحساب</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-6 space-y-3">
            <Button
              variant="outline"
              className="w-full h-11 cursor-pointer justify-start gap-3"
              onClick={() => setShowChangePwd(true)}
            >
              <KeyRound className="w-4 h-4 text-muted-foreground" />
              تغيير كلمة المرور
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 cursor-pointer justify-start gap-3 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <ChangePasswordDialog open={showChangePwd} onClose={() => setShowChangePwd(false)} />
    </div>
  );
}