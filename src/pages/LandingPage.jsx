import { motion } from "framer-motion";
import { useState } from "react";
import { Database, BarChart3, Megaphone, User, Lock, ShieldAlert, Eye, EyeOff } from "lucide-react";
import TrustBadges from "@/components/landing/TrustBadges";
import FeatureBanner from "@/components/landing/FeatureBanner";
import ProcessFlow from "@/components/landing/ProcessFlow";
import WhyMoeen from "@/components/landing/WhyMoeen";
import FooterCTA from "@/components/landing/FooterCTA";
import FloatingControls from "@/components/landing/FloatingControls";

const valuePillars = [
{
  icon: Database,
  title: "جمع البيانات الذكي",
  en: "Smart Data Collection",
  desc: "استمارات ذكية وبحوث ميدانية لجمع بيانات المستفيدين بدقة وكفاءة عالية."
},
{
  icon: BarChart3,
  title: "تحليلات المنظمات",
  en: "NGO Analytics",
  desc: "لوحات تحكم فورية وتقارير تحوّل البيانات الخام إلى رؤى قابلة للتنفيذ."
},
{
  icon: Megaphone,
  title: "تتبع المسوّقين",
  en: "Marketer Tracking",
  desc: "متابعة أداء المسوّقين وقياس أثر حملات التبرع عبر لوحة متكاملة."
}];


