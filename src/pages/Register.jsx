import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { UserPlus, Mail, Lock, User, Loader2, Eye, EyeOff, ShieldCheck, Building2, Search, Megaphone } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/lib/rbac";

const roleIcons = {
  platform_admin: ShieldCheck,
  ngo_manager:    Building2,
  researcher:     Search,
  marketer:       Megaphone,
};

const roleOptions = [
  ROLES.NGO_MANAGER,
  ROLES.RESEARCHER,
  ROLES.MARKETER,
];

export default function Register() {
  const [step, setStep]                   = useState(1);
  const [fullName, setFullName]           = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole]                   = useState("");
  const [organization, setOrganization]   = useState("");
  const [otpCode, setOtpCode]             = useState("");
  const [showPass, setShowPass]           = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (password.length < 8) {
      setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }
    if (!role) {
      setError("الرجاء اختيار دورك في المنصة");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep(2);
    } catch (err) {
      setError(err.message || "فشل إنشاء الحساب. الرجاء المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      // Save extra profile data
      await base44.auth.updateMe({ role, organization: organization || undefined });
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "رمز التحقق غير صحيح. حاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
    } catch (err) {
      setError(err.message || "تعذّر إعادة الإرسال");
    }
  };

  // Step 2 — OTP Verification
  if (step === 2) {
    return (
      <AuthLayout
        icon={Mail}
        title="تحقق من بريدك الإلكتروني"
        subtitle={`أرسلنا رمز التحقق إلى ${email}`}
        step={2}
        totalSteps={2}
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6" dir="ltr">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus>
            <InputOTPGroup>
              {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          className="w-full h-11 font-semibold cursor-pointer"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading
            ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري التحقق…</>
            : "تأكيد الحساب"
          }
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          لم تستلم الرمز؟{" "}
          <button onClick={handleResend} className="text-primary font-semibold hover:underline cursor-pointer">
            إعادة الإرسال
          </button>
        </p>
      </AuthLayout>
    );
  }

  // Step 1 — Registration Form
  return (
    <AuthLayout
      icon={UserPlus}
      title="إنشاء حساب جديد"
      subtitle="انضم إلى منصة مُعين للعمل الاجتماعي"
      step={1}
      totalSteps={2}
      footer={
        <>
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            سجّل دخولك
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

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName">الاسم الكامل</Label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              autoFocus
              placeholder="محمد عبدالله"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pr-10 h-11"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pr-10 h-11 text-left"
              dir="ltr"
              required
            />
          </div>
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <Label htmlFor="role">دورك في المنصة</Label>
          <Select value={role} onValueChange={setRole} required>
            <SelectTrigger id="role" className="h-11 w-full">
              <SelectValue placeholder="اختر دورك…" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((r) => {
                const RIcon = roleIcons[r];
                return (
                  <SelectItem key={r} value={r}>
                    <div className="flex items-center gap-2">
                      <RIcon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{ROLE_LABELS[r]}</p>
                        <p className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[r]}</p>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Organization (optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="org">
            المنظمة <span className="text-muted-foreground font-normal text-xs">(اختياري)</span>
          </Label>
          <Input
            id="org"
            type="text"
            placeholder="اسم المنظمة أو الجهة"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="h-11"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              placeholder="٨ أحرف على الأقل"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 pl-10 h-11"
              required
            />
            <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength indicator */}
          {password && (
            <div className="flex gap-1 mt-1.5">
              {[1,2,3,4].map(lvl => (
                <div key={lvl} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  password.length >= lvl * 2 + 2
                    ? lvl <= 1 ? "bg-red-500" : lvl <= 2 ? "bg-amber-500" : lvl <= 3 ? "bg-emerald-400" : "bg-emerald-600"
                    : "bg-muted"
                }`} />
              ))}
            </div>
          )}
        </div>

        {/* Confirm */}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10 pl-10 h-11"
              required
            />
            <button type="button" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-destructive mt-1">كلمتا المرور غير متطابقتين</p>
          )}
        </div>

        <Button type="submit" className="w-full h-11 font-semibold cursor-pointer" disabled={loading}>
          {loading
            ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الإنشاء…</>
            : "إنشاء الحساب"
          }
        </Button>
      </form>
    </AuthLayout>
  );
}