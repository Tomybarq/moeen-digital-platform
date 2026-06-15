import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { TEMPLATE_LABELS } from "./ReportTemplateCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportPreview({ reportType, data, isLoading, onExportJSON, onExportCSV }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full mt-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const title = TEMPLATE_LABELS[reportType] || reportType;
  const reportData = data.data;

  const renderSummaryCards = () => {
    const summary = reportData?.summary;
    if (!summary) return null;

    const entries = Object.entries(summary).filter(([k]) => k !== "total_beneficiaries" && k !== "total_ngos");
    if (entries.length === 0) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {Object.entries(summary).map(([key, value]) => (
          <Card key={key} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-[#00A651]">
                {typeof value === "number" ? value.toLocaleString("ar-SA") : value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{formatKey(key)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTable = () => {
    if (reportData?.rows && reportData.rows.length > 0) {
      const columns = Object.keys(reportData.rows[0]).filter(k => k !== "id");
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {columns.map(col => (
                  <th key={col} className="text-right px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">
                    {formatKey(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.rows.slice(0, 20).map((row, i) => (
                <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                  {columns.map(col => (
                    <td key={col} className="px-3 py-2 whitespace-nowrap">
                      {typeof row[col] === "number" ? row[col].toLocaleString("ar-SA") : String(row[col] || "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {reportData.rows.length > 20 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              + {reportData.rows.length - 20} صف إضافي (سيظهر في التصدير)
            </p>
          )}
        </div>
      );
    }

    // Distribution-style report
    const distKeys = ["byCity", "byCaseType", "byPriority", "byStatus", "byIncomeLevel", "byGender"];
    const sections = distKeys.filter(k => reportData?.[k] && Object.keys(reportData[k]).length > 0);

    if (sections.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map(section => (
            <Card key={section}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{formatKey(section)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(reportData[section]).map(([key, count]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">{key}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // Financial overview
    if (reportData?.incomeStats || reportData?.expenseStats) {
      return (
        <div className="space-y-4">
          {reportData.incomeLevelBreakdown && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">توزيع مستويات الدخل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(reportData.incomeLevelBreakdown).map(([level, count]) => (
                    <Badge key={level} variant="outline" className="text-sm py-1.5">
                      {level}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.incomeStats && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">متوسط الدخل</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#00A651]">
                    {Math.round(reportData.incomeStats.average || 0).toLocaleString("ar-SA")} ر.س
                  </p>
                </CardContent>
              </Card>
            )}
            {reportData.expenseStats && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">متوسط المصروفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-rose-500">
                    {Math.round(reportData.expenseStats.average || 0).toLocaleString("ar-SA")} ر.س
                  </p>
                </CardContent>
              </Card>
            )}
            {reportData.netIncomeStats && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">متوسط صافي الدخل</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-500">
                    {Math.round(reportData.netIncomeStats.average || 0).toLocaleString("ar-SA")} ر.س
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      );
    }

    // Activity report
    if (reportData?.recentActivity) {
      return (
        <div className="space-y-4">
          {reportData.usersByRole && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">المستخدمين حسب الدور</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(reportData.usersByRole).map(([role, count]) => (
                    <Badge key={role} variant="outline" className="text-sm py-1.5">
                      {formatKey(role)}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">آخر النشاطات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {reportData.recentActivity.slice(0, 15).map((a, i) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b pb-1.5 last:border-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{a.event_type}</Badge>
                      <span>{a.resource_label || a.resource_type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.created_date).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return <p className="text-muted-foreground text-sm">لا توجد بيانات لعرضها.</p>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#00A651]" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExportJSON} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            JSON
          </Button>
          <Button size="sm" onClick={onExportCSV} className="gap-1.5 bg-[#00A651] hover:bg-[#00A651]/90">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderSummaryCards()}
        {renderTable()}
      </CardContent>
    </Card>
  );
}

/* ── Arabic key formatter ────────────────────── */
function formatKey(key) {
  const map = {
    total: "الإجمالي",
    name: "الاسم",
    city: "المدينة",
    category: "التصنيف",
    active: "نشط",
    archived: "مؤرشفة",
    supported: "مدعوم",
    total_ngos: "عدد المنظمات",
    total_beneficiaries: "إجمالي المستفيدين",
    total_users: "عدد المستخدمين",
    total_audit_logs: "سجلات التدقيق",
    total_marketers: "عدد المسوّقين",
    active_marketers: "المسوّقين النشطين",
    total_campaigns: "إجمالي الحملات",
    full_name: "الاسم الكامل",
    ngo_name: "المنظمة",
    specialization: "التخصص",
    campaigns_count: "عدد الحملات",
    beneficiary_count: "المستفيدين",
    status: "الحالة",
    count: "العدد",
    byCity: "حسب المدينة",
    byCaseType: "حسب نوع الحالة",
    byPriority: "حسب الأولوية",
    byStatus: "حسب الحالة",
    byIncomeLevel: "حسب مستوى الدخل",
    byGender: "حسب الجنس",
    usersByRole: "المستخدمين حسب الدور",
    platform_admin: "مدير المنصة",
    ngo_manager: "مدير المنظمة",
    researcher: "باحث اجتماعي",
    marketer: "مسوّق",
    pdo: "مسؤول حماية البيانات",
    event_type: "نوع الحدث",
    resource_type: "نوع المورد",
    resource_label: "المورد",
    user_role: "دور المستخدم",
    created_date: "التاريخ",
    incomeLevelBreakdown: "توزيع مستويات الدخل",
    incomeStats: "إحصائيات الدخل",
    expenseStats: "إحصائيات المصروفات",
    netIncomeStats: "صافي الدخل",
  };
  return map[key] || key;
}