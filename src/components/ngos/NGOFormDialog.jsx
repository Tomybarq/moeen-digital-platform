import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Building2, Save, X } from "lucide-react";

const EMPTY = {
  name: "", responsible_person: "", phone: "", email: "",
  donation_url: "", city: "", category: "", notes: "", logo_url: "",
};

const CATEGORIES = ["خيرية", "تعليمية", "صحية", "بيئية", "اجتماعية", "أخرى"];

export default function NGOFormDialog({ open, onOpenChange, ngo, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(ngo ? { ...EMPTY, ...ngo } : EMPTY);
  }, [ngo, open]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target?.value ?? e }));

  const isValid = form.name.trim() && form.responsible_person.trim() && form.phone.trim() && form.email.trim();

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    await onSave({ ...form });
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Building2 className="w-4 h-4 text-primary" />
            {ngo ? "تعديل بيانات المنظمة" : "إضافة منظمة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <Field label="اسم المنظمة *">
            <Input placeholder="جمعية البر الخيرية بعفراء" value={form.name} onChange={set("name")} />
          </Field>

          {/* Responsible */}
          <Field label="المسؤول عن المنظمة *">
            <Input placeholder="اسم المسؤول" value={form.responsible_person} onChange={set("responsible_person")} />
          </Field>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="رقم التواصل *">
              <Input placeholder="05xxxxxxxx" value={form.phone} onChange={set("phone")} />
            </Field>
            <Field label="البريد الإلكتروني *">
              <Input type="email" placeholder="info@ngo.org" value={form.email} onChange={set("email")} />
            </Field>
          </div>

          {/* City + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="المدينة">
              <Input placeholder="الرياض" value={form.city} onChange={set("city")} />
            </Field>
            <Field label="التصنيف">
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Donation URL */}
          <Field label="رابط منصة التبرع">
            <Input placeholder="https://sahem.ngo/..." value={form.donation_url} onChange={set("donation_url")} />
          </Field>

          {/* Logo URL */}
          <Field label="رابط الشعار (اختياري)">
            <Input placeholder="https://..." value={form.logo_url} onChange={set("logo_url")} />
          </Field>

          {/* Notes */}
          <Field label="ملاحظات">
            <Textarea
              placeholder="أي معلومات إضافية عن المنظمة…"
              className="resize-none"
              rows={3}
              value={form.notes}
              onChange={set("notes")}
            />
          </Field>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer gap-1.5">
            <X className="w-4 h-4" /> إلغاء
          </Button>
          <Button onClick={handleSave} disabled={!isValid || saving} className="cursor-pointer gap-1.5">
            <Save className="w-4 h-4" />
            {saving ? "جاري الحفظ…" : ngo ? "حفظ التعديلات" : "إضافة المنظمة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}