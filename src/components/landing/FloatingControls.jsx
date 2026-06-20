import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function FloatingControls() {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState(() => localStorage.getItem("moeen-lang") || "ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("moeen-lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" dir="ltr">
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors"
        style={{
          background: theme === "dark" ? "#1E293B" : "#ffffff",
          border: theme === "dark" ? "1.5px solid #C5A059" : "1.5px solid #e2e8f0",
          color: theme === "dark" ? "#C5A059" : "#1E293B",
          boxShadow: theme === "dark"
            ? "0 4px 20px rgba(197,160,89,0.2)"
            : "0 4px 20px rgba(0,0,0,0.08)",
        }}
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Language Toggle */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLang}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors"
        style={{
          background: theme === "dark" ? "#1E293B" : "#ffffff",
          border: theme === "dark" ? "1.5px solid #C5A059" : "1.5px solid #e2e8f0",
          color: theme === "dark" ? "#C5A059" : "#1E293B",
          boxShadow: theme === "dark"
            ? "0 4px 20px rgba(197,160,89,0.2)"
            : "0 4px 20px rgba(0,0,0,0.08)",
        }}
        aria-label="Toggle language"
      >
        <div className="relative flex items-center justify-center">
          <Languages className="w-5 h-5" />
          <span className="absolute -bottom-1 text-[8px] font-extrabold leading-none" style={{ color: "inherit" }}>
            {lang === "ar" ? "EN" : "AR"}
          </span>
        </div>
      </motion.button>
    </div>
  );
}