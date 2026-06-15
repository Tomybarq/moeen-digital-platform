import { ROLE_LABELS, ROLE_COLORS, PERMISSIONS, ROLES } from "@/lib/rbac";
import RoleBadge from "@/components/auth/RoleBadge";
import { ShieldCheck, Check, Minus, Layers, Eye, Plus, Pencil, Trash2, Upload, Download, Archive, Package, Wrench, UserCog, BarChart3, Building2, Users, Megaphone, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ── Resource grouping & icons ────────────────────────────────────────────────
const RESOURCE_GROUPS = {
  overview: {
    label: "عام",
    icon: Layers,
    resources: {
      dashboard: { label: "لوحة التحكم", icon: BarChart3 },
      settings: { label: "الإعدادات", icon: Settings },
    },
  },
  entities: {
    label: "الكيانات",
    icon: Building2,
    resources: {
      ngos:       { label: "المنظمات", icon: Building2 },
      beneficiaries: { label: "المستفيدون", icon: Users },
      marketers:  { label: "المسوّقون", icon: Megaphone },
    },
  },
  admin: {
    label: "الإدارة",
    icon: UserCog,
    resources: {
      users: { label: "المستخدمون", icon: Users },
    },
  },
  special: {
    label: "أدوات",
    icon: Wrench,
    resources: {
      marketing: { label: "الحملات التسويقية", icon: Package },
      researcher_workspace: { label: "مساحة الباحث", icon: Search },
    },
  },
};

const ACTION_CONFIG = {
  view:    { label: "عرض",   icon: Eye,      class: "bg-sky-50 text-sky-600 border-sky-200" },
  create:  { label: "إضافة", icon: Plus,     class: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  edit:    { label: "تعديل", icon: Pencil,   class: "bg-amber-50 text-amber-600 border-amber-200" },
  delete:  { label: "حذف",   icon: Trash2,   class: "bg-red-50 text-red-600 border-red-200" },
  import:  { label: "استيراد", icon: Upload, class: "bg-violet-50 text-violet-600 border-violet-200" },
  export:  { label: "تصدير",  icon: Download, class: "bg-teal-50 text-teal-600 border-teal-200" },
  archive: { label: "أرشفة",  icon: Archive, class: "bg-slate-100 text-slate-600 border-slate-200" },
};

// ── Helper: extract resource and action from permission string ────────────────
function parsePermission(perm) {
  const idx = perm.lastIndexOf(":");
  if (idx === -1) return { resource: perm, action: "view" };
  return { resource: perm.slice(0, idx), action: perm.slice(idx + 1) };
}

// ── Build the matrix data structure ───────────────────────────────────────────
function buildMatrix() {
  const roles = Object.values(ROLES);

  // Build a flat list of all unique resource+action pairs and which roles have them
  const allEntries = new Map(); // key: "resource:action" → Set of roles
  const resourceSet = new Set();

  roles.forEach(role => {
    (PERMISSIONS[role] || []).forEach(perm => {
      const { resource, action } = parsePermission(perm);
      const key = `${resource}:${action}`;
      if (!allEntries.has(key)) allEntries.set(key, new Set());
      allEntries.get(key).add(role);
      resourceSet.add(resource);
    });
  });

  return { allEntries, resourceSet, roles };
}

export default function PermissionsMatrix() {
  const { allEntries, resourceSet, roles } = buildMatrix();

  return (
    <div className="space-y-6" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">مصفوفة الصلاحيات</h3>
          <p className="text-sm text-muted-foreground">
            الصلاحيات المحددة لكل دور — بإجمالي {roles.length} أدوار و {allEntries.size} صلاحية
          </p>
        </div>
      </div>

      {/* ── Role column cards (desktop header) ── */}
      <div className="hidden lg:grid gap-3" style={{ gridTemplateColumns: `220px repeat(${roles.length}, 1fr)` }}>
        {/* Corner cell */}
        <div className="flex items-end pb-2">
          <span className="text-xs font-semibold text-muted-foreground">الصلاحية \ الدور</span>
        </div>
        {/* Role headers */}
        {roles.map(role => (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: roles.indexOf(role) * 0.05 }}
            className={cn(
              "rounded-xl border-2 p-3 text-center space-y-1.5",
              ROLE_COLORS[role],
              "bg-opacity-10"
            )}
            style={{ backgroundColor: ROLE_COLORS[role].includes("purple") ? "rgba(124,58,237,0.08)" :
                     ROLE_COLORS[role].includes("blue") ? "rgba(29,78,216,0.08)" :
                     ROLE_COLORS[role].includes("emerald") ? "rgba(5,150,105,0.08)" :
                     ROLE_COLORS[role].includes("amber") ? "rgba(217,119,6,0.08)" :
                     "rgba(225,29,72,0.08)" }}
          >
            <RoleBadge role={role} size="sm" />
            <p className="text-[11px] text-muted-foreground leading-tight">
              {(PERMISSIONS[role] || []).length} صلاحية
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Resource groups ── */}
      {Object.entries(RESOURCE_GROUPS).map(([groupKey, group]) => {
        const GroupIcon = group.icon;

        return (
          <motion.div
            key={groupKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* Group header */}
            <div className="flex items-center gap-3 px-5 py-3 bg-muted/30 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <GroupIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-foreground">{group.label}</span>
            </div>

            {/* Resource rows */}
            {Object.entries(group.resources).map(([resKey, res]) => {
              // Collect all actions for this resource across all roles
              const resActions = new Set();
              [...allEntries.keys()].forEach(key => {
                const [r, a] = key.split(":");
                if (r === resKey) resActions.add(a);
              });

              // Sort actions in a sensible order
              const actionOrder = ["view", "create", "edit", "delete", "import", "export", "archive"];
              const sortedActions = [...resActions].sort(
                (a, b) => actionOrder.indexOf(a) - actionOrder.indexOf(b)
              );

              if (sortedActions.length === 0) return null;

              const ResIcon = res.icon;

              return (
                <div key={resKey} className="border-b border-border last:border-b-0">
                  {/* Desktop: resource row label */}
                  <div className="hidden lg:grid px-5 hover:bg-muted/10 transition-colors"
                    style={{ gridTemplateColumns: `220px repeat(${roles.length}, 1fr)` }}>
                    <div className="flex items-center gap-2.5 py-3 border-l border-border">
                      <ResIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-semibold text-foreground">{res.label}</span>
                    </div>
                    {roles.map(role => {
                      const rolePerms = PERMISSIONS[role] || [];
                      const rolePermSet = new Set(rolePerms);
                      const resPerms = sortedActions.filter(a => rolePermSet.has(`${resKey}:${a}`));

                      return (
                        <div key={role} className="flex items-center gap-1 py-2 px-1.5 flex-wrap">
                          {resPerms.length > 0 ? resPerms.map(action => {
                            const cfg = ACTION_CONFIG[action] || { label: action, class: "bg-muted text-muted-foreground" };
                            return (
                              <span key={action}
                                className={cn(
                                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border",
                                  cfg.class
                                )}>
                                <cfg.icon className="w-2.5 h-2.5" />
                                {cfg.label}
                              </span>
                            );
                          }) : (
                            <Minus className="w-3.5 h-3.5 text-muted-foreground/30" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile: card-based layout */}
                  <div className="lg:hidden p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <ResIcon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">{res.label}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {roles.map(role => {
                        const rolePerms = PERMISSIONS[role] || [];
                        const rolePermSet = new Set(rolePerms);
                        const resPerms = sortedActions.filter(a => rolePermSet.has(`${resKey}:${a}`));

                        return (
                          <div key={role}
                            className={cn(
                              "rounded-lg border p-2 space-y-1.5 text-center",
                              ROLE_COLORS[role]
                            )}
                            style={{
                              backgroundColor: ROLE_COLORS[role].includes("purple") ? "rgba(124,58,237,0.06)" :
                                               ROLE_COLORS[role].includes("blue") ? "rgba(29,78,216,0.06)" :
                                               ROLE_COLORS[role].includes("emerald") ? "rgba(5,150,105,0.06)" :
                                               ROLE_COLORS[role].includes("amber") ? "rgba(217,119,6,0.06)" :
                                               "rgba(225,29,72,0.06)"
                            }}
                          >
                            <RoleBadge role={role} size="sm" />
                            <div className="flex items-center justify-center gap-1 flex-wrap">
                              {resPerms.length > 0 ? resPerms.map(action => {
                                const cfg = ACTION_CONFIG[action] || { label: action, icon: Check, class: "bg-muted border-muted" };
                                const ActionIcon = cfg.icon;
                                return (
                                  <span key={action}
                                    className={cn(
                                      "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium",
                                      cfg.class
                                    )}>
                                    <ActionIcon className="w-2 h-2" />
                                    {cfg.label}
                                  </span>
                                );
                              }) : (
                                <span className="text-[10px] text-muted-foreground/40">—</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        );
      })}

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground px-1">
        <span className="font-semibold">دليل الرموز:</span>
        {Object.entries(ACTION_CONFIG).map(([key, cfg]) => {
          const ActionIcon = cfg.icon;
          return (
            <span key={key} className="inline-flex items-center gap-1">
              <ActionIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          );
        })}
        <span className="inline-flex items-center gap-1 text-muted-foreground/40">
          <Minus className="w-3 h-3" /> غير مصرّح
        </span>
      </div>
    </div>
  );
}