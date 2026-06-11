import { ShieldX } from "lucide-react";
import { motion } from "framer-motion";

export default function UnauthorizedBanner({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5">
        <ShieldX className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">غير مصرح لك بالوصول</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {message ?? "ليس لديك الصلاحيات الكافية لعرض هذه الصفحة. تواصل مع مدير المنصة لمنحك الأذونات المناسبة."}
      </p>
    </motion.div>
  );
}