import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // Always show success — don't reveal if email exists
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="استعادة كلمة المرور"
      subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة"
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline">
          <ArrowRight className="w-3.5 h-3.5" />
          العودة لتسجيل الدخول
        </Link>
      }
    >
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <p className="font-semibold text-foreground mb-2">تم الإرسال بنجاح</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            إذا كان البريد مسجّلاً، ستصلك رسالة تحتوي على رابط استعادة كلمة المرور خلال دقائق. تحقق من البريد الوارد أو مجلد الرسائل غير المرغوب فيها.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 h-11 text-left"
                dir="ltr"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 font-semibold cursor-pointer" disabled={loading}>
            {loading
              ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الإرسال…</>
              : "إرسال رابط الاستعادة"
            }
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}