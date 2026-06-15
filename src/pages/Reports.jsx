import { useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import ReportTemplateCard from "@/components/reports/ReportTemplateCard";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportPreview from "@/components/reports/ReportPreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileDown } from "lucide-react";
import { toast } from "sonner";

const REPORT_TYPES = [
  "ngo_performance",
  "beneficiary_distribution",
  "marketing_effectiveness",
  "platform_activity",
  "financial_overview",
];

export default function Reports() {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const handleSelectReport = useCallback(async (reportType) => {
    if (selectedReport === reportType && reportData) return;
    setSelectedReport(reportType);
    setIsLoading(true);
    setReportData(null);
    setCsvData(null);

    try {
      const response = await base44.functions.invoke("generateReport", {
        report_type: reportType,
        filters,
        format: "json",
      });

      if (response.data?.success) {
        setReportData(response.data.data);
        setCsvData({ headers: response.data.csvHeaders, rows: response.data.csvRows });
      } else if (response.data?.error) {
        toast.error(response.data.error);
      }
    } catch (err) {
      toast.error("فشل توليد التقرير. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedReport, reportData, filters]);

  const handleApplyFilters = useCallback(() => {
    if (selectedReport) {
      setReportData(null);
      handleSelectReport(selectedReport);
    }
  }, [selectedReport, filters]);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    if (selectedReport) {
      setReportData(null);
      handleSelectReport(selectedReport);
    }
  }, [selectedReport]);

  const handleExportJSON = useCallback(() => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedReport}_report.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير التقرير بصيغة JSON");
  }, [reportData, selectedReport]);

  const handleExportCSV = useCallback(() => {
    if (!csvData?.headers || !csvData?.rows) {
      toast.error("لا توجد بيانات للتصدير");
      return;
    }
    try {
      const bom = "\uFEFF";
      const headerLine = csvData.headers.join(",");
      const dataLines = csvData.rows.map(r => r.map(c => `"${String(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([bom + headerLine + "\n" + dataLines], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedReport}_report.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تصدير التقرير بصيغة CSV");
    } catch {
      toast.error("فشل تصدير التقرير");
    }
  }, [csvData, selectedReport]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#00A651]" />
            التقارير
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            إنشاء وتصدير تقارير مخصصة عن أداء المنصة والمنظمات والمستفيدين
          </p>
        </div>
        {selectedReport && reportData && (
          <div className="flex items-center gap-2">
            <FileDown className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">تم توليد التقرير بنجاح</span>
          </div>
        )}
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">التقارير الجاهزة</CardTitle>
          <CardDescription>اختر أحد التقارير الجاهزة لعرض وتحليل البيانات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {REPORT_TYPES.map(type => (
              <ReportTemplateCard
                key={type}
                reportType={type}
                onSelect={handleSelectReport}
                isSelected={selectedReport === type}
                isLoading={isLoading && selectedReport === type}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {selectedReport && (
        <ReportFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />
      )}

      {/* Preview */}
      {selectedReport && (
        <ReportPreview
          reportType={selectedReport}
          data={reportData ? { data: reportData } : null}
          isLoading={isLoading}
          onExportJSON={handleExportJSON}
          onExportCSV={handleExportCSV}
        />
      )}
    </div>
  );
}