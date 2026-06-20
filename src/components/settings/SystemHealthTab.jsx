import { useState, useEffect, useCallback } from "react";
import { coreApi } from "@/api/coreClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ErrorLogger } from "@/lib/errorLogger";
import {
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, Database,
  Users, Activity, Clock, Loader2, Shield, Server,
} from "lucide-react";

const STATUS = { OK: "ok", WARN: "warn", ERROR: "error", LOADING: "loading" };

function StatusDot({ status }) {
  const cfg = {
    ok:      { cls: "bg-emerald-500",  pulse: "animate-pulse" },
    warn:    { cls: "bg-amber-500",    pulse: "" },
    error:   { cls: "bg-destructive",  pulse: "" },
    loading: { cls: "bg-muted-foreground", pulse: "animate-pulse" },
  }[status] || { cls: "bg-muted", pulse: "" };
  return (
    <span className={cn("inline-block w-2.5 h-2.5 rounded-full shrink-0", cfg.cls, cfg.pulse)}
      aria-hidden="true" />
  );
}

function HealthRow({ icon: HealthIcon, label, status, value, sub }) {
  const Icon = HealthIcon;
  const iconCls = {
    ok: "text-emerald-600", warn: "text-amber-600", error: "text-destructive", loading: "text-muted-foreground",
  }[status] ?? "text-muted-foreground";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Icon className={cn("w-4 h-4", iconCls)} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm font-semibold text-foreground">{value}</span>}
        <StatusDot status={status} />
      </div>
    </div>
  );
}

