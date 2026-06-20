import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BeneficiaryService from "@/services/BeneficiaryService";
import { useAuth } from "@/lib/AuthContext";
import { hasPermission } from "@/lib/rbac";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Edit2, Archive, Trash2, Printer,
  Users, DollarSign, Home, Heart,
  FileText, Paperclip, CheckCircle2, User,
  Download, FileSpreadsheet, Loader2,
} from "lucide-react";
import { coreApi } from "@/api/coreClient";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const PRIORITY_CLS = {
  "عاجل":  "bg-red-100 text-red-700 border-red-300",
  "مرتفع": "bg-orange-100 text-orange-700 border-orange-300",
  "متوسط": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "منخفض": "bg-green-100 text-green-700 border-green-300",
};

const STATUS_CLS = {
  active:    "bg-emerald-100 text-emerald-700",
  supported: "bg-blue-100 text-blue-700",
  archived:  "bg-gray-100 text-gray-500",
};

const STATUS_LABEL = { active: "نشط", supported: "مدعوم", archived: "مؤرشف" };

function Section({ title, icon: IconComp, children }) {
  const Icon = IconComp;
  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="w-40 flex-shrink-0 text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

export default function BeneficiaryDetail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);

  // Read id from URL search params
  const id = new URLSearchParams(window.location.search).get("id");

  const { data: b, isLoading } = useQuery({
    queryKey: ["beneficiary", id],
    queryFn: () => BeneficiaryService.getById(id),
    enabled: !!id,
  });

  const archiveMutation = useMutation({
    mutationFn: () => BeneficiaryService.update(id, { status: "archived" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["beneficiaries"] }); navigate("/beneficiaries"); },
  });

  const deleteMutation = useMutation({
    mutationFn: () => BeneficiaryService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["beneficiaries"] }); navigate("/beneficiaries"); },
  });

  const [exporting, setExporting] = useState(null); // null | "pdf" | "excel"

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const response = await coreApi.functions.invoke("generateBeneficiaryReport", {
        beneficiary_id: id,
        format: "pdf",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${b.full_name || "beneficiary"}_social_research.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تحميل تقرير PDF بنجاح");
    } catch (err) {
      toast.error("فشل تصدير التقرير");
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setExporting("excel");
    try {
      const response = await coreApi.functions.invoke("generateBeneficiaryReport", {
        beneficiary_id: id,
        format: "excel",
      });
      const blob = new Blob([response.data], { type: "text/csv; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${b.full_name || "beneficiary"}_data.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تحميل ملف Excel بنجاح");
    } catch (err) {
      toast.error("فشل تصدير ملف Excel");
    } finally {
      setExporting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-muted" />)}
      </div>
    );
  }

  if (!b) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">الحالة غير موجودة أو تم حذفها.</p>
        <Button variant="outline" onClick={() => navigate("/beneficiaries")}>العودة للقائمة</Button>
      </div>
    );
  }

  const canEdit   = hasPermission(user, "beneficiaries:edit");
  const canDelete = hasPermission(user, "beneficiaries:delete");
  const docImages = (b.documents || []).filter(d => typeof d === "string" || d?.type === "image");
  const docFiles  = (b.documents || []).filter(d => d?.type === "excel" || (typeof d === "string" && d.includes("xlsx")));

  let basicNeeds = {};
  let nonBasicNeeds = [];
  try { basicNeeds = JSON.parse(b.basic_needs || "{}"); } catch {}
  try { nonBasicNeeds = JSON.parse(b.non_basic_needs || "[]"); } catch {}

  const NON_BASIC_LABELS = {
    laptop: "حاسب آلي", tablet: "جهاز لوحي", internet: "إنترنت",
    printer: "طابعة", vocational: "تدريب مهني", language: "تعلم لغة",
    business: "مشروع صغير", financial_literacy: "تثقيف مالي", parenting: "مهارات الأسرة",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/beneficiaries")}>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">{b.full_name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={cn("border", PRIORITY_CLS[b.priority])}>{b.priority}</Badge>
              <Badge className={cn(STATUS_CLS[b.status])}>{STATUS_LABEL[b.status]}</Badge>
              {b.case_type && <Badge variant="outline">{b.case_type}</Badge>}
              {b.case_classification && (
                <Badge className={cn(
                  "border",
                  b.case_classification === "أولوية قصوى" ? "bg-red-100 text-red-700 border-red-300" :
                  b.case_classification === "أولوية متوسطة" ? "bg-amber-100 text-amber-700 border-amber-300" :
                  "bg-gray-100 text-gray-500 border-gray-300"
                )}>
                  {b.case_classification}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="w-4 h-4" /> طباعة
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={exporting === "pdf"}
            className="gap-1.5 border-brand-navy/30 text-brand-navy hover:bg-brand-navy/5"
          >
            {exporting === "pdf" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={exporting === "excel"}
            className="gap-1.5 border-brand-green/30 text-brand-green hover:bg-brand-green/5"
          >
            {exporting === "excel" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            Excel
          </Button>
          {canEdit && (
            <Button variant="outline" size="sm"
              onClick={() => navigate(`/beneficiaries/edit?id=${id}`)} className="gap-1.5">
              <Edit2 className="w-4 h-4" /> تعديل
            </Button>
          )}
          {canEdit && b.status !== "archived" && (
            <Button variant="outline" size="sm" onClick={() => archiveMutation.mutate()} className="gap-1.5">
              <Archive className="w-4 h-4" /> أرشفة
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)} className="gap-1.5">
              <Trash2 className="w-4 h-4" /> حذف
            </Button>
          )}
        </div>
      </motion.div>

      {/* Basic info */}
      <Section title="البيانات الأساسية" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Row label="رقم الهوية"        value={b.national_id} />
          <Row label="العمر"             value={b.age ? `${b.age} سنة` : null} />
          <Row label="سنة الميلاد"       value={b.birth_year} />
          <Row label="الجنس"             value={b.gender} />
          <Row label="الحالة الاجتماعية" value={b.social_status} />
          <Row label="المستوى التعليمي"  value={b.education_level} />
          <Row label="الحالة الصحية"     value={b.health_status} />
          {b.disability_type && <Row label="نوع الإعاقة" value={b.disability_type} />}
          {b.sickness_type && <Row label="نوع المرض" value={b.sickness_type} />}
          <Row label="الجوال الأساسي"    value={b.phone} />
          <Row label="جوال بديل"         value={b.phone_alt} />
          <Row label="عدد أفراد الأسرة"  value={b.dependents_count} />
          <Row label="العنوان الوطني"    value={b.national_address} />
        </div>
        {b.researcher_opinion_basic && (
          <div className="rounded-lg bg-muted/40 p-3 mt-2">
            <p className="text-xs text-muted-foreground mb-1">رأي الباحث</p>
            <p className="text-sm">{b.researcher_opinion_basic}</p>
          </div>
        )}
      </Section>

      {/* Dependents */}
      {b.dependents_data?.length > 0 && (
        <Section title="التابعون" icon={Users}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs">
                  <th className="text-right pb-2 font-medium">#</th>
                  <th className="text-right pb-2 font-medium">الاسم</th>
                  <th className="text-right pb-2 font-medium">العمر</th>
                  <th className="text-right pb-2 font-medium">العلاقة</th>
                  <th className="text-right pb-2 font-medium">الصحة</th>
                  <th className="text-right pb-2 font-medium">التعليم</th>
                </tr>
              </thead>
              <tbody>
                {b.dependents_data.map((d, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="py-1.5 px-1">{i + 1}</td>
                    <td className="py-1.5 px-1">{d.name || "—"}</td>
                    <td className="py-1.5 px-1">{d.age || "—"}</td>
                    <td className="py-1.5 px-1">{d.relation || "—"}</td>
                    <td className="py-1.5 px-1">{d.health_status || "—"}</td>
                    <td className="py-1.5 px-1">{d.education || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Financial */}
      <Section title="الوضع المالي" icon={DollarSign}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {b.income_salary > 0 && <Row label="راتب" value={`${b.income_salary} ر.س`} />}
          {b.income_social_security > 0 && <Row label="ضمان" value={`${b.income_social_security} ر.س`} />}
          {b.income_account_citizen > 0 && <Row label="حساب المواطن" value={`${b.income_account_citizen} ر.س`} />}
          {b.income_rehab > 0 && <Row label="تأهيل" value={`${b.income_rehab} ر.س`} />}
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          {b.total_income !== undefined && (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 px-4 py-2 text-center">
              <p className="text-xs text-muted-foreground">إجمالي الدخل</p>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">{Number(b.total_income || 0).toFixed(2)} ر.س</p>
            </div>
          )}
          {b.total_expenses !== undefined && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 px-4 py-2 text-center">
              <p className="text-xs text-muted-foreground">إجمالي المصروفات</p>
              <p className="font-bold text-red-700 dark:text-red-400">{Number(b.total_expenses || 0).toFixed(2)} ر.س</p>
            </div>
          )}
          {b.net_income !== undefined && (
            <div className={cn("rounded-lg border px-4 py-2 text-center", Number(b.net_income) >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200" : "bg-red-50 dark:bg-red-900/20 border-red-200")}>
              <p className="text-xs text-muted-foreground">صافي الدخل</p>
              <p className={cn("font-bold", Number(b.net_income) >= 0 ? "text-emerald-700" : "text-red-700")}>
                {Number(b.net_income || 0).toFixed(2)} ر.س
              </p>
            </div>
          )}
        </div>
        {b.researcher_opinion_financial && (
          <div className="rounded-lg bg-muted/40 p-3 mt-2">
            <p className="text-xs text-muted-foreground mb-1">رأي الباحث</p>
            <p className="text-sm">{b.researcher_opinion_financial}</p>
          </div>
        )}
      </Section>

      {/* Housing */}
      <Section title="البيئة والسكن" icon={Home}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Row label="المدينة"       value={b.city} />
          <Row label="الحي"          value={b.district} />
          <Row label="نوع البيئة"    value={b.environment_type} />
          <Row label="نوع السكن"     value={b.housing_type} />
          <Row label="حيازة السكن"   value={b.housing_tenure} />
          <Row label="تاريخ الزيارة" value={b.visit_date} />
        </div>
        {b.researcher_opinion_housing && (
          <div className="rounded-lg bg-muted/40 p-3 mt-2">
            <p className="text-xs text-muted-foreground mb-1">رأي الباحث</p>
            <p className="text-sm">{b.researcher_opinion_housing}</p>
          </div>
        )}
      </Section>

      {/* Needs */}
      {(Object.keys(basicNeeds).length > 0 || nonBasicNeeds.length > 0) && (
        <Section title="الاحتياجات" icon={Heart}>
          {Object.keys(basicNeeds).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">احتياجات أساسية</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(basicNeeds).map(([id, val]) => (
                  <span key={id} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {id} {val?.details?.length > 0 ? `(${val.details.join("، ")})` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
          {nonBasicNeeds.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">احتياجات تطويرية</p>
              <div className="flex flex-wrap gap-2">
                {nonBasicNeeds.map(id => (
                  <span key={id} className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent-foreground border border-accent/30">
                    {NON_BASIC_LABELS[id] || id}
                  </span>
                ))}
              </div>
            </div>
          )}
          {b.researcher_opinion_needs && (
            <div className="rounded-lg bg-muted/40 p-3 mt-2">
              <p className="text-xs text-muted-foreground mb-1">رأي الباحث</p>
              <p className="text-sm">{b.researcher_opinion_needs}</p>
            </div>
          )}
        </Section>
      )}

      {/* Final recommendation */}
      {(b.final_recommendation || b.notes) && (
        <Section title="التوصية والملاحظات" icon={CheckCircle2}>
          {b.final_recommendation && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
              <p className="text-xs text-muted-foreground mb-1">التوصية النهائية</p>
              <p className="text-sm text-foreground">{b.final_recommendation}</p>
            </div>
          )}
          {b.notes && (
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground mb-1">ملاحظات الباحث</p>
              <p className="text-sm">{b.notes}</p>
            </div>
          )}
          {b.case_classification && <Row label="تصنيف الحالة" value={b.case_classification} />}
          {b.researcher_name && <Row label="الباحث الاجتماعي" value={b.researcher_name} />}
          {b.ngo_name && <Row label="المنظمة" value={b.ngo_name} />}
          {b.approved_by && <Row label="اعتماد" value={b.approved_by} />}
        </Section>
      )}

      {/* Documents */}
      {b.documents?.length > 0 && (
        <Section title="المرفقات والوثائق" icon={Paperclip}>
          {docImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {docImages.map((d, i) => {
                const url = typeof d === "string" ? d : d?.url;
                const name = typeof d === "object" ? d?.name : `صورة ${i + 1}`;
                return url ? (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                    className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-muted block">
                    <img src={url} alt={name} className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = "none"; }} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs">عرض</span>
                    </div>
                  </a>
                ) : null;
              })}
            </div>
          )}
          {docFiles.map((d, i) => {
            const url = typeof d === "string" ? d : d?.url;
            const name = typeof d === "object" ? d?.name : `ملف ${i + 1}`;
            return url ? (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border">
                <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-sm flex-1 truncate">{name}</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">تحميل</a>
              </div>
            ) : null;
          })}
        </Section>
      )}

      {/* Delete confirm */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذه الحالة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-destructive hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}