import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Building2, Users, Megaphone, Search, RefreshCw } from "lucide-react";
import { mockAuditLogs, mockLiveAuditEvents } from "@/lib/mockData";

const typeConfig = {
  ngo: { icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10", dot: "bg-blue-500" },
  researcher: { icon: Search, color: "text-emerald-500", bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
  campaign: { icon: Megaphone, color: "text-amber-500", bg: "bg-amber-500/10", dot: "bg-amber-500" },
  beneficiary: { icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", dot: "bg-purple-500" },
};

export default function RecentActivityFeed({ initialFeed = mockAuditLogs, liveEvents = mockLiveAuditEvents }) {
  const [feed, setFeed] = useState(initialFeed);
  const [newEventIdx, setNewEventIdx] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const event = liveEvents[newEventIdx % liveEvents.length];
      const newItem = {
        ...event,
        log_id: Date.now(),
        created_at: "الآن",
      };
      setFeed(prev => [newItem, ...prev.slice(0, 7)]);
      setNewEventIdx(i => i + 1);
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 12000);
    return () => clearInterval(interval);
  }, [newEventIdx, liveEvents]);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            آخر النشاطات
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ scale: pulse ? [1, 1.4, 1] : 1 }}
              transition={{ duration: 0.4 }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
            <RefreshCw className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">مباشر</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <AnimatePresence initial={false}>
          {feed.map((item) => {
            const cfg = typeConfig[item.log_type];
            return (
              <motion.div
                key={item.log_id}
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors"
              >
                <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <cfg.icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{item.log_text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.created_at}</p>
                </div>
                {item.created_at === "الآن" && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">جديد</span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}