import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Icon is received as a prop and used dynamically — no static import needed
export default function KPICard({ title, value, icon: Icon, trend, trendLabel, color = "gold", delay = 0, subtitle }) {
  const palettes = {
    gold:    { bg: "from-amber-50  to-white",   icon: "bg-amber-100",    iconColor: "#c8972a", bar: "#c8972a",  glow: "rgba(200,151,42,0.15)"  },
    navy:    { bg: "from-blue-50   to-white",   icon: "bg-blue-100",     iconColor: "#0c3140", bar: "#0c3140",  glow: "rgba(12,49,64,0.12)"    },
    emerald: { bg: "from-emerald-50 to-white",  icon: "bg-emerald-100",  iconColor: "#059669", bar: "#059669",  glow: "rgba(5,150,105,0.12)"   },
    purple:  { bg: "from-purple-50 to-white",   icon: "bg-purple-100",   iconColor: "#7c3aed", bar: "#7c3aed",  glow: "rgba(124,58,237,0.12)"  },
    red:     { bg: "from-red-50    to-white",   icon: "bg-red-100",      iconColor: "#dc2626", bar: "#dc2626",  glow: "rgba(220,38,38,0.12)"   },
  };
  const p = palettes[color] || palettes.gold;
  const isPositive = trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={cn(
        "relative rounded-2xl border border-border bg-gradient-to-br overflow-hidden group cursor-default",
        p.bg
      )}
      style={{ boxShadow: `0 4px 24px ${p.glow}` }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl" style={{ background: p.bar }} />

      {/* Decorative blob */}
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full -translate-x-12 translate-y-12 group-hover:scale-125 transition-transform duration-700"
        style={{ background: p.glow }}
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm", p.icon)}>
            <Icon className="w-6 h-6" style={{ color: p.iconColor }} />
          </div>
          {trend !== null && trend !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
              isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"
            )}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? "+" : ""}{trend}%
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
        <p className="text-4xl font-bold tabular-nums" style={{ color: p.iconColor, fontFamily: "var(--font-display)" }}>
          {value}
        </p>
        {(trendLabel || subtitle) && (
          <p className="text-xs text-muted-foreground mt-2">{trendLabel || subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}