export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Auth handled by the platform
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#fcfcfc] font-body">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/9af41b6fb_logo-.jpg"
              alt="معين الرقمية التجارية"
              className="h-10 w-auto object-contain" />
            
            <div className="leading-tight hidden sm:block">
              <p className="font-display font-bold text-brand-navy text-sm">منصة معين الرقمية</p>
              <p className="text-[9px] text-gray-400 tracking-wide">MOEEN DIGITAL TRADING</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-3">
            <TrustBadges />
          </div>
        </div>
      </header>

      {/* ── Integrated Entry Portal (Split‑Screen) ── */}
      <section className="min-h-[calc(100vh-73px)] flex" style={{ background: "#fcfcfc" }}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-5">

          {/* Right Column — Branding & Value (60% ≈ 3/5) */}
          <div className="lg:col-span-3 flex flex-col justify-center relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0c3140 0%, #0d4a60 50%, #0c3140 100%)" }}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.06] -translate-y-32 translate-x-16" style={{ background: "#c8972a" }} />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-[0.04]" style={{ background: "#00A651" }} />
            <div className="absolute top-1/2 right-1/3 w-1 h-48 -translate-y-1/2 opacity-[0.03]" style={{ background: "linear-gradient(180deg, transparent, #c8972a, transparent)" }} />

            <div className="relative z-10 px-8 sm:px-12 lg:px-16 py-10 lg:py-14">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-10">
                
                {/* Logo + name */}
                <div className="flex items-center gap-3 mb-7">
                  <img
                    src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/9af41b6fb_logo-.jpg"
                    alt="معين"
                    className="h-12 w-auto object-contain" />
                  
                  <div>
                    <p className="font-display font-bold text-white text-lg leading-tight">منصة معين الرقمية</p>
                    <p className="text-[10px] text-brand-gold/60 tracking-widest">MOEEN DIGITAL PLATFORM</p>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold leading-tight text-white mb-4">
                  منصة{" "}
                  <span style={{ color: "#c8972a" }}>ذكية</span>
                  {" "}لإدارة العمل الخيري
                </h1>
                <p className="text-white/55 text-sm sm:text-base leading-relaxed max-w-md">منصة مصصمة بعنايةتربط المستفيدين بالمتبرعين من خلال بيانات آمنة، تحليلات فورية، وأثر قابل للقياس.

                </p>
              </motion.div>

              {/* 3 Value Pillars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {valuePillars.map((p, i) =>
                <div
                  key={p.en}
                  className="rounded-2xl p-4 sm:p-5 transition-all group"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)"
                  }}>
                  
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(200,151,42,0.12)" }}>
                      <p.icon className="w-5 h-5" style={{ color: "#c8972a" }} />
                    </div>
                    <h3 className="font-bold text-sm text-white mb-1.5">{p.title}</h3>
                    <p className="text-[11px] sm:text-xs leading-relaxed text-white/45">{p.desc}</p>
                  </div>
                )}
              </motion.div>

              {/* Trust badge strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-8 flex items-center gap-3 flex-wrap">
                
                <TrustBadges />
              </motion.div>
            </div>
          </div>

          {/* Left Column — Auth Form (40% ≈ 2/5) */}
          <div className="lg:col-span-2 flex items-center justify-center p-6 sm:p-10 lg:p-12" style={{ background: "#f8fafc" }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-sm">
              
              {/* Form Card */}
              <div
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100"
                style={{ boxShadow: "0 20px 60px -12px rgba(12,49,64,0.12)" }}>
                
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(12,49,64,0.06)" }}>
                    <Lock className="w-7 h-7" style={{ color: "#c8972a" }} />
                  </div>
                  <h2 className="text-xl font-extrabold font-display text-brand-navy mb-1">تسجيل الدخول</h2>
                  <p className="text-sm text-gray-400">أدخل بياناتك للوصول إلى المنصة</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        required />
                      
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
                        required />
                      
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPass(!showPass)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        
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
                      boxShadow: "0 4px 20px rgba(12,49,64,0.35)"
                    }}>
                    
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Feature Banner (Dark Navy Mission Strip) ── */}
      <FeatureBanner />

      {/* ── Two Column Section: Process Flow + Why Moeen ── */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ProcessFlow />
            <WhyMoeen />
          </div>
        </div>
      </section>

      {/* ── Saudi Arabia Map Section — Dark Immersive ── */}
      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: "#0a232c" }}>
        {/* Subtle radial glow behind map area */}
        <div
          className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, #c8972a 0%, transparent 70%)" }} />
        

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Map visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex justify-center">
              
              <div className="relative w-full max-w-sm">
                {/* Map container with gold glow border */}
                <div
                  className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(12, 49, 64, 0.5)",
                    boxShadow: "0 0 40px rgba(200, 150, 42, 0.2), 0 0 80px rgba(200, 150, 42, 0.08), inset 0 0 60px rgba(12, 49, 64, 0.3)",
                    border: "1.5px solid rgba(200, 150, 42, 0.35)"
                  }}>
                  
                  {/* Map silhouette */}
                  <img
                    src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/945b4a89f_generated_image.png"
                    alt="خريطة المملكة العربية السعودية"
                    className="w-full h-full object-contain p-4"
                    style={{ filter: "drop-shadow(0 0 15px rgba(200, 150, 42, 0.3))" }} />
                  
                </div>

                {/* Decorative gold skyline */}
                <div className="absolute -bottom-1 left-0 right-0 h-12 pointer-events-none" style={{ opacity: 0.5 }}>
                  <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 80 L0 40 L20 32 L40 45 L55 28 L70 40 L90 22 L105 35 L120 18 L140 30 L155 15 L170 25 L185 10 L200 22 L215 8 L230 18 L245 5 L260 15 L275 8 L290 18 L305 4 L320 12 L335 8 L350 16 L365 6 L380 14 L395 5 L400 10 L400 80 Z" fill="#c8972a" />
                  </svg>
                </div>

                {/* Palm tree silhouettes */}
                <div className="absolute -bottom-1 right-4 text-4xl pointer-events-none select-none" style={{ filter: "brightness(0) saturate(100%) invert(64%) sepia(33%) saturate(702%) hue-rotate(5deg) brightness(92%) contrast(90%)", opacity: 0.7 }}>🌴</div>
                <div className="absolute -bottom-1 right-20 text-3xl pointer-events-none select-none" style={{ filter: "brightness(0) saturate(100%) invert(64%) sepia(33%) saturate(702%) hue-rotate(5deg) brightness(92%) contrast(90%)", opacity: 0.7 }}>🌴</div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center lg:text-right">
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-5 leading-tight">
                Serving <span className="text-brand-gold">NGOs</span> Across <span className="text-brand-gold">Saudi Arabia</span>
              </h2>
              <p className="text-lg mb-4" style={{ color: "#d4af37", opacity: 0.85 }}>
                نخدم الجمعيات في جميع أنحاء المملكة العربية السعودية
              </p>
              <p className="text-white/65 leading-relaxed text-sm sm:text-base max-w-md mx-auto lg:mx-0 mb-8">
                From Riyadh to Jeddah, Dammam to Abha — our platform empowers
                charitable organizations and social researchers across every
                region of the Kingdom, bridging the gap between those in need
                and those who can help.
              </p>

              {/* Metric cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm mx-auto lg:mx-0">
                {[
                { num: "13+", label: "Regions" },
                { num: "24", label: "Active NGOs" },
                { num: "1.2K+", label: "Beneficiaries" }].
                map((s) =>
                <div
                  key={s.label}
                  className="text-center rounded-xl py-4 px-2"
                  style={{
                    background: "linear-gradient(180deg, rgba(200,150,42,0.08) 0%, rgba(12,49,64,0.3) 100%)",
                    border: "1px solid rgba(200,150,42,0.2)"
                  }}>
                  
                    <p className="text-2xl sm:text-3xl font-bold text-brand-gold">{s.num}</p>
                    <p className="text-[11px] sm:text-xs text-white/50 mt-1.5">{s.label}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <FooterCTA />

      {/* ── Floating Controls ── */}
      <FloatingControls />
    </div>);

}