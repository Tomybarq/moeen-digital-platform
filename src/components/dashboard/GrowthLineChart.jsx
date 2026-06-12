import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { TrendingUp } from "lucide-react";

const DATA = [
  { month: "يناير",  مستفيدون: 180, منظمات: 38, باحثون: 18 },
  { month: "فبراير", مستفيدون: 220, منظمات: 40, باحثون: 19 },
  { month: "مارس",   مستفيدون: 260, منظمات: 41, باحثون: 21 },
  { month: "أبريل",  مستفيدون: 295, منظمات: 43, باحثون: 22 },
  { month: "مايو",   مستفيدون: 340, منظمات: 45, باحثون: 23 },
  { month: "يونيو",  مستفيدون: 390, منظمات: 48, باحثون: 26 },
  { month: "يوليو",  مستفيدون: 426, منظمات: 50, باحثون: 28 },
  { month: "أغسطس",  مستفيدون: 471, منظمات: 52, باحثون: 30 },
  { month: "سبتمبر", مستفيدون: 510, منظمات: 55, باحثون: 32 },
  { month: "أكتوبر", مستفيدون: 548, منظمات: 57, باحثون: 34 },
  { month: "نوفمبر", مستفيدون: 580, منظمات: 59, باحثون: 35 },
  { month: "ديسمبر", مستفيدون: 626, منظمات: 61, باحثون: 38 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="font-bold text-foreground mb-2">{label}</p>
        {payload.map(p => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium text-foreground">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GrowthLineChart() {
  return (
    <Card className="border-border lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            نمو المنصة السنوي — ٢٠٢٥
          </CardTitle>
          <div className="flex items-center gap-4">
            {[
              { label: "مستفيدون", color: "#c8972a" },
              { label: "منظمات",   color: "#0c3140" },
              { label: "باحثون",   color: "#22c55e" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gMust" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c8972a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#c8972a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNavy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0c3140" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#0c3140" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="مستفيدون" stroke="#c8972a" strokeWidth={2.5} fill="url(#gMust)" dot={false} />
              <Area type="monotone" dataKey="منظمات"   stroke="#0c3140" strokeWidth={2}   fill="url(#gNavy)" dot={false} />
              <Line type="monotone" dataKey="باحثون"   stroke="#22c55e" strokeWidth={2}   dot={{ r: 3, fill: "#22c55e" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}