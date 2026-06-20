import { useState } from "react";
import { Link } from "react-router-dom";
import { coreApi } from "@/api/coreClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Eye, EyeOff, AlertCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

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
      await coreApi.auth.loginViaEmailPassword(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f4f8" }} dir="rtl">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ── Right column: Branding & Description ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 order-2 lg:order-1 text-center lg:text-right"
          >
            {/* Logo — glass container for transparent + prominent look */}
            <div className="flex justify-center lg:justify-start">
              <div
                className="rounded-3xl p-5 inline-flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 8px 32px rgba(12,49,64,0.12), 0 2px 8px rgba(0,166,81,0.08)",
                  border: "1px solid rgba(200,151,42,0.18)",
                }}
              >
                <img
                  src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/9af41b6fb_logo-.jpg"
                  alt="معين الرقمية التجارية"
                  className="h-24 w-auto object-contain"
                />
              </div>
            </div>

            {/* Headlines */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold leading-snug" style={{ color: "#0c3140", fontFamily: "Cairo, sans-serif" }}>
                منصة <span style={{ color: "#c8972a" }}>معين</span> الرقمية
              </h1>
              <p className="text-lg font-semibold" style={{ color: "#0c3140" }}>
                البحث الاجتماعي وإدارة المستفيدين
              </p>
              <p className="text-sm font-medium" style={{ color: "#c8972a" }}>
                البوابة الأولى لحوكمة الأثر الاجتماعي في المملكة العربية السعودية
              </p>
              <p className="text-sm leading-relaxed text-gray-500 max-w-md mx-auto lg:mx-0">
                نربط الباحثين الاجتماعيين والجمعيات الأهلية في منظومة رقمية متكاملة تضمن الشفافية والكفاءة وحوكمة التبرعات.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto lg:mx-0">
              {[
                { label: "جمعية نشطة", value: "٢٤" },
                { label: "مستفيد مسجّل", value: "١٬٢٤٨" },
                { label: "باحث ميداني", value: "٨٧" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-3 text-center"
                  style={{ background: "rgba(12,49,64,0.07)" }}
                >
                  <p className="text-xl font-bold" style={{ color: "#0c3140" }}>{stat.value}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Left column: Login Card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 p-8 border border-gray-100">
              {/* Card header */}
              <div className="mb-7 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
                  style={{ background: "#0c3140" }}
                >
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold" style={{ color: "#0c3140" }}>تسجيل الدخول</h2>
                <p className="text-sm text-gray-400 mt-1">أدخل بياناتك للوصول إلى المنصة</p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-start gap-2 p-3 rounded-xl text-sm"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: "#0c3140" }}>
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      autoComplete="email"
                      autoFocus
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pr-10 pl-4 rounded-xl border text-sm outline-none transition-all"
                      style={{
                        border: "1px solid #e2e8f0",
                        background: "#f8fafc",
                        color: "#0c3140",
                        direction: "ltr",
                        textAlign: "left",
                      }}
                      onFocus={e => e.target.style.border = "1.5px solid #c8972a"}
                      onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: "#0c3140" }}>
                      كلمة المرور
                    </label>
                    <Link to="/forgot-password" className="text-xs hover:underline" style={{ color: "#c8972a" }}>
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pr-10 pl-10 rounded-xl border text-sm outline-none transition-all"
                      style={{ border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0c3140" }}
                      onFocus={e => e.target.style.border = "1.5px solid #c8972a"}
                      onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPass(!showPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-bold text-white text-sm transition-all mt-2 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  style={{
                    background: loading ? "#8aadbc" : "linear-gradient(135deg, #0c3140, #1a5470)",
                    boxShadow: "0 4px 20px rgba(12,49,64,0.35)",
                  }}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />جاري الدخول…</>
                  ) : "دخول"}
                </button>
              </form>

              {/* Warning notice */}
              <div
                className="mt-6 flex items-start gap-2 rounded-xl p-3 text-xs leading-relaxed"
                style={{ background: "rgba(200,151,42,0.08)", border: "1px solid rgba(200,151,42,0.25)" }}
              >
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#c8972a" }} />
                <span className="text-gray-500">
                  هذه المنصة خاصة للجمعيات الخيرية ومشاريع البحوث الاجتماعية، تواصل مع مدير المنصة للدخول.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400">
        جميع الحقوق محفوظة — مؤسسة معين الرقمية التجارية &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}