export default function SystemHealthTab() {
  const [checks, setChecks] = useState({
    db: STATUS.LOADING,
    beneficiaries: STATUS.LOADING,
    ngos: STATUS.LOADING,
    marketers: STATUS.LOADING,
    users: STATUS.LOADING,
  });
  const [counts, setCounts]       = useState({});
  const [lastChecked, setLastChecked] = useState(null);
  const [checking, setChecking]   = useState(false);
  const [recentErrors, setRecentErrors] = useState([]);

  const runChecks = useCallback(async () => {
    setChecking(true);
    setChecks({ db: STATUS.LOADING, beneficiaries: STATUS.LOADING, ngos: STATUS.LOADING, marketers: STATUS.LOADING, users: STATUS.LOADING });

    const results = await Promise.allSettled([
      coreApi.entities.Beneficiary.list("-created_date", 1),
      coreApi.entities.NGO.list("-created_date", 1),
      coreApi.entities.Marketer.list("-created_date", 1),
      coreApi.entities.User.list("-created_date", 1),
    ]);

    const newChecks = { db: STATUS.OK };
    const newCounts = {};

    const names = ["beneficiaries", "ngos", "marketers", "users"];
    const fullQueries = await Promise.allSettled([
      coreApi.entities.Beneficiary.list(),
      coreApi.entities.NGO.list(),
      coreApi.entities.Marketer.list(),
      coreApi.entities.User.list(),
    ]);

    names.forEach((name, i) => {
      if (results[i].status === "fulfilled") {
        newChecks[name] = STATUS.OK;
      } else {
        newChecks[name] = STATUS.ERROR;
        newChecks.db    = STATUS.WARN;
        ErrorLogger.error(`Health check failed: ${name}`, results[i].reason);
      }
      if (fullQueries[i].status === "fulfilled") {
        newCounts[name] = fullQueries[i].value.length;
      }
    });

    setChecks(newChecks);
    setCounts(newCounts);
    setLastChecked(new Date());
    setRecentErrors(ErrorLogger.getRecentErrors());
    setChecking(false);
  }, []);

  useEffect(() => { runChecks(); }, [runChecks]);

  const overallStatus = Object.values(checks).includes(STATUS.ERROR) ? STATUS.ERROR
    : Object.values(checks).includes(STATUS.WARN) ? STATUS.WARN
    : Object.values(checks).includes(STATUS.LOADING) ? STATUS.LOADING
    : STATUS.OK;

  const overallLabel = {
    ok: "جميع الأنظمة تعمل بشكل طبيعي",
    warn: "تحذير: بعض المشكلات المكتشفة",
    error: "خطأ: بعض الأنظمة لا تستجيب",
    loading: "جاري الفحص…",
  }[overallStatus];

  const overallBadge = {
    ok: "bg-emerald-100 text-emerald-700 border-emerald-300",
    warn: "bg-amber-100 text-amber-700 border-amber-300",
    error: "bg-destructive/10 text-destructive border-destructive/30",
    loading: "bg-muted text-muted-foreground border-border",
  }[overallStatus];

  return (
    <div className="space-y-5">

      {/* Overall status banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className={cn("flex items-center justify-between gap-4 p-4 rounded-xl border", overallBadge)}>
        <div className="flex items-center gap-3">
          <StatusDot status={overallStatus} />
          <div>
            <p className="font-semibold text-sm">{overallLabel}</p>
            {lastChecked && (
              <p className="text-xs opacity-70">
                آخر فحص: {lastChecked.toLocaleTimeString("ar-SA")}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={runChecks} disabled={checking}
          className="cursor-pointer gap-2 shrink-0">
          {checking
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <RefreshCw className="w-3.5 h-3.5" />}
          فحص الآن
        </Button>
      </motion.div>

      {/* Database & Entity Connectivity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" /> قاعدة البيانات والاتصال
          </CardTitle>
          <CardDescription>حالة الاتصال بجميع كيانات البيانات</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-5 divide-y divide-border">
          <HealthRow icon={Server}   label="قاعدة البيانات الرئيسية" status={checks.db}
            sub="Moeen Cloud Engine" />
          <HealthRow icon={Users}    label="بيانات المستفيدين"  status={checks.beneficiaries}
            value={counts.beneficiaries !== undefined ? `${counts.beneficiaries} سجل` : undefined} />
          <HealthRow icon={Shield}   label="بيانات المنظمات"    status={checks.ngos}
            value={counts.ngos !== undefined ? `${counts.ngos} منظمة` : undefined} />
          <HealthRow icon={Activity} label="بيانات المسوّقين"   status={checks.marketers}
            value={counts.marketers !== undefined ? `${counts.marketers} مسوّق` : undefined} />
          <HealthRow icon={Users}    label="بيانات المستخدمين"  status={checks.users}
            value={counts.users !== undefined ? `${counts.users} مستخدم` : undefined} />
        </CardContent>
      </Card>

      {/* Data distribution */}
      {Object.keys(counts).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> توزيع البيانات
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="px-5 py-4 space-y-3">
            {[
              { label: "المستفيدون", key: "beneficiaries", max: 500, color: "bg-primary" },
              { label: "المنظمات",   key: "ngos",          max: 100, color: "bg-blue-500" },
              { label: "المسوّقون", key: "marketers",     max: 200, color: "bg-amber-500" },
              { label: "المستخدمون", key: "users",         max: 50,  color: "bg-purple-500" },
            ].map(item => {
              const count = counts[item.key] || 0;
              const pct   = Math.min(100, Math.round((count / item.max) * 100));
              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{count} / {item.max}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                      className={cn("h-full rounded-full", item.color)}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Error log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> سجل الأخطاء الأخيرة
          </CardTitle>
          <CardDescription>آخر أخطاء وقت التشغيل المرصودة في هذه الجلسة</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-5 py-4">
          {recentErrors.length === 0 ? (
            <div className="flex items-center gap-3 py-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-sm text-muted-foreground">لا توجد أخطاء مسجّلة في هذه الجلسة</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentErrors.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                    <p className="text-xs font-medium text-destructive">{e.message}</p>
                  </div>
                  {e.error_message && (
                    <p className="text-xs text-muted-foreground pr-5">{e.error_message}</p>
                  )}
                  <div className="flex items-center gap-1.5 pr-5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.timestamp).toLocaleTimeString("ar-SA")} — {e.url}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {recentErrors.length > 0 && (
            <Button variant="ghost" size="sm" className="mt-2 cursor-pointer text-xs text-muted-foreground"
              onClick={() => { ErrorLogger.clear(); setRecentErrors([]); }}>
              مسح السجل
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}