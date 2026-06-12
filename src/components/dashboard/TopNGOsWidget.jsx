import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ArrowLeft } from "lucide-react";
import { mockNgos } from "@/lib/mockData";

export default function TopNGOsWidget({ ngos = mockNgos }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          أكثر المنظمات نشاطاً
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ngos.map((ngo, i) => (
          <motion.div
            key={ngo.ngo_id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{ngo.ngo_name}</p>
                  <p className="text-[10px] text-muted-foreground">{ngo.city}</p>
                </div>
              </div>
              <span className="text-sm font-bold tabular-nums text-foreground shrink-0 mr-2">{ngo.total_cases}</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ngo.activity_pct}%` }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: i === 0 ? "#c8972a" : i === 1 ? "#0c3140" : "hsl(var(--muted-foreground))" }}
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}