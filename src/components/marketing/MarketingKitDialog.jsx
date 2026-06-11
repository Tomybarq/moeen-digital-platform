import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Search, Filter, MapPin, Users, Calendar, Building2,
  AlertTriangle, ArrowUp, Minus, ArrowDown, Share2,
  CheckSquare, Square, Package, X, Heart, Phone,
} from "lucide-react";

const PRIORITY_CFG = {
  "عاجل":  { icon: AlertTriangle, cls: "text-red-600",    bg: "bg-red-50 border-red-200",    pill: "bg-red-100 text-red-700" },
  "مرتفع": { icon: ArrowUp,       cls: "text-orange-500", bg: "bg-orange-50 border-orange-200", pill: "bg-orange-100 text-orange-700" },
  "متوسط": { icon: Minus,         cls: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", pill: "bg-yellow-100 text-yellow-700" },
  "منخفض": { icon: ArrowDown,     cls: "text-green-600",  bg: "bg-green-50 border-green-200",  pill: "bg-green-100 text-green-700" },
};

const CASE_EMOJIS = { "مادي": "💰", "صحي": "🏥", "تعليمي": "📚", "اجتماعي": "🤝", "متعدد": "🔀" };

const KIT_THEMES = [
  { id: "emerald", label: "أخضر",  from: "#059669", to: "#10b981", accent: "#d1fae5" },
  { id: "blue",    label: "أزرق",  from: "#1d4ed8", to: "#3b82f6", accent: "#dbeafe" },
  { id: "purple",  label: "بنفسجي", from: "#7c3aed", to: "#a78bfa", accent: "#ede9fe" },
  { id: "rose",    label: "وردي",  from: "#be185d", to: "#ec4899", accent: "#fce7f3" },
];

function CaseKitCard({ b, theme, index }) {
  const p = PRIORITY_CFG[b.priority] || PRIORITY_CFG["متوسط"];
  const PIcon = p.icon;
  const emoji = CASE_EMOJIS[b.case_type] || "📋";

  return (
    <div
      dir="rtl"
      style={{
        background: `linear-gradient(135deg, ${theme.from}12, ${theme.to}08)`,
        borderColor: `${theme.from}30`,
      }}
      className="rounded-2xl border p-4 space-y-3 text-right"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: theme.accent }}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-800 leading-tight">
            {b.full_name ? `حالة رقم ${index + 1}` : "—"}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {b.case_type && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: theme.accent, color: theme.from }}>
                {b.case_type}
              </span>
            )}
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1", p.pill)}>
              <PIcon className="w-3 h-3" /> {b.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        {b.city && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.from }} />
            <span>{b.city}{b.district ? ` · ${b.district}` : ""}</span>
          </div>
        )}
        {(b.age || b.gender) && (
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.from }} />
            <span>{b.age ? `${b.age} سنة` : ""}{b.gender ? ` · ${b.gender}` : ""}</span>
          </div>
        )}
        {b.ngo_name && (
          <div className="flex items-center gap-1.5 col-span-2">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.from }} />
            <span>{b.ngo_name}</span>
          </div>
        )}
      </div>

      {b.notes && (
        <p className="text-xs text-gray-500 bg-white/60 rounded-lg px-3 py-2 line-clamp-2">{b.notes}</p>
      )}
    </div>
  );
}

