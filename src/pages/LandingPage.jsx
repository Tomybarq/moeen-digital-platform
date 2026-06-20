import { motion } from "framer-motion";
import { useState } from "react";
import { ClipboardList, BarChart3, UsersRound, Lock, LogIn } from "lucide-react";
import SignInModal from "@/components/landing/SignInModal";
import TrustBadges from "@/components/landing/TrustBadges";
import FeatureBanner from "@/components/landing/FeatureBanner";
import ProcessFlow from "@/components/landing/ProcessFlow";
import WhyMoeen from "@/components/landing/WhyMoeen";
import FooterCTA from "@/components/landing/FooterCTA";
import FloatingControls from "@/components/landing/FloatingControls";

const heroFeatures = [
  {
    icon: ClipboardList,
    title: "Smart Data Collection",
    ar: "جمع البيانات الذكي",
    desc: "Streamlined forms and field surveys for researchers to capture beneficiary data accurately and efficiently."
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    ar: "تحليلات فورية",
    desc: "Live dashboards and reports that turn raw data into actionable insights for decision-makers."
  },
  {
    icon: UsersRound,
    title: "Bridge the Gap",
    ar: "سد الفجوة",
    desc: "Connecting beneficiaries with donors through transparent, verified, and impactful case management."
  },
  {
    icon: Lock,
    title: "Secure & Compliant",
    ar: "آمن ومتوافق",
    desc: "Enterprise-grade security with full compliance to Saudi data protection and privacy regulations."
  }
];

