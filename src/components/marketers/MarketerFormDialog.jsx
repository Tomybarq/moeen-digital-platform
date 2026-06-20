import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { coreApi } from "@/api/coreClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Megaphone, AlertTriangle, Loader2 } from "lucide-react";
import { marketerSchema, zodValidate, withMinDelay } from "@/lib/schemas";
import { sanitizeFormData } from "@/lib/validation";

const EMPTY = {
  full_name: "", phone: "", email: "", city: "",
  ngo_id: "", ngo_name: "", specialization: "",
  campaigns_count: "", status: "active", notes: "",
};

function Field({ label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}{required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}

export default function MarketerFormDialog({ open, onOpenChange, marketer, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const { data: ngos = [] } = useQuery({
    queryKey: ["ngos-list"],
    queryFn: () => coreApi.entities.NGO.filter({ status: "active" }),
    enabled: open,
  });

  useEffect(() => {
    setForm(marketer ? { ...EMPTY, ...marketer } : EMPTY);
    setErrors({});
  }, [marketer, open]);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target?.value ?? e }));
  const setSel = (f) => (v) => setForm(p => ({ ...p, [f]: v }));

  const handleNgoChange = (ngoId) => {
    const ngo = ngos.find(n => n.id === ngoId);
    setForm(p => ({ ...p, ngo_id: ngoId, ngo_name: ngo?.name || "" }));
  };

  const handleSave = async () => {
    const { valid, errors: validationErrors } = zodValidate(marketerSchema, form);
    if (!valid) { setErrors(validationErrors); return; }
    setSaving(true);
    await withMinDelay(onSave(sanitizeFormData({
      ...form,
      campaigns_count: form.campaigns_count ? Number(form.campaigns_count) : undefined,
    })));
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Megaphone className="w-4 h-4 text-primary" />
            {marketer ? "تعديل بيانات المسوّق" : "إضافة مسوّق جديد"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Personal */}
          <Section title="البيانات الشخصية">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="الاسم الكامل" required error={errors.full_name}>
                <Input placeholder="أحمد محمد السلمي" value={form.full_name} onChange={set("full_name")}
                  className={errors.full_name ? "border-destructive" : ""} />
              </Field>
              <Field label="رقم الجوال" required error={errors.phone}>
                <Input placeholder="05xxxxxxxx" value={form.phone} onChange={set("phone")}
                  className={errors.phone ? "border-destructive" : ""} />
              </Field>
              <Field label="البريد الإلكتروني" error={errors.email}>
                <Input type="email" placeholder="email@example.com" value={form.email} onChange={set("email")}
                  className={errors.email ? "border-destructive" : ""} />
              </Field>
              <Field label="المدينة">
                <Input placeholder="الرياض" value={form.city} onChange={set("city")} />
              </Field>
            </div>
          </Section>

          {/* NGO Assignment */}
          <Section title="المنظمة والتخصص">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="المنظمة المرتبطة" required error={errors.ngo_name}>
                {ngos.length > 0 ? (
                  <Select value={form.ngo_id} onValueChange={handleNgoChange}>
                    <SelectTrigger className={errors.ngo_name ? "border-destructive" : ""}>
                      <SelectValue placeholder="اختر منظمة" />
                    </SelectTrigger>
                    <SelectContent>
                      {ngos.map(n => (
                        <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input placeholder="اسم المنظمة" value={form.ngo_name} onChange={set("ngo_name")}
                    className={errors.ngo_name ? "border-destructive" : ""} />
                )}
              </Field>
              <Field label="التخصص التسويقي">
                <Select value={form.specialization} onValueChange={setSel("specialization")}>
                  <SelectTrigger><SelectValue placeholder="اختر التخصص" /></SelectTrigger>
                  <SelectContent>
                    {["تسويق رقمي","تسويق ميداني","علاقات عامة","إعلام اجتماعي","أخرى"].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="عدد الحملات المنجزة">
                <Input type="number" min={0} placeholder="0" value={form.campaigns_count} onChange={set("campaigns_count")} />
              </Field>
              <Field label="الحالة">
                <Select value={form.status} onValueChange={setSel("status")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="archived">مؤرشف</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </Section>

          {/* Notes */}
          <Section title="ملاحظات">
            <Textarea placeholder="أي ملاحظات إضافية عن المسوّق…" rows={3}
              className="resize-none" value={form.notes} onChange={set("notes")} />
          </Section>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer gap-1.5">
            <X className="w-4 h-4" /> إلغاء
          </Button>
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer gap-1.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "جاري الحفظ…" : marketer ? "حفظ التعديلات" : "إضافة المسوّق"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground border-b border-border pb-1.5">{title}</h4>
      {children}
    </div>
  );
}