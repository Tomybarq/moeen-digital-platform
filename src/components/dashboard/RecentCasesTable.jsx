import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, MapPin, User2 } from "lucide-react";

const CASES = [
  { id: "BNF-2025-001", name: "أحمد محمد السالم",  type: "مادي",      city: "الرياض",       priority: "عاجل",    researcher: "سارة المطيري",   date: "١٢ يونيو ٢٠٢٥" },
  { id: "BNF-2025-002", name: "فاطمة علي الزهراني", type: "صحي",       city: "جدة",          priority: "مرتفع",   researcher: "خالد العتيبي",   date: "١١ يونيو ٢٠٢٥" },
  { id: "BNF-2025-003", name: "عبدالله سعد القحطاني",type: "تعليمي",  city: "الدمام",        priority: "متوسط",   researcher: "نوف الغامدي",    date: "١١ يونيو ٢٠٢٥" },
  { id: "BNF-2025-004", name: "مريم يوسف الحربي",   type: "متعدد",     city: "مكة المكرمة", priority: "عاجل",    researcher: "هند الشهري",     date: "١٠ يونيو ٢٠٢٥" },
  { id: "BNF-2025-005", name: "سلمان عبدالعزيز",    type: "اجتماعي",  city: "الرياض",        priority: "منخفض",   researcher: "أحمد الدوسري",   date: "١٠ يونيو ٢٠٢٥" },
  { id: "BNF-2025-006", name: "نورة خالد الرشيدي",  type: "مادي",     city: "تبوك",          priority: "مرتفع",   researcher: "سارة المطيري",   date: "٩ يونيو ٢٠٢٥"  },
];

const priorityConfig = {
  عاجل:   { className: "bg-red-500/10 text-red-600 border-red-200" },
  مرتفع:  { className: "bg-orange-500/10 text-orange-600 border-orange-200" },
  متوسط:  { className: "bg-amber-500/10 text-amber-600 border-amber-200" },
  منخفض:  { className: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
};

const typeConfig = {
  مادي:      { className: "bg-blue-500/10 text-blue-600" },
  صحي:       { className: "bg-rose-500/10 text-rose-600" },
  تعليمي:    { className: "bg-purple-500/10 text-purple-600" },
  متعدد:     { className: "bg-slate-500/10 text-slate-600" },
  اجتماعي:   { className: "bg-teal-500/10 text-teal-600" },
};

export default function RecentCasesTable() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            آخر الحالات المسجّلة
          </CardTitle>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {CASES.length} حالات
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold text-xs text-muted-foreground">رقم الملف</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">المستفيد</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">النوع</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">المدينة</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">الأولوية</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">الباحث</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CASES.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
                >
                  <TableCell>
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <User2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${typeConfig[c.type]?.className}`}>
                      {c.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {c.city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${priorityConfig[c.priority]?.className}`}>
                      {c.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{c.researcher}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{c.date}</span>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}