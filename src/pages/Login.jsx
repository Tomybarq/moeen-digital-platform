import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="تسجيل الدخول"
      subtitle="أدخل بياناتك للوصول إلى منصة مُعين"
      footer={
        <>
          ليس لديك حساب؟{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            سجّل الآن
          </Link>
        </>
      }
    >
      {/* Google */}
      <Button
        variant="outline"
        className="w-full h-11 text-sm font-medium mb-5 cursor-pointer gap-2"
        onClick={() => base44.auth.loginWithProvider("google", "/")}
        type="button"
      >
        <GoogleIcon className="w-4 h-4" />
        المتابعة بحساب جوجل
      </Button>

      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground">أو بالبريد الإلكتروني</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">كلمة المرور</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 pl-10 h-11"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPass(!showPass)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full h-11 font-semibold cursor-pointer" disabled={loading}>
          {loading ? (
            <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الدخول…</>
          ) : (
            "دخول"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}