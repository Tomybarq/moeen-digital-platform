import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { coreApi } from "@/api/coreClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const [searchParams]                    = useSearchParams();
  const resetToken                        = searchParams.get("token");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirm]     = useState("");
  const [showPass, setShowPass]           = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [done, setDone]                   = useState(false);

  if (!resetToken) {
    return (
      <AuthLayout icon={AlertTriangle} title="رابط غير صالح" subtitle="هذا الرابط غير مكتمل أو منتهي الصلاحية">
        <p className="text-sm text-muted-foreground text-center">
          يرجى طلب{" "}
          <a href="/forgot-password" className="text-primary font-semibold hover:underline">
            رابط استعادة جديد
          </a>
          .
        </p>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (newPassword.length < 8) {
      setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      await coreApi.auth.resetPassword({ resetToken, newPassword });
      setDone(true);
    } catch (err) {
      setError(err.message || "فشل تغيير كلمة المرور. قد يكون الرابط منتهي الصلاحية.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout icon={CheckCircle2} title="تم تغيير كلمة المرور">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            تم تغيير كلمة مرورك بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
          </p>
          <Button className="w-full h-11 cursor-pointer" onClick={() => { window.location.href = "/login"; }}>
            الذهاب لتسجيل الدخول
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title="تعيين كلمة مرور جديدة"
      subtitle="اختر كلمة مرور قوية لحماية حسابك"
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="newPass">كلمة المرور الجديدة</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="newPass"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              autoFocus
              placeholder="٨ أحرف على الأقل"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-10 pl-10 h-11"
              required
            />
            <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {newPassword && (
            <div className="flex gap-1 mt-1.5">
              {[1,2,3,4].map(lvl => (
                <div key={lvl} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  newPassword.length >= lvl * 2 + 2
                    ? lvl <= 1 ? "bg-red-500" : lvl <= 2 ? "bg-amber-500" : lvl <= 3 ? "bg-emerald-400" : "bg-emerald-600"
                    : "bg-muted"
                }`} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              className="pr-10 pl-10 h-11"
              required
            />
            <button type="button" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-destructive mt-1">كلمتا المرور غير متطابقتين</p>
          )}
        </div>

        <Button type="submit" className="w-full h-11 font-semibold cursor-pointer" disabled={loading}>
          {loading
            ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الحفظ…</>
            : "تعيين كلمة المرور"
          }
        </Button>
      </form>
    </AuthLayout>
  );
}