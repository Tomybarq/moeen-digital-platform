import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ShieldAlert, Eye, EyeOff, X } from "lucide-react";

export default function SignInModal({ open, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Auth handled by the platform
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          dir="rtl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header — Concentric Gold Halo */}
          <div className="relative text-center py-10 overflow-hidden" style={{
            backgroundImage: "url('https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/4679c316f_generated_image.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#0a0e14",
          }}>
            {/* Lock icon with 3D glassmorphism */}
            <div className="relative z-10 mx-auto mb-4" style={{ width: 72, height: 72 }}>
              {/* Outer halo ring 1 */}
              <div className="absolute inset-0 rounded-full" style={{
                background: "radial-gradient(circle, rgba(197,160,89,0.24) 0%, rgba(197,160,89,0.06) 50%, transparent 70%)",
                filter: "blur(4px)",
              }} />
              {/* Outer halo ring 2 */}
              <div className="absolute -inset-3 rounded-full" style={{
                background: "radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 60%)",
                filter: "blur(6px)",
              }} />
              {/* Outer halo ring 3 */}
              <div className="absolute -inset-6 rounded-full" style={{
                background: "radial-gradient(circle, rgba(197,160,89,0.08) 0%, transparent 50%)",
                filter: "blur(8px)",
              }} />
              {/* Glassmorphism lock container */}
              <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1.5px solid rgba(212,175,55,0.3)",
                boxShadow: "0 0 40px rgba(212,175,55,0.08), inset 0 0 20px rgba(255,255,255,0.04)",
              }}>
                <Lock className="w-8 h-8" style={{ color: "#d4af37", filter: "drop-shadow(0 0 6px rgba(212,175,55,0.3))" }} />
              </div>
            </div>

            {/* Text */}
            <h2 className="relative z-10 text-2xl font-extrabold mb-1.5 font-display" style={{
              background: "linear-gradient(180deg, #e6c273 0%, #c5a059 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>مرحباً بك</h2>
            <p className="relative z-10 text-sm" style={{ color: "#d1d5db" }}>قم بتسجيل الدخول للمنصة</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-navy">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 pr-10 pl-4 rounded-xl border border-gray-200 bg-gray-50 text-brand-navy text-sm outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-navy">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pr-10 pl-10 rounded-xl border border-gray-200 bg-gray-50 text-brand-navy text-sm outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
              style={{
                background: "linear-gradient(135deg, #0c3140 0%, #1a5470 100%)",
                boxShadow: "0 4px 20px rgba(12,49,64,0.35)",
              }}
            >
              <Lock className="w-4 h-4" />
              الدخول للمنصة
            </button>

            {/* Warning notice */}
            <div className="flex items-start gap-2.5 rounded-xl p-3 bg-brand-gold/[0.07] border border-brand-gold/20">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-brand-gold" />
              <span className="text-xs text-gray-500 leading-relaxed">
                الدخول خاص للمنظمات الأهلية — تواصل مع إدارة المنصة للدخول
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}