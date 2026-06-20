import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { coreApi } from "@/api/coreClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

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
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#fcfcfc" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-2xl p-8 border"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(18px)",
              borderColor: "rgba(200,150,42,0.15)",
              boxShadow: "0 20px 60px -12px rgba(12,49,64,0.15)",
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 mx-auto" style={{ background: "rgba(200,150,42,0.1)" }}>
              <AlertTriangle className="w-6 h-6" style={{ color: "#c8972a" }} />
            </div>
            <h1 className="text-xl font-extrabold text-center mb-2" style={{ color: "#0c3140" }}>رابط غير صالح</h1>
            <p className="text-sm text-center text-gray-500 mb-6">هذا الرابط غير مكتمل أو منتهي الصلاحية</p>
            <a
              href="/forgot-password"
              className="block w-full text-center py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #0c3140 0%, #1a5470 100%)",
                boxShadow: "0 4px 20px rgba(12,49,64,0.35)",
              }}
            >
              طلب رابط استعادة جديد
            </a>
          </div>
        </motion.div>
      </div>
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
      setError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل");
      return;
    }
    // Saudi cybersecurity guideline: enforce mix of letters + digits
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError("يجب أن تحتوي كلمة المرور على أحرف وأرقام معاً");
      return;
    }

    setLoading(true);
    try {
      // TODO: Execute secure hash update via @/api/coreClient to Moeen Cloud Engine
      await coreApi.auth.resetPassword({ resetToken, newPassword });
      setDone(true);
      toast.success("تم تحديث كلمة المرور بنجاح", { duration: 5000 });
    } catch (err) {
      setError(err.message || "فشل تغيير كلمة المرور. قد يكون الرابط منتهي الصلاحية.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#fcfcfc" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-2xl p-8 text-center border"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(18px)",
              borderColor: "rgba(200,150,42,0.2)",
              boxShadow: "0 20px 60px -12px rgba(12,49,64,0.15)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(0,166,81,0.1)" }}
            >
              <CheckCircle2 className="w-8 h-8" style={{ color: "#00A651" }} />
            </div>
            <h1 className="text-xl font-extrabold mb-2" style={{ color: "#0c3140" }}>تم تحديث كلمة المرور</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              تم تغيير كلمة مرورك بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
            </p>
            <Button
              className="w-full h-12 rounded-xl font-bold text-white text-sm cursor-pointer shadow-lg"
              style={{
                background: "linear-gradient(135deg, #0c3140 0%, #1a5470 100%)",
                boxShadow: "0 4px 20px rgba(12,49,64,0.35)",
              }}
              onClick={() => { window.location.href = "/"; }}
            >
              العودة إلى المنصة
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#fcfcfc" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{ background: "linear-gradient(135deg, #0c3140, #1a5470)", boxShadow: "0 8px 32px rgba(12,49,64,0.3)" }}>
            <ShieldCheck className="w-7 h-7" style={{ color: "#c8972a" }} />
          </div>
          <span className="text-2xl font-extrabold font-display" style={{ color: "#0c3140" }}>مُعين</span>
          <span className="text-xs text-gray-400 mt-1">استعادة كلمة المرور</span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(18px)",
            borderColor: "rgba(200,150,42,0.2)",
            boxShadow: "0 20px 60px -12px rgba(12,49,64,0.15)",
          }}
        >
          {/* Header */}
          <div className="mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(200,150,42,0.1)" }}>
              <Lock className="w-5 h-5" style={{ color: "#c8972a" }} />
            </div>
            <h1 className="text-xl font-extrabold" style={{ color: "#0c3140" }}>تعيين كلمة مرور جديدة</h1>
            <p className="text-sm text-gray-500 mt-1.5">اختر كلمة مرور قوية لحماية حسابك</p>
          </div>

          {error && (
            <div
              className="mb-5 p-3 rounded-xl text-sm flex items-start gap-2"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <Label style={{ color: "#0c3140" }}>كلمة المرور الجديدة</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  autoFocus
                  placeholder="٨ أحرف على الأقل"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10 pl-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:border-[#c8972a] focus:ring-1 focus:ring-[#c8972a]/30"
                  required
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength indicator — Saudi cybersecurity compliance */}
              {newPassword && (
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4].map(lvl => {
                    const hasLength = newPassword.length >= lvl * 2 + 2;
                    const hasMix = /[a-zA-Z]/.test(newPassword) && /[0-9]/.test(newPassword);
                    const isStrong = hasLength && (lvl <= 2 || hasMix);
                    return (
                      <div key={lvl} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        hasLength
                          ? isStrong
                            ? lvl <= 2 ? "bg-amber-500" : lvl === 3 ? "bg-emerald-400" : "bg-emerald-600"
                            : "bg-red-400"
                          : "bg-gray-200"
                      }`} />
                    );
                  })}
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-1">
                امتثالاً لمعايير الأمن السيبراني السعودية: يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، وتتضمّن أحرفاً وأرقاماً.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label style={{ color: "#0c3140" }}>تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="pr-10 pl-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:border-[#c8972a] focus:ring-1 focus:ring-[#c8972a]/30"
                  required
                />
                <button type="button" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">كلمتا المرور غير متطابقتين</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-white text-sm cursor-pointer shadow-lg transition-all mt-2"
              style={{
                background: "linear-gradient(135deg, #c8972a 0%, #d4a940 100%)",
                boxShadow: "0 4px 20px rgba(200,150,42,0.4)",
              }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري التحديث…
                </span>
              ) : (
                "تحديث كلمة المرور والدخول"
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}