import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import StepIndicator from "./StepIndicator";
import {
  User, MapPin, Briefcase, FileText, Paperclip,
  ChevronLeft, ChevronRight, CheckCircle2, Upload,
  AlertTriangle, ArrowUp, Minus, ArrowDown, Trash2, X,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "البيانات الشخصية", icon: User },
  { label: "بيانات الحالة",    icon: Briefcase },
  { label: "المستندات",        icon: Paperclip },
  { label: "المراجعة والإرسال", icon: CheckCircle2 },
];

const PRIORITY_CFG = {
  "عاجل":  { icon: AlertTriangle, cls: "border-red-400 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
  "مرتفع": { icon: ArrowUp,       cls: "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" },
  "متوسط": { icon: Minus,         cls: "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" },
  "منخفض": { icon: ArrowDown,     cls: "border-green-400 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
};

const EMPTY = {
  full_name: "", national_id: "", age: "", gender: "", phone: "",
  city: "", district: "", social_status: "", dependents_count: "",
  income_level: "", disability: false,
  case_type: "", priority: "متوسط", ngo_name: "", notes: "",
  visit_date: new Date().toISOString().slice(0, 10),
  documents: [],
};

function Field({ label, required, error, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error  && <p className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function Sel({ value, onChange, placeholder, options }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}

// ── Step 1: Personal ──────────────────────────────────────────────────────────
function StepPersonal({ form, setForm, errors }) {
  const set = f => e => setForm(p => ({ ...p, [f]: e.target?.value ?? e }));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="الاسم الكامل للمستفيد" required error={errors.full_name}>
        <Input placeholder="محمد أحمد العتيبي" value={form.full_name} onChange={set("full_name")} className={errors.full_name ? "border-destructive" : ""} />
      </Field>
      <Field label="رقم الهوية الوطنية">
        <Input placeholder="1xxxxxxxxx" value={form.national_id} onChange={set("national_id")} maxLength={10} />
      </Field>
      <Field label="العمر">
        <Input type="number" min={1} max={120} placeholder="35" value={form.age} onChange={set("age")} />
      </Field>
      <Field label="الجنس">
        <Sel value={form.gender} onChange={v => setForm(p => ({ ...p, gender: v }))} placeholder="اختر الجنس" options={["ذكر","أنثى"]} />
      </Field>
      <Field label="رقم الجوال" required error={errors.phone}>
        <Input placeholder="05xxxxxxxx" value={form.phone} onChange={set("phone")} className={errors.phone ? "border-destructive" : ""} />
      </Field>
      <Field label="الحالة الاجتماعية">
        <Sel value={form.social_status} onChange={v => setForm(p => ({ ...p, social_status: v }))} placeholder="اختر" options={["أعزب","متزوج","مطلق","أرمل"]} />
      </Field>
      <Field label="عدد أفراد الأسرة">
        <Input type="number" min={0} placeholder="4" value={form.dependents_count} onChange={set("dependents_count")} />
      </Field>
      <Field label="وجود إعاقة">
        <div className="flex items-center gap-3 h-10">
          <Switch checked={!!form.disability} onCheckedChange={v => setForm(p => ({ ...p, disability: v }))} />
          <span className="text-sm">{form.disability ? "نعم — يوجد إعاقة" : "لا"}</span>
        </div>
      </Field>
    </div>
  );
}

// ── Step 2: Case ──────────────────────────────────────────────────────────────
function StepCase({ form, setForm, errors }) {
  const set = f => e => setForm(p => ({ ...p, [f]: e.target?.value ?? e }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="المدينة" required error={errors.city}>
          <Input placeholder="الرياض" value={form.city} onChange={set("city")} className={errors.city ? "border-destructive" : ""} />
        </Field>
        <Field label="الحي">
          <Input placeholder="العليا" value={form.district} onChange={set("district")} />
        </Field>
        <Field label="مستوى الدخل">
          <Sel value={form.income_level} onChange={v => setForm(p => ({ ...p, income_level: v }))} placeholder="اختر" options={["لا يوجد دخل","دخل منخفض","دخل متوسط"]} />
        </Field>
        <Field label="المنظمة الراعية">
          <Input placeholder="اسم المنظمة" value={form.ngo_name} onChange={set("ngo_name")} />
        </Field>
        <Field label="تاريخ الزيارة الميدانية">
          <Input type="date" value={form.visit_date} onChange={set("visit_date")} />
        </Field>
      </div>

      {/* Case type cards */}
      <Field label="تصنيف الحالة" required error={errors.case_type}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-1">
          {[
            { v: "مادي",    emoji: "💰" },
            { v: "صحي",     emoji: "🏥" },
            { v: "تعليمي",  emoji: "📚" },
            { v: "اجتماعي", emoji: "🤝" },
            { v: "متعدد",   emoji: "🔀" },
          ].map(({ v, emoji }) => (
            <button key={v} type="button" onClick={() => setForm(p => ({ ...p, case_type: v }))}
              className={cn("flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer",
                form.case_type === v
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40 hover:bg-muted/50"
              )}>
              <span className="text-xl">{emoji}</span>
              {v}
            </button>
          ))}
        </div>
      </Field>

      {/* Priority selector */}
      <Field label="أولوية الحالة" required error={errors.priority}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
          {Object.entries(PRIORITY_CFG).map(([p, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer",
                  form.priority === p ? cfg.cls + " border-2" : "border-border hover:border-primary/30"
                )}>
                <Icon className="w-4 h-4 flex-shrink-0" /> {p}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="ملاحظات الباحث">
        <Textarea placeholder="صف الوضع العام للحالة، الاحتياجات الفورية، أي ملاحظات ميدانية…"
          rows={4} className="resize-none" value={form.notes}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
      </Field>
    </div>
  );
}

// ── Step 3: Documents ─────────────────────────────────────────────────────────
function StepDocuments({ form, setForm }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const imgRef  = useRef(null);
  const excelRef = useRef(null);

  const handleUpload = async (files, type) => {
    if (!files?.length) return;
    setUploading(true);
    setUploadError("");
    const uploaded = [];
    for (const file of Array.from(files)) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      uploaded.push({ url: file_url, name: file.name, type });
    }
    setForm(p => ({ ...p, documents: [...(p.documents || []), ...uploaded] }));
    setUploading(false);
  };

  const removeDoc = (url) =>
    setForm(p => ({ ...p, documents: p.documents.filter(d => d.url !== url) }));

  const images = (form.documents || []).filter(d => d.type === "image");
  const excels = (form.documents || []).filter(d => d.type === "excel");

  return (
    <div className="space-y-6">
      {/* Excel forms */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> استمارة الدراسة الاجتماعية (Excel)
        </h4>
        <div onClick={() => excelRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors">
          <input ref={excelRef} type="file" accept=".xlsx,.xls,.csv" multiple className="hidden"
            onChange={e => handleUpload(e.target.files, "excel")} />
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
            <Upload className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium">{uploading ? "جاري الرفع…" : "انقر لرفع ملف Excel"}</p>
          <p className="text-xs text-muted-foreground">يدعم .xlsx و .xls و .csv</p>
        </div>
        {excels.length > 0 && (
          <div className="mt-3 space-y-2">
            {excels.map(d => (
              <div key={d.url} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border">
                <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-sm flex-1 truncate">{d.name}</span>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">عرض</a>
                <button onClick={() => removeDoc(d.url)} className="text-muted-foreground hover:text-destructive">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image documents */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-primary" /> صور الوثائق والمستندات الداعمة
        </h4>
        <div onClick={() => imgRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors">
          <input ref={imgRef} type="file" accept="image/*,.pdf" multiple className="hidden"
            onChange={e => handleUpload(e.target.files, "image")} />
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm font-medium">{uploading ? "جاري الرفع…" : "انقر لرفع صور الوثائق"}</p>
          <p className="text-xs text-muted-foreground">هوية وطنية، تقارير طبية، شهادات، صور ميدانية…</p>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
            {images.map(d => (
              <div key={d.url} className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-muted">
                <img src={d.url} alt={d.name} className="w-full h-full object-cover" onError={e => e.target.style.display = "none"} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-1.5">
                  <span className="text-white text-xs truncate flex-1">{d.name}</span>
                  <button onClick={() => removeDoc(d.url)} className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  );
}

// ── Step 4: Review ────────────────────────────────────────────────────────────
function StepReview({ form }) {
  const PriorityIcon = PRIORITY_CFG[form.priority]?.icon || Minus;
  const docs = form.documents || [];

  const rows = [
    ["الاسم الكامل", form.full_name], ["رقم الهوية", form.national_id],
    ["العمر", form.age ? `${form.age} سنة` : "—"], ["الجنس", form.gender || "—"],
    ["الجوال", form.phone], ["المدينة", `${form.city}${form.district ? ` — ${form.district}` : ""}`],
    ["الحالة الاجتماعية", form.social_status || "—"], ["أفراد الأسرة", form.dependents_count || "—"],
    ["مستوى الدخل", form.income_level || "—"], ["إعاقة", form.disability ? "نعم" : "لا"],
    ["المنظمة", form.ngo_name || "—"], ["تاريخ الزيارة", form.visit_date || "—"],
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
        <p className="text-sm text-foreground">راجع جميع البيانات قبل الإرسال. يمكنك العودة لأي خطوة لتعديل المعلومات.</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Briefcase className="w-3.5 h-3.5" /> {form.case_type || "—"}
        </span>
        <span className={cn("flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full border-2", PRIORITY_CFG[form.priority]?.cls)}>
          <PriorityIcon className="w-3.5 h-3.5" /> {form.priority}
        </span>
        {docs.length > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground">
            <Paperclip className="w-3.5 h-3.5" /> {docs.length} مرفق
          </span>
        )}
      </div>

      {/* Data table */}
      <div className="rounded-xl border border-border overflow-hidden">
        {rows.map(([label, val], i) => (
          <div key={i} className={cn("flex items-center px-4 py-2.5 text-sm", i % 2 === 0 ? "bg-muted/30" : "bg-card")}>
            <span className="w-40 flex-shrink-0 text-muted-foreground font-medium">{label}</span>
            <span className="text-foreground">{val || "—"}</span>
          </div>
        ))}
      </div>

      {form.notes && (
        <div className="rounded-xl bg-muted/40 border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">ملاحظات الباحث</p>
          <p className="text-sm text-foreground">{form.notes}</p>
        </div>
      )}
    </div>
  );
}

// ── Main exported component ───────────────────────────────────────────────────
export default function CaseSubmissionForm({ researcherName, onSuccess }) {
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState({ ...EMPTY, researcher_name: researcherName || "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.full_name.trim()) e.full_name = "الاسم الكامل مطلوب";
      if (!form.phone.trim()) e.phone = "رقم الجوال مطلوب";
      if (form.phone && !/^05\d{8}$/.test(form.phone)) e.phone = "رقم الجوال غير صحيح (يبدأ بـ 05)";
    }
    if (s === 1) {
      if (!form.city.trim()) e.city = "المدينة مطلوبة";
      if (!form.case_type) e.case_type = "يرجى تحديد تصنيف الحالة";
      if (!form.priority) e.priority = "يرجى تحديد الأولوية";
    }
    return e;
  };

  const nextStep = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const prevStep = () => { setErrors({}); setStep(s => s - 1); };

  const handleSubmit = async () => {
    setSubmitting(true);
    const docs = (form.documents || []).map(d => d.url);
    await base44.entities.Beneficiary.create({
      ...form,
      age: form.age ? Number(form.age) : undefined,
      dependents_count: form.dependents_count ? Number(form.dependents_count) : undefined,
      documents: docs,
      status: "active",
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStep(0);
      setForm({ ...EMPTY, researcher_name: researcherName || "" });
      if (onSuccess) onSuccess();
    }, 2500);
  };

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">تم رفع الحالة بنجاح!</h3>
        <p className="text-muted-foreground text-sm">سيتم مراجعة البيانات من قِبل مدير المنصة وتحديد الأولويات.</p>
      </motion.div>
    );
  }

  const stepComponents = [
    <StepPersonal key={0} form={form} setForm={setForm} errors={errors} />,
    <StepCase     key={1} form={form} setForm={setForm} errors={errors} />,
    <StepDocuments key={2} form={form} setForm={setForm} />,
    <StepReview   key={3} form={form} />,
  ];

  return (
    <div className="space-y-6">
      <StepIndicator steps={STEPS} currentStep={step} />

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}>
          {stepComponents[step]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={prevStep} disabled={step === 0} className="gap-2 cursor-pointer">
          <ChevronRight className="w-4 h-4" /> السابق
        </Button>
        <span className="text-xs text-muted-foreground">{step + 1} / {STEPS.length}</span>
        {step < STEPS.length - 1 ? (
          <Button onClick={nextStep} className="gap-2 cursor-pointer">
            التالي <ChevronLeft className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting} className="gap-2 cursor-pointer bg-primary">
            <CheckCircle2 className="w-4 h-4" />
            {submitting ? "جاري الإرسال…" : "إرسال الحالة"}
          </Button>
        )}
      </div>
    </div>
  );
}