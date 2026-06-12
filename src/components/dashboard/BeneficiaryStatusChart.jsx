import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as PieIcon } from "lucide-react";

const DATA = [
  { name: "حالات نشطة",   value: 312, color: "#0c3140" },
  { name: "حالات مدعومة", value: 178, color: "#c8972a" },
  { name: "حالات عاجلة",  value: 47,  color: "#dc2626" },
  { name: "مؤرشفة",       value: 89,  color: "#94a3b8" },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const item = payload[0];
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.payload.color }} />
          <span className="font-bold text-foreground">{item.name}</span>
        </div>
        <p className="text-muted-foreground">العدد: <span className="font-semibold text-foreground">{item.value}</span></p>
        <p className="text-muted-foreground">النسبة: <span className="font-semibold text-foreground">{(item.payload.percent * 100).toFixed(1)}%</span></p>
      </div>
    );
  }
  return null;
};

const CustomLegend = () => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3">
    {DATA.map((d) => (
      <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
        <span>{d.name}</span>
        <span className="font-semibold text-foreground">({d.value})</span>
      </div>
    ))}
  </div>
);

export default function BeneficiaryStatusChart() {
  const total = DATA.reduce((s, d) => s + d.value, 0);
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-primary" />
          توزيع حالات المستفيدين
        </CardTitle>
        <p className="text-xs text-muted-foreground">إجمالي: <span className="font-semibold text-foreground">{total}</span> حالة</p>
      </CardHeader>
      <CardContent>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        <CustomLegend />
      </CardContent>
    </Card>
  );
}