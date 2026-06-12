import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, MapPin, User2 } from "lucide-react";
import { mockBeneficiaries } from "@/lib/mockData";

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

export default function RecentCasesTable({ cases = mockBeneficiaries }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            آخر الحالات المسجّلة
          </CardTitle>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {cases.length} حالات
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
              {cases.map((c, i) => (
                <motion.tr
                  key={c.beneficiary_id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
                >
                  <TableCell>
                    <span className="text-xs font-mono text-muted-foreground">{c.beneficiary_id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <User2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{c.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${typeConfig[c.case_type]?.className}`}>
                      {c.case_type}
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
                    <span className="text-xs text-muted-foreground">{c.researcher_name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{c.created_at}</span>
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