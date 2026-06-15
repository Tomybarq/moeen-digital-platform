import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Users, Activity, Megaphone, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATE_ICONS = {
  ngo_performance: TrendingUp,
  beneficiary_distribution: Users,
  marketing_effectiveness: Megaphone,
  platform_activity: Activity,
  financial_overview: DollarSign,
};

const TEMPLATE_LABELS = {
  ngo_performance: "أداء المنظمات",
  beneficiary_distribution: "توزيع المستفيدين",
  marketing_effectiveness: "فعالية التسويق",
  platform_activity: "نشاط المنصة",
  financial_overview: "الوضع المالي",
};

const TEMPLATE_DESCRIPTIONS = {
  ngo_performance: "ملخص أداء كل منظمة — عدد المستفيدين، الحالات النشطة، المؤرشفة، والمدعومة",
  beneficiary_distribution: "توزيع المستفيدين حسب المدينة، نوع الحالة، الأولوية، الحالة، ومستوى الدخل",
  marketing_effectiveness: "تقييم أداء المسوّقين — الحملات، نطاق الوصول، والمستفيدين المرتبطين",
  platform_activity: "ملخص نشاط المنصة — المستخدمين، سجل التدقيق، والعمليات الأخيرة",
  financial_overview: "تحليل الوضع المالي للمستفيدين — الدخل، المصروفات، وصافي الدخل",
};

const TEMPLATE_COLORS = {
  ngo_performance: "from-blue-500 to-blue-600",
  beneficiary_distribution: "from-emerald-500 to-emerald-600",
  marketing_effectiveness: "from-amber-500 to-amber-600",
  platform_activity: "from-violet-500 to-violet-600",
  financial_overview: "from-rose-500 to-rose-600",
};

export default function ReportTemplateCard({ reportType, onSelect, isSelected, isLoading }) {
  const Icon = TEMPLATE_ICONS[reportType] || FileText;
  const label = TEMPLATE_LABELS[reportType] || reportType;
  const description = TEMPLATE_DESCRIPTIONS[reportType] || "";
  const gradient = TEMPLATE_COLORS[reportType] || "from-gray-500 to-gray-600";

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg",
        isSelected
          ? "ring-2 ring-[#00A651] shadow-md shadow-[#00A651]/20"
          : "hover:border-[#00A651]/40"
      )}
      onClick={() => onSelect(reportType)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", gradient)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">{label}</CardTitle>
            <CardDescription className="mt-1 text-xs leading-relaxed line-clamp-2">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className={cn("w-full", isSelected && "bg-[#00A651] hover:bg-[#00A651]/90")}
          disabled={isLoading}
          onClick={(e) => { e.stopPropagation(); onSelect(reportType); }}
        >
          {isSelected && isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري التوليد...
            </>
          ) : isSelected ? (
            "تم التحديد"
          ) : (
            "عرض التقرير"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export { TEMPLATE_LABELS, TEMPLATE_DESCRIPTIONS, TEMPLATE_ICONS, TEMPLATE_COLORS };