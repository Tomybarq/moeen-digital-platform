import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ClipboardPlus, ListChecks, Search } from "lucide-react";
import CaseSubmissionForm from "@/components/researcher/CaseSubmissionForm";
import MyCasesList from "@/components/researcher/MyCasesList";

export default function ResearcherWorkspace() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("new");

  const researcherName = user?.full_name || "";

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    setActiveTab("my-cases");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              مساحة الباحث الاجتماعي
              {researcherName && <span className="font-normal text-muted-foreground text-base"> — {researcherName}</span>}
            </h2>
            <p className="text-sm text-muted-foreground">رفع الحالات الميدانية وإدارة ملفاتك المسجّلة</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList className="grid w-full grid-cols-2 h-11">
          <TabsTrigger value="new" className="gap-2 text-sm cursor-pointer">
            <ClipboardPlus className="w-4 h-4" />
            رفع حالة جديدة
          </TabsTrigger>
          <TabsTrigger value="my-cases" className="gap-2 text-sm cursor-pointer">
            <ListChecks className="w-4 h-4" />
            حالاتي
          </TabsTrigger>
        </TabsList>

        {/* New Case */}
        <TabsContent value="new" className="mt-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            {/* Guidance banner */}
            <div className="mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-4 flex gap-3">
              <ClipboardPlus className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">إرشادات رفع الحالة</p>
                <ul className="text-xs text-emerald-700 dark:text-emerald-400 space-y-0.5 list-disc list-inside">
                  <li>تأكد من اكتمال البيانات الشخصية الأساسية قبل المتابعة.</li>
                  <li>حدّد تصنيف الحالة وأولويتها بدقة لضمان سرعة الاستجابة.</li>
                  <li>أرفق استمارة الدراسة الاجتماعية بصيغة Excel وصور الوثائق الداعمة.</li>
                  <li>راجع البيانات في الخطوة الأخيرة قبل الإرسال النهائي.</li>
                </ul>
              </div>
            </div>
            <CaseSubmissionForm researcherName={researcherName} onSuccess={handleSuccess} />
          </div>
        </TabsContent>

        {/* My Cases */}
        <TabsContent value="my-cases" className="mt-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <MyCasesList researcherName={researcherName} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}