import { motion } from "framer-motion";

/**
 * Skeleton shimmer placeholder for KPICard while dashboard stats load.
 * Mirrors the KPICard dimensions and layout to prevent layout shift.
 */
export default function KPICardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      className="relative rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-muted animate-pulse" />

      <div className="relative p-5 space-y-3">
        {/* Icon placeholder */}
        <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />

        {/* Title placeholder */}
        <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />

        {/* Value placeholder */}
        <div className="h-10 w-16 rounded-md bg-muted animate-pulse" />

        {/* Trend label placeholder */}
        <div className="h-3 w-28 rounded-md bg-muted animate-pulse" />
      </div>
    </motion.div>
  );
}