export default function LandingPage() {
  const [signInOpen, setSignInOpen] = useState(false);

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
              className="h-10 w-auto object-contain"
            />
            <div className="leading-tight hidden sm:block">
              <p className="font-display font-bold text-brand-navy text-sm">منصة معين الرقمية</p>
              <p className="text-[9px] text-gray-400 tracking-wide">MOEEN DIGITAL TRADING</p>
            </div>
          </div>

          {/* Trust Badges + Sign In */}
          <div className="flex items-center gap-3">
            <TrustBadges />
            <button
              onClick={() => setSignInOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy text-white text-sm font-medium hover:bg-brand-navy/90 transition-all shadow-md shadow-brand-navy/20"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الدخول</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Split: Text + Device Mockups) — Pure Gold ── */}
      <section className="py-8 md:py-14 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: "#FDFCF8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: Text + Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8 text-center lg:text-right"
            >
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold leading-tight tracking-tight" style={{ color: "#1E293B" }}>
                  Moeen Digital{" "}
                  <span style={{ color: "#C5A059" }}>Platform</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl font-semibold leading-relaxed" style={{ color: "#C5A059" }}>
                  Empowering NGOs & Social Researchers to Collect Data and Transform Lives
                </p>
                <p className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0" style={{ color: "#94a3b8" }}>
                  A smart B2B platform that connects Beneficiaries and Donors through
                  secure data, real-time insights, and measurable impact.
                </p>
              </div>

              {/* 4 Feature Cards — Gold top border */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0">
                {heroFeatures.map((f) => (
                  <div
                    key={f.title}
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all group border-t-[3px]"
                    style={{ borderTopColor: "#C5A059", borderLeft: "1px solid #f1f5f9", borderRight: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}
                  >
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
                      style={{ background: "rgba(197,160,89,0.1)" }}
                    >
                      <f.icon className="w-5 h-5" style={{ color: "#C5A059" }} />
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: "#1E293B" }}>{f.title}</h3>
                    <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: "#94a3b8" }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Device Mockups — Pure Gold */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative flex items-center justify-center"
            >
              {/* Decorative glow */}
              <div className="absolute inset-0 blur-3xl rounded-full scale-75" style={{ background: "rgba(197,160,89,0.04)" }} />

              {/* Desktop Monitor Mockup — Pure Gold Frame */}
              <div className="relative z-10">
                <div
                  className="rounded-2xl p-[4px] max-w-md lg:max-w-lg relative"
                  style={{
                    background: "linear-gradient(145deg, #d4b06a, #C5A059, #b8943a, #C5A059)",
                    boxShadow: "0 25px 60px -15px rgba(30,41,59,0.25), 0 0 0 1px rgba(197,160,89,0.2)",
                  }}
                >
                  {/* Inner screen — white */}
                  <div className="rounded-[14px] overflow-hidden border" style={{ background: "#ffffff", borderColor: "#f1f5f9" }}>
                    {/* Browser bar — light */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-white border-b border-gray-100">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <div className="flex-1 mx-2 h-5 bg-gray-50 rounded-md border border-gray-100" />
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded" style={{ background: "#C5A059", opacity: 0.4 }} />
                        <div className="h-2.5 w-5 bg-gray-100 rounded-sm" />
                      </div>
                    </div>

                    {/* Dashboard content — white */}
                    <div className="p-3 sm:p-4 space-y-3" style={{ background: "#fcfcfc" }}>
                      {/* Header row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(197,160,89,0.12)" }}>
                            <BarChart3 className="w-3.5 h-3.5" style={{ color: "#C5A059" }} />
                          </div>
                          <div>
                            <div className="h-2.5 w-24 rounded-sm" style={{ background: "#1E293B", opacity: 0.8 }} />
                            <div className="h-2 w-12 rounded-sm mt-0.5" style={{ background: "#e2e8f0" }} />
                          </div>
                        </div>
                        <div className="h-4 px-2 rounded-full flex items-center" style={{ background: "rgba(197,160,89,0.12)" }}>
                          <span className="text-[8px] font-bold" style={{ color: "#C5A059" }}>LIVE</span>
                        </div>
                      </div>

                      {/* Charts row */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* Bar chart */}
                        <div className="col-span-2 rounded-xl p-2.5 flex flex-col gap-1.5" style={{ background: "#f1f5f9" }}>
                          <div className="flex items-end gap-1 h-14">
                            {[57, 79, 57, 90, 27, 58, 80, 37].map((h, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-0.5 justify-end h-full">
                                <span className="text-[7px] font-medium" style={{ color: "#C5A059" }}>{h}%</span>
                                <div className="w-full rounded-t-[3px]" style={{ height: `${h}%`, background: "#C5A059" }} />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Donut chart */}
                        <div className="rounded-xl p-2 flex flex-col items-center justify-center gap-1.5" style={{ background: "#f1f5f9" }}>
                          <div className="relative w-10 h-10">
                            <svg viewBox="0 0 40 40" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                              <circle cx="20" cy="20" r="14" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeDasharray="88 0" />
                              <circle cx="20" cy="20" r="14" fill="none" stroke="#C5A059" strokeWidth="6" strokeDasharray="28 60" />
                              <circle cx="20" cy="20" r="14" fill="none" stroke="#94a3b8" strokeWidth="6" strokeDasharray="20 68" strokeDashoffset="-28" />
                              <circle cx="20" cy="20" r="14" fill="none" stroke="#1E293B" strokeWidth="6" strokeDasharray="25 63" strokeDashoffset="-48" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-[8px] font-bold leading-none" style={{ color: "#1E293B" }}>72%</span>
                              <span className="text-[6px] leading-none mt-0.5" style={{ color: "#94a3b8" }}>Completion</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom grid — 2x3 gold progress bars */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                        {[
                          { label: "Cases Reviewed", pct: 80 },
                          { label: "Donors Active", pct: 65 },
                          { label: "Reports Generated", pct: 90 },
                          { label: "Donors Active", pct: 65 },
                          { label: "Reports Generated", pct: 90 },
                          { label: "NGOs Onboarded", pct: 50 },
                        ].map((row, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px]" style={{ color: "#94a3b8" }}>{row.label}</span>
                              <span className="text-[8px] font-medium" style={{ color: "#94a3b8" }}>{row.pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#e2e8f0" }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${row.pct}%`,
                                  background: "#C5A059",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Phone Mockup — Pure Gold */}
                <div className="absolute -bottom-6 -right-4 sm:-right-8 z-20 hidden sm:block">
                  <div
                    className="bg-white rounded-[20px] w-32 sm:w-36 p-[3px] relative"
                    style={{
                      boxShadow: "0 20px 50px -12px rgba(30,41,59,0.3), 0 0 0 2.5px #C5A059, 0 0 0 5px rgba(197,160,89,0.12)",
                      transform: "rotate(-3deg) translateY(-4px)",
                    }}
                  >
                    {/* Screen */}
                    <div className="bg-white rounded-[17px] overflow-hidden border border-gray-100">
                      {/* Status bar */}
                      <div className="bg-white px-3 py-1.5 flex items-center justify-between">
                        <div className="h-1 w-12 rounded-sm" style={{ background: "#1E293B" }} />
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C5A059" }} />
                          <div className="w-1 h-1 rounded-full" style={{ background: "#e2e8f0" }} />
                          <div className="w-1 h-1 rounded-full" style={{ background: "#e2e8f0" }} />
                        </div>
                      </div>

                      {/* Dashboard widgets */}
                      <div className="px-2.5 pb-2.5 space-y-2">
                        {/* Title row */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C5A059" }} />
                          <div className="h-1.5 w-14 bg-gray-200 rounded-sm" />
                        </div>

                        {/* Charts row */}
                        <div className="grid grid-cols-7 gap-1">
                          {/* Donut chart */}
                          <div className="col-span-3 rounded-lg p-1.5 flex flex-col items-center gap-1" style={{ background: "#f1f5f9" }}>
                            <div className="relative w-7 h-7">
                              <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                                <circle cx="16" cy="16" r="11" fill="none" stroke="#e2e8f0" strokeWidth="7" strokeDasharray="69 0" />
                                <circle cx="16" cy="16" r="11" fill="none" stroke="#C5A059" strokeWidth="7" strokeDasharray="22 47" />
                                <circle cx="16" cy="16" r="11" fill="none" stroke="#94a3b8" strokeWidth="7" strokeDasharray="16 53" strokeDashoffset="-22" />
                                <circle cx="16" cy="16" r="11" fill="none" stroke="#1E293B" strokeWidth="7" strokeDasharray="20 49" strokeDashoffset="-38" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C5A059" }} />
                              </div>
                            </div>
                          </div>

                          {/* Bar chart */}
                          <div className="col-span-4 rounded-lg p-1.5 flex flex-col gap-1" style={{ background: "#f1f5f9" }}>
                            <div className="flex items-end gap-[2px] h-7">
                              {[40, 65, 30, 85, 55, 70, 45, 60, 50, 80, 35, 90].map((h, i) => (
                                <div
                                  key={i}
                                  className="flex-1 rounded-t-[1px]"
                                  style={{
                                    height: `${h}%`,
                                    background: i % 3 === 0 ? "#C5A059" : i % 3 === 1 ? "#94a3b8" : "#e2e8f0",
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Text blocks */}
                        <div className="space-y-1">
                          <div className="h-1 w-full bg-gray-100 rounded-sm" />
                          <div className="h-1 w-11/12 bg-gray-100 rounded-sm" />
                          <div className="h-1 w-9/12 bg-gray-100 rounded-sm" />
                        </div>

                        {/* Highlight block */}
                        <div className="rounded-md h-5" style={{ background: "rgba(197,160,89,0.12)" }} />

                        {/* Bottom bar */}
                        <div className="rounded-md h-4" style={{ background: "#1E293B" }} />
                      </div>
                    </div>

                    {/* Bottom home indicator */}
                    <div className="flex justify-center pb-1.5 pt-0.5">
                      <div className="w-8 h-1 bg-gray-300 rounded-full" />
                    </div>
                  </div>
                </div>
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
          style={{ background: "radial-gradient(circle, #c8972a 0%, transparent 70%)" }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Map visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-sm">
                {/* Map container with gold glow border */}
                <div
                  className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(12, 49, 64, 0.5)",
                    boxShadow: "0 0 40px rgba(200, 150, 42, 0.2), 0 0 80px rgba(200, 150, 42, 0.08), inset 0 0 60px rgba(12, 49, 64, 0.3)",
                    border: "1.5px solid rgba(200, 150, 42, 0.35)",
                  }}
                >
                  {/* Map silhouette */}
                  <img
                    src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/945b4a89f_generated_image.png"
                    alt="خريطة المملكة العربية السعودية"
                    className="w-full h-full object-contain p-4"
                    style={{ filter: "drop-shadow(0 0 15px rgba(200, 150, 42, 0.3))" }}
                  />
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
              className="text-center lg:text-right"
            >
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
                  { num: "1.2K+", label: "Beneficiaries" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center rounded-xl py-4 px-2"
                    style={{
                      background: "linear-gradient(180deg, rgba(200,150,42,0.08) 0%, rgba(12,49,64,0.3) 100%)",
                      border: "1px solid rgba(200,150,42,0.2)",
                    }}
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-brand-gold">{s.num}</p>
                    <p className="text-[11px] sm:text-xs text-white/50 mt-1.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <FooterCTA />

      {/* ── Sign In Modal ── */}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />

      {/* ── Floating Controls ── */}
      <FloatingControls />
    </div>
  );
}