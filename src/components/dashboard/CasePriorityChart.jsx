import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { BarChart2 } from "lucide-react";

const DATA = [
  { month: "يناير", عاجل: 22, مرتفع: 45, متوسط: 110, منخفض: 60 },
  { month: "فبراير", عاجل: 28, مرتفع: 52, متوسط: 98, منخفض: 55 },
  { month: "مارس",  عاجل: 19, مرتفع: 48, متوسط: 125, منخفض: 70 },
  { month: "أبريل", عاجل: 35, مرتفع: 60, متوسط: 140, منخفض: 65 },
  { month: "مايو",  عاجل: 30, مرتفع: 55, متوسط: 132, منخفض: 72 },
  { month: "يونيو", عاجل: 47, مرتفع: 63, متوسط: 155, منخفض: 80 },
];

const COLORS = { عاجل: "#dc2626", مرتفع: "#f97316", متوسط: "#c8972a", منخفض: "#22c55e" };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="font-bold text-foreground mb-2">{label}</p>
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[p.dataKey] }} />
            <span className="text-muted-foreground">{p.dataKey}:</span>
            <span className="font-medium text-foreground">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CasePriorityChart() {
  return (
    <Card className="border-border lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            توزيع الحالات حسب الأولوية (٦ أشهر)
          </CardTitle>
          <div className="flex items-center gap-3 flex-wrap">
            {Object.entries(COLORS).map(([k, c]) => (
              <div key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                <span>{k}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {Object.entries(COLORS).map(([key, color]) => (
                <Bar key={key} dataKey={key} fill={color} radius={[3, 3, 0, 0]} stackId="a" opacity={0.88} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}