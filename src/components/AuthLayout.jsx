import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ icon: Icon, title, subtitle, children, footer, step, totalSteps }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
        className="absolute top-4 left-4 cursor-pointer"
      >
        <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
          {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </motion.div>
      </Button>

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
          <Heart className="w-7 h-7 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">مُعين</span>
        <span className="text-xs text-muted-foreground mt-1">المنصة الرقمية للعمل الاجتماعي</span>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-xl shadow-black/5 p-8">
          {/* Step indicator */}
          {step && totalSteps && (
            <div className="flex gap-1.5 mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>}
          </div>

          {children}
        </div>

        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </motion.div>
    </div>
  );
}