export default function MarketingKitDialog({ open, onOpenChange, beneficiaries = [] }) {
  const [search, setSearch]       = useState("");
  const [filterCity, setFilterCity] = useState("الكل");
  const [filterNgo, setFilterNgo]   = useState("الكل");
  const [filterPriority, setFilterPriority] = useState("الكل");
  const [filterAge, setFilterAge]   = useState("الكل");
  const [selected, setSelected]     = useState(new Set());
  const [themeId, setThemeId]       = useState("emerald");
  const [step, setStep]             = useState("filter"); // "filter" | "kit"

  const theme = KIT_THEMES.find(t => t.id === themeId) || KIT_THEMES[0];

  // Unique filter options
  const cities = useMemo(() => ["الكل", ...new Set(beneficiaries.map(b => b.city).filter(Boolean))], [beneficiaries]);
  const ngos   = useMemo(() => ["الكل", ...new Set(beneficiaries.map(b => b.ngo_name).filter(Boolean))], [beneficiaries]);

  const filtered = useMemo(() => {
    return beneficiaries.filter(b => {
      if (b.status === "archived") return false;
      if (search && !b.full_name?.includes(search) && !b.city?.includes(search) && !b.case_type?.includes(search)) return false;
      if (filterCity !== "الكل" && b.city !== filterCity) return false;
      if (filterNgo !== "الكل" && b.ngo_name !== filterNgo) return false;
      if (filterPriority !== "الكل" && b.priority !== filterPriority) return false;
      if (filterAge !== "الكل") {
        const age = b.age || 0;
        if (filterAge === "أقل من 18" && age >= 18) return false;
        if (filterAge === "18-40" && (age < 18 || age > 40)) return false;
        if (filterAge === "41-60" && (age < 41 || age > 60)) return false;
        if (filterAge === "أكثر من 60" && age <= 60) return false;
      }
      return true;
    });
  }, [beneficiaries, search, filterCity, filterNgo, filterPriority, filterAge]);

  const selectedList = filtered.filter(b => selected.has(b.id));

  const toggleSelect = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(b => b.id)));
  };

  const resetFilters = () => {
    setSearch(""); setFilterCity("الكل"); setFilterNgo("الكل");
    setFilterPriority("الكل"); setFilterAge("الكل");
  };

  // WhatsApp share text
  const buildWhatsAppText = () => {
    const date = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
    let text = `🌟 *الطاقم التسويقي - منصة مُعين* 🌟\n`;
    text += `📅 ${date}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `🤲 *حالات تحتاج دعمكم* (${selectedList.length} حالة)\n\n`;

    selectedList.forEach((b, i) => {
      const p = PRIORITY_CFG[b.priority];
      const emoji = CASE_EMOJIS[b.case_type] || "📋";
      text += `${emoji} *الحالة ${i + 1}*\n`;
      if (b.city) text += `📍 المدينة: ${b.city}${b.district ? ` - ${b.district}` : ""}\n`;
      if (b.case_type) text += `📂 النوع: ${b.case_type}\n`;
      if (b.priority) text += `🔔 الأولوية: ${b.priority}\n`;
      if (b.age) text += `👤 العمر: ${b.age} سنة\n`;
      if (b.ngo_name) text += `🏢 المنظمة: ${b.ngo_name}\n`;
      if (b.notes) text += `💬 ${b.notes.slice(0, 80)}${b.notes.length > 80 ? "…" : ""}\n`;
      text += `\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `❤️ ساهم في دعم هذه الحالات وكن سبباً في تغيير حياتهم\n`;
    text += `🇸🇦 منصة مُعين | المملكة العربية السعودية`;
    return encodeURIComponent(text);
  };

  const handleShare = () => {
    window.open(`https://wa.me/?text=${buildWhatsAppText()}`, "_blank");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setStep("filter"); setSelected(new Set()); resetFilters(); }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-hidden flex flex-col p-0" dir="rtl">
        {/* Title bar */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
          <DialogTitle className="flex items-center gap-2.5 text-base">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: theme.accent }}>
              <Package className="w-4 h-4" style={{ color: theme.from }} />
            </div>
            الطاقم التسويقي للحالات
            {step === "kit" && selectedList.length > 0 && (
              <span className="mr-auto text-xs font-normal px-2 py-1 rounded-full"
                style={{ background: theme.accent, color: theme.from }}>
                {selectedList.length} حالة مختارة
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Step tabs */}
        <div className="flex border-b border-border flex-shrink-0">
          {[
            { id: "filter", label: "تصفية واختيار الحالات" },
            { id: "kit",    label: "معاينة الطاقم التسويقي" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setStep(tab.id)}
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2",
                step === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* ── STEP 1: Filter & Select ── */}
          {step === "filter" && (
            <div className="p-5 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="البحث بالاسم أو المدينة أو نوع الحالة…" className="pr-10"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              {/* Filters grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />المدينة</Label>
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{cities.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3" />الأولوية</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{["الكل","عاجل","مرتفع","متوسط","منخفض"].map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />الفئة العمرية</Label>
                  <Select value={filterAge} onValueChange={setFilterAge}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{["الكل","أقل من 18","18-40","41-60","أكثر من 60"].map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="w-3 h-3" />المنظمة</Label>
                  <Select value={filterNgo} onValueChange={setFilterNgo}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{ngos.map(n => <SelectItem key={n} value={n} className="text-xs">{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              {/* Select all + count */}
              <div className="flex items-center justify-between">
                <button onClick={toggleAll} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                  {selected.size === filtered.length && filtered.length > 0
                    ? <CheckSquare className="w-4 h-4 text-primary" />
                    : <Square className="w-4 h-4" />}
                  تحديد الكل ({filtered.length})
                </button>
                {selected.size > 0 && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: theme.accent, color: theme.from }}>
                    {selected.size} محدد
                  </span>
                )}
              </div>

              {/* Cases list */}
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground">
                  لا توجد حالات مطابقة للمعايير المختارة
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(b => {
                    const p = PRIORITY_CFG[b.priority] || PRIORITY_CFG["متوسط"];
                    const PIcon = p.icon;
                    const isChecked = selected.has(b.id);
                    return (
                      <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={() => toggleSelect(b.id)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all",
                          isChecked ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/30"
                        )}>
                        <div className={cn("w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors",
                          isChecked ? "bg-primary border-primary" : "border-muted-foreground")}>
                          {isChecked && <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{b.full_name || `حالة - ${b.city}`}</span>
                            <span className={cn("text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1", p.pill)}>
                              <PIcon className="w-2.5 h-2.5" />{b.priority}
                            </span>
                            {b.case_type && <span className="text-xs text-muted-foreground">{CASE_EMOJIS[b.case_type]} {b.case_type}</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                            {b.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.city}</span>}
                            {b.age && <span>{b.age} سنة</span>}
                            {b.ngo_name && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{b.ngo_name}</span>}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Kit Preview ── */}
          {step === "kit" && (
            <div className="p-5 space-y-5">
              {selectedList.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">لم تختر أي حالة بعد.</p>
                  <Button variant="outline" size="sm" className="mt-3 cursor-pointer" onClick={() => setStep("filter")}>
                    العودة للاختيار
                  </Button>
                </div>
              ) : (
                <>
                  {/* Theme picker */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-medium">لون الطاقم:</span>
                    <div className="flex gap-2">
                      {KIT_THEMES.map(t => (
                        <button key={t.id} onClick={() => setThemeId(t.id)}
                          title={t.label}
                          className={cn("w-6 h-6 rounded-full border-2 cursor-pointer transition-transform",
                            themeId === t.id ? "scale-125 border-foreground" : "border-transparent"
                          )}
                          style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
                      ))}
                    </div>
                  </div>

                  {/* Kit header banner */}
                  <div className="rounded-2xl p-5 text-white text-right"
                    style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-6 h-6 text-white/80" />
                      <div>
                        <p className="font-bold text-lg leading-tight">منصة مُعين</p>
                        <p className="text-white/80 text-xs">المملكة العربية السعودية 🇸🇦</p>
                      </div>
                    </div>
                    <p className="text-white/90 text-sm font-medium">
                      {selectedList.length} حالة تحتاج دعمكم ومساندتكم
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      {new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>

                  {/* Cases cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedList.map((b, i) => (
                      <CaseKitCard key={b.id} b={b} theme={theme} index={i} />
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                    <p className="text-xs text-muted-foreground">❤️ ساهم في دعم هذه الحالات — منصة مُعين</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bottom action bar */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0 bg-card">
          {step === "filter" ? (
            <>
              <Button variant="outline" onClick={resetFilters} className="cursor-pointer gap-1.5 text-sm">
                <Filter className="w-3.5 h-3.5" /> إعادة الضبط
              </Button>
              <Button onClick={() => setStep("kit")} disabled={selected.size === 0}
                className="mr-auto cursor-pointer gap-2 text-sm"
                style={selected.size > 0 ? { background: theme.from } : {}}>
                <Package className="w-4 h-4" />
                معاينة الطاقم ({selected.size})
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep("filter")} className="cursor-pointer text-sm">
                ← تعديل الاختيار
              </Button>
              <Button onClick={handleShare} disabled={selectedList.length === 0}
                className="mr-auto cursor-pointer gap-2 text-sm bg-[#25D366] hover:bg-[#22c55e] text-white">
                <Share2 className="w-4 h-4" />
                مشاركة عبر واتساب
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}