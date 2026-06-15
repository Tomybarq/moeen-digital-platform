import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CASE_TYPES = ["مادي", "صحي", "تعليمي", "اجتماعي", "متعدد"];
const PRIORITIES = ["عاجل", "مرتفع", "متوسط", "منخفض"];
const STATUSES = ["active", "archived", "supported"];

export default function ReportFilters({ filters, onChange, onReset }) {
  const update = (key, value) => {
    onChange({ ...filters, [key]: value || null });
  };

  const hasFilters = filters.city || filters.case_type || filters.priority || filters.status || filters.date_from || filters.date_to;

  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">تصفية النتائج</span>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="text-xs h-7 mr-auto" onClick={onReset}>
              <RotateCcw className="w-3 h-3 ml-1" />
              إعادة تعيين
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">المدينة</Label>
            <Input
              placeholder="مثال: الرياض"
              value={filters.city || ""}
              onChange={(e) => update("city", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">نوع الحالة</Label>
            <Select value={filters.case_type || ""} onValueChange={(v) => update("case_type", v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>الكل</SelectItem>
                {CASE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">الأولوية</Label>
            <Select value={filters.priority || ""} onValueChange={(v) => update("priority", v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>الكل</SelectItem>
                {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">الحالة</Label>
            <Select value={filters.status || ""} onValueChange={(v) => update("status", v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>الكل</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="archived">مؤرشفة</SelectItem>
                <SelectItem value="supported">مدعوم</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">من تاريخ</Label>
            <Input
              type="date"
              value={filters.date_from || ""}
              onChange={(e) => update("date_from", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">إلى تاريخ</Label>
            <Input
              type="date"
              value={filters.date_to || ""}
              onChange={(e) => update("date_to", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}