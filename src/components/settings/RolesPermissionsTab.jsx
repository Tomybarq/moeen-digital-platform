import { useState, useEffect } from "react";
import UserService from "@/services/UserService";
import { useAuth } from "@/lib/AuthContext";
import { ROLE_LABELS, ROLES, getRoleColor } from "@/lib/rbac";
import RoleBadge from "@/components/auth/RoleBadge";
import PermissionsMatrix from "@/components/settings/PermissionsMatrix";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Search, UserPlus, Mail, Shield, MoreHorizontal, UserCheck, UserX,
  Loader2, CheckCircle2, AlertTriangle, Users,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function RolesPermissionsTab() {
  const { user: me } = useAuth();
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole]   = useState(ROLES.SOCIAL_RESEARCHER);
  const [inviting, setInviting]       = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteDone, setInviteDone]   = useState(false);
  const [updatingId, setUpdatingId]   = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } finally { setLoading(false); }
  };

  const handleRoleChange = async (uid, newRole) => {
    setUpdatingId(uid);
    try {
      await UserService.update(uid, { role: newRole });
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u));
    } finally { setUpdatingId(null); }
  };

  const handleToggleActive = async (uid, current) => {
    setUpdatingId(uid);
    try {
      await UserService.update(uid, { is_active: !current });
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, is_active: !current } : u));
    } finally { setUpdatingId(null); }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError(""); setInviting(true);
    try {
      await UserService.inviteUser(inviteEmail, inviteRole === ROLES.PLATFORM_ADMIN ? "admin" : "user");
      setInviteDone(true);
    } catch (err) {
      setInviteError(err.message || "فشل إرسال الدعوة");
    } finally { setInviting(false); }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Stats
  const roleCounts = Object.keys(ROLE_LABELS).reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <div key={role} className={cn("rounded-xl border p-3 text-center space-y-1", getRoleColor(role))}>
            <p className="text-2xl font-bold">{roleCounts[role] || 0}</p>
            <p className="text-xs font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> مستخدمو المنصة
              </CardTitle>
              <CardDescription>{users.length} مستخدم مسجّل</CardDescription>
            </div>
            <Button size="sm" className="cursor-pointer gap-2"
              onClick={() => { setInviteOpen(true); setInviteDone(false); setInviteError(""); setInviteEmail(""); }}>
              <UserPlus className="w-4 h-4" /> دعوة مستخدم
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-4 space-y-3">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="البحث بالاسم أو البريد…" value={search}
                onChange={e => setSearch(e.target.value)} className="pr-10 h-9" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-44 h-9">
                <SelectValue placeholder="كل الأدوار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأدوار</SelectItem>
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-14">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">لا توجد نتائج</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-semibold text-right">المستخدم</TableHead>
                    <TableHead className="font-semibold text-right">الدور</TableHead>
                    <TableHead className="font-semibold text-right hidden sm:table-cell">المنظمة</TableHead>
                    <TableHead className="font-semibold text-right">الحالة</TableHead>
                    <TableHead className="font-semibold text-right hidden md:table-cell">الانضمام</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u, i) => (
                    <motion.tr key={u.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border hover:bg-muted/20 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {u.full_name?.[0] || u.email?.[0]?.toUpperCase() || "؟"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{u.full_name || "—"}</p>
                            <p className="text-xs text-muted-foreground truncate" dir="ltr">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {updatingId === u.id
                          ? <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          : u.role ? <RoleBadge role={u.role} size="sm" /> : <span className="text-muted-foreground text-xs">—</span>
                        }
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">{u.organization || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline"
                          className={u.is_active !== false
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"}>
                          {u.is_active !== false ? "نشط" : "موقوف"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {u.created_date ? new Date(u.created_date).toLocaleDateString("ar-SA") : "—"}
                      </TableCell>
                      <TableCell>
                        {u.id !== me?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="cursor-pointer w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" dir="rtl" className="w-52">
                              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">تغيير الدور</p>
                              {Object.entries(ROLE_LABELS).map(([k, v]) => (
                                <DropdownMenuItem key={k} onClick={() => handleRoleChange(u.id, k)}
                                  className={cn("cursor-pointer gap-2", u.role === k && "font-bold text-primary")}>
                                  <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                                  {v}
                                  {u.role === k && <CheckCircle2 className="w-3.5 h-3.5 mr-auto text-primary" />}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleActive(u.id, u.is_active)}
                                className={cn("cursor-pointer gap-2",
                                  u.is_active !== false ? "text-destructive focus:text-destructive" : "text-emerald-600")}>
                                {u.is_active !== false
                                  ? <><UserX className="w-3.5 h-3.5" />تعطيل الحساب</>
                                  : <><UserCheck className="w-3.5 h-3.5" />تفعيل الحساب</>}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role permissions matrix */}
      <PermissionsMatrix />

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <UserPlus className="w-4 h-4 text-primary" /> دعوة مستخدم جديد
            </DialogTitle>
            <DialogDescription>سيتلقى المستخدم بريداً إلكترونياً للانضمام إلى المنصة</DialogDescription>
          </DialogHeader>
          {inviteDone ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold mb-1">تم إرسال الدعوة بنجاح</p>
              <p className="text-sm text-muted-foreground">سيتلقى {inviteEmail} رابط الانضمام قريباً.</p>
              <Button className="mt-5 w-full cursor-pointer" onClick={() => setInviteOpen(false)}>إغلاق</Button>
            </div>
          ) : (
            <form onSubmit={handleInvite} className="space-y-4 py-2">
              {inviteError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />{inviteError}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="inv-email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input id="inv-email" type="email" autoFocus required placeholder="user@example.com"
                    value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    className="pr-10 h-11 text-left" dir="ltr" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>الدور المُعيَّن</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="h-11 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="gap-2 pt-2">
                <Button variant="outline" type="button" onClick={() => setInviteOpen(false)} className="cursor-pointer">إلغاء</Button>
                <Button type="submit" disabled={inviting} className="cursor-pointer gap-2">
                  {inviting ? <><Loader2 className="w-4 h-4 animate-spin" />جاري…</> : <><Mail className="w-4 h-4" />إرسال الدعوة</>}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}