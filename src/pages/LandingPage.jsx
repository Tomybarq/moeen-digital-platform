import { motion } from "framer-motion";
import { useState } from "react";
import { ClipboardList, BarChart3, UsersRound, Lock, LogIn } from "lucide-react";
import SignInModal from "@/components/landing/SignInModal";
import TrustBadges from "@/components/landing/TrustBadges";
import FeatureBanner from "@/components/landing/FeatureBanner";
import ProcessFlow from "@/components/landing/ProcessFlow";
import WhyMoeen from "@/components/landing/WhyMoeen";
import FooterCTA from "@/components/landing/FooterCTA";

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

      {/* ── Hero Section (Split: Text + Device Mockups) ── */}
      <section className="py-8 md:py-14 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-brand-navy leading-tight tracking-tight">
                  Moeen Digital{" "}
                  <span className="text-brand-gold">Platform</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl font-semibold text-brand-gold leading-relaxed">
                  Empowering NGOs & Social Researchers to Collect Data and Transform Lives
                </p>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  A smart B2B platform that connects Beneficiaries and Donors through
                  secure data, real-time insights, and measurable impact.
                </p>
              </div>

              {/* 4 Feature Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0">
                {heroFeatures.map((f) => (
                  <div
                    key={f.title}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:border-brand-gold/30 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-navy flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <f.icon className="w-5 h-5 text-brand-gold" />
                    </div>
                    <h3 className="font-bold text-sm text-brand-navy mb-1">{f.title}</h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Device Mockups */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative flex items-center justify-center"
            >
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-brand-gold/5 blur-3xl rounded-full scale-75" />

              {/* Desktop Monitor Mockup */}
              <div className="relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl shadow-brand-navy/10 border border-gray-100 p-2 sm:p-3 max-w-md lg:max-w-lg">
                  {/* Screen content */}
                  <div className="bg-[#f8fafc] rounded-xl overflow-hidden border border-gray-100">
                    {/* Mock browser bar */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <div className="flex-1 mx-3 h-5 bg-white rounded-md border border-gray-200" />
                    </div>
                    {/* Mock dashboard content */}
                    <div className="p-3 sm:p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-brand-gold" />
                        </div>
                        <div>
                          <div className="h-3 w-24 bg-brand-navy/80 rounded" />
                          <div className="h-2 w-16 bg-gray-200 rounded mt-1" />
                        </div>
                      </div>
                      {/* Mock charts */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 bg-white rounded-lg border border-gray-100 p-2">
                          <div className="flex items-end gap-1 h-16">
                            {[60, 35, 80, 45, 70, 55, 90].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-sm bg-brand-navy/15"
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-100 p-2 flex flex-col justify-center items-center gap-1">
                          <div className="w-10 h-10 rounded-full border-4 border-brand-green/30 border-t-brand-green" />
                          <div className="h-2 w-12 bg-gray-200 rounded" />
                        </div>
                      </div>
                      {/* Mock table */}
                      <div className="space-y-1.5">
                        {[80, 65, 90, 50].map((w, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-brand-navy/10" />
                            <div className="h-2 rounded bg-gray-200" style={{ width: `${w}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Mockup — offset right */}
                <div className="absolute -bottom-4 -right-3 sm:-right-6 z-20 hidden sm:block">
                  <div className="bg-white rounded-2xl shadow-xl shadow-brand-navy/15 border-2 border-gray-200 p-1.5 w-28 sm:w-32">
                    <div className="bg-[#f8fafc] rounded-xl overflow-hidden">
                      <div className="bg-brand-navy px-2 py-1.5 flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-brand-gold" />
                        <div className="h-1.5 w-10 bg-brand-navy/50 rounded" />
                      </div>
                      <div className="p-2 space-y-2">
                        <div className="h-1.5 w-16 bg-gray-200 rounded" />
                        <div className="space-y-1">
                          <div className="h-1 w-full bg-gray-200 rounded" />
                          <div className="h-1 w-4/5 bg-gray-200 rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="h-5 bg-brand-green/15 rounded" />
                          <div className="h-5 bg-brand-navy/10 rounded" />
                        </div>
                      </div>
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

      {/* ── Saudi Arabia Map Section ── */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#f8f9fb] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Map visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-sm">
                {/* Saudi Map image */}
                <div className="w-full aspect-[3/4] relative rounded-2xl overflow-hidden shadow-lg border border-brand-gold/20">
                  <img
                    src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/0a3507c33_generated_image.png"
                    alt="خريطة المملكة العربية السعودية"
                    className="w-full h-full object-contain"
                  />
                  {/* Subtle overlay glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/10 to-transparent pointer-events-none" />
                </div>
                {/* Decorative skyline */}
                <div className="absolute -bottom-1 left-0 right-0 h-16 opacity-30 pointer-events-none">
                  <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 80 L0 40 L20 32 L40 45 L55 28 L70 40 L90 22 L105 35 L120 18 L140 30 L155 15 L170 25 L185 10 L200 22 L215 8 L230 18 L245 5 L260 15 L275 8 L290 18 L305 4 L320 12 L335 8 L350 16 L365 6 L380 14 L395 5 L400 10 L400 80 Z" fill="#0c3140" />
                  </svg>
                </div>
                {/* Palm tree silhouettes */}
                <div className="absolute -bottom-1 right-4 text-4xl pointer-events-none select-none opacity-80">🌴</div>
                <div className="absolute -bottom-1 right-20 text-3xl pointer-events-none select-none opacity-80">🌴</div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center lg:text-right"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
                Serving NGOs Across Saudi Arabia
              </h2>
              <p className="text-brand-gold font-semibold text-lg mb-4">
                نخدم الجمعيات في جميع أنحاء المملكة العربية السعودية
              </p>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base max-w-md mx-auto lg:mx-0">
                From Riyadh to Jeddah, Dammam to Abha — our platform empowers
                charitable organizations and social researchers across every
                region of the Kingdom, bridging the gap between those in need
                and those who can help.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6 max-w-sm mx-auto lg:mx-0">
                {[
                  { num: "13+", label: "Regions" },
                  { num: "24", label: "Active NGOs" },
                  { num: "1.2K+", label: "Beneficiaries" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-bold text-brand-navy">{s.num}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
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
    </div>
  );
}