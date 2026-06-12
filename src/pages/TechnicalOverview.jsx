import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Layers, Database, Shield, FolderTree, Plug } from "lucide-react";

/**
 * Technical Overview — DEV-ONLY handover page for engineers.
 * Lists the tech stack, component library, project structure, and data schemas.
 * Rendered only when the app runs in development mode (import.meta.env.DEV).
 * Route: /dev/overview
 */

const STACK = [
  ["React 18", "مكتبة الواجهة"],
  ["Vite", "أداة البناء"],
  ["Tailwind CSS", "التنسيق (Design Tokens في index.css)"],
  ["shadcn/ui + Radix", "مكتبة المكوّنات"],
  ["Framer Motion", "الحركات والانتقالات"],
  ["Recharts", "الرسوم البيانية"],
  ["TanStack Query", "إدارة جلب البيانات والتخزين المؤقت"],
  ["Zod", "التحقق من صحة النماذج (lib/schemas.js)"],
  ["React Router v6", "التوجيه"],
];

const STRUCTURE = [
  ["src/pages/", "صفحات التطبيق (Route لكل صفحة في App.jsx)"],
  ["src/components/", "مكوّنات قابلة لإعادة الاستخدام مقسّمة حسب النطاق"],
  ["src/services/apiService.js", "طبقة الوصول للبيانات المركزية — نقطة ربط الـ Backend"],
  ["src/types/index.js", "تعريفات الأنواع (JSDoc) المطابقة لأعمدة SQL"],
  ["src/lib/", "rbac.js (الصلاحيات) · schemas.js (Zod) · mockData.js · AuthContext"],
  ["src/hooks/", "React Hooks مخصّصة"],
  [".env.example", "متغيرات البيئة — Firebase / SQL API"],
];

const ROLES = [
  ["platform_admin", "مدير المنصة — وصول كامل"],
  ["ngo_manager", "مدير منظمة — بيانات منظمته فقط"],
  ["researcher", "باحث ميداني — تسجيل الحالات التي أنشأها"],
  ["marketer", "مسوّق — عرض حالات منظمته للحملات"],
  ["pdo", "مسؤول حماية البيانات — قراءة وتدقيق"],
];

const SCHEMAS = [
  {
    table: "beneficiaries",
    fields: "full_name*, phone*, national_id, age, city*, case_type*, priority*, status, ngo_id (FK), researcher_name, documents[], …",
  },
  {
    table: "ngos",
    fields: "name*, responsible_person*, phone*, email*, donation_url, city, category, status",
  },
  {
    table: "marketers",
    fields: "full_name*, phone*, email, city, ngo_id (FK), ngo_name*, specialization, campaigns_count, status",
  },
];

function Section({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function KVList({ items }) {
  return (
    <div className="space-y-2">
      {items.map(([k, v]) => (
        <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
          <code className="shrink-0 px-2 py-0.5 rounded bg-muted text-foreground font-mono text-xs">{k}</code>
          <span className="text-muted-foreground">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function TechnicalOverview() {
  // Hard guard — this page must never render in production builds
  if (!import.meta.env.DEV) return null;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            النظرة التقنية — Technical Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">صفحة تسليم للمهندسين — تظهر في بيئة التطوير فقط</p>
        </div>
        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-500/10">DEV ONLY</Badge>
      </motion.div>

      <Section icon={Layers} title="Tech Stack" delay={0.05}>
        <KVList items={STACK} />
      </Section>

      <Section icon={FolderTree} title="Project Structure" delay={0.1}>
        <KVList items={STRUCTURE} />
      </Section>

      <Section icon={Shield} title="User Roles (RBAC)" delay={0.15}>
        <KVList items={ROLES} />
        <p className="text-xs text-muted-foreground mt-3">
          الصلاحيات معرّفة في <code className="bg-muted px-1 rounded">src/lib/rbac.js</code> وتُطبَّق عبر مكوّن{" "}
          <code className="bg-muted px-1 rounded">&lt;Can /&gt;</code>.
        </p>
      </Section>

      <Section icon={Database} title="Data Schemas (SQL-Ready)" delay={0.2}>
        <div className="space-y-3">
          {SCHEMAS.map((s) => (
            <div key={s.table} className="p-3 rounded-xl bg-muted/40 border border-border">
              <code className="text-sm font-bold text-primary font-mono">{s.table}</code>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-mono" dir="ltr">{s.fields}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            التعريفات الكاملة في <code className="bg-muted px-1 rounded">src/types/index.js</code> — الحقول المعلّمة بـ * إلزامية.
          </p>
        </div>
      </Section>

      <Section icon={Plug} title="Backend Integration" delay={0.25}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          جميع عمليات جلب البيانات تمرّ عبر <code className="bg-muted px-1 rounded">src/services/apiService.js</code> —
          كل دالة async موثّقة بتعليق <span className="font-mono">🔌 SWAP POINT</span> يوضّح استعلام SQL / Firebase المكافئ.
          متغيرات البيئة في <code className="bg-muted px-1 rounded">.env.example</code>.
        </p>
      </Section>
    </div>
  );
}