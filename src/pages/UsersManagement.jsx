import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { ROLE_LABELS, ROLES } from "@/lib/rbac";
import RoleBadge from "@/components/auth/RoleBadge";
import UnauthorizedBanner from "@/components/auth/UnauthorizedBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Search, UserPlus, Mail, Shield, MoreHorizontal, UserCheck, UserX, Loader2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export default function UsersManagement() {
  const { user }                        = useAuth();
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [roleFilter, setRoleFilter]     = useState("all");
  const [inviteOpen, setInviteOpen]     = useState(false);
  const [inviteEmail, setInviteEmail]   = useState("");
  const [inviteRole, setInviteRole]     = useState(ROLES.SOCIAL_RESEARCHER);
  const [inviting, setInviting]         = useState(false);
  const [inviteError, setInviteError]   = useState("");
  const [inviteDone, setInviteDone]     = useState(false);

  useEffect(() => {
    if (user?.role === "platform_admin") fetchUsers();
  }, [user?.role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.User.list("-created_date", 100);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (uid, newRole) => {
    await base44.entities.User.update(uid, { role: newRole });
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u));
  };

  const handleToggleActive = async (uid, current) => {
    await base44.entities.User.update(uid, { is_active: !current });
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, is_active: !current } : u));
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError("");
    setInviting(true);
    try {
      await base44.users.inviteUser(inviteEmail, inviteRole === ROLES.PLATFORM_ADMIN ? "admin" : "user");
      setInviteDone(true);
    } catch (err) {
      setInviteError(err.message || "فشل إرسال الدعوة");
    } finally {
      setInviting(false);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (user?.role !== "platform_admin") {
    return <UnauthorizedBanner />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">إدارة المستخدمين</h2>
          <p className="text-sm text-muted-foreground mt-1">
            إجمالي المستخدمين: <span className="font-semibold text-foreground">{users.length}</span>
          </p>
        </div>
        <Button className="cursor-pointer gap-2" onClick={() => { setInviteOpen(true); setInviteDone(false); setInviteError(""); setInviteEmail(""); }}>
          <UserPlus className="w-4 h-4" />
          دعوة مستخدم
        </Button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="البحث بالاسم أو البريد…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48">
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

      {/* Table */}
      <Card className="border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">لا توجد نتائج</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">المستخدم</TableHead>
                  <TableHead className="font-semibold">الدور</TableHead>
                  <TableHead className="font-semibold">المنظمة</TableHead>
                  <TableHead className="font-semibold">الحالة</TableHead>
                  <TableHead className="font-semibold">تاريخ الانضمام</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {u.full_name?.[0] || u.email?.[0]?.toUpperCase() || "؟"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {u.full_name || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate" dir="ltr">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.role ? <RoleBadge role={u.role} size="sm" /> : <span className="text-muted-foreground text-xs">—</span>}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{u.organization || "—"}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={u.is_active !== false
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                          : "bg-red-500/10 text-red-600 border-red-300"}
                      >
                        {u.is_active !== false ? "نشط" : "موقوف"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {u.created_date ? new Date(u.created_date).toLocaleDateString("ar-SA") : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {u.id !== user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="cursor-pointer w-8 h-8" aria-label="خيارات">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {Object.entries(ROLE_LABELS).map(([k, v]) => (
                              <DropdownMenuItem
                                key={k}
                                onClick={() => handleRoleChange(u.id, k)}
                                className={u.role === k ? "font-bold" : ""}
                              >
                                <Shield className="w-4 h-4 ml-2 text-muted-foreground" />
                                {v}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem
                              onClick={() => handleToggleActive(u.id, u.is_active)}
                              className={u.is_active !== false ? "text-destructive focus:text-destructive" : "text-emerald-600"}
                            >
                              {u.is_active !== false
                                ? <><UserX className="w-4 h-4 ml-2" />تعطيل الحساب</>
                                : <><UserCheck className="w-4 h-4 ml-2" />تفعيل الحساب</>
                              }
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
      </Card>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <UserPlus className="w-4 h-4 text-primary" />
              دعوة مستخدم جديد
            </DialogTitle>
            <DialogDescription>سيتلقى المستخدم بريداً إلكترونياً للانضمام إلى المنصة</DialogDescription>
          </DialogHeader>

          {inviteDone ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <p className="font-semibold text-foreground mb-1">تم إرسال الدعوة بنجاح</p>
              <p className="text-sm text-muted-foreground">سيتلقى {inviteEmail} رابط الانضمام قريباً.</p>
              <Button className="mt-5 w-full cursor-pointer" onClick={() => setInviteOpen(false)}>إغلاق</Button>
            </div>
          ) : (
            <form onSubmit={handleInvite} className="space-y-4 py-2">
              {inviteError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {inviteError}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="inv-email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="inv-email"
                    type="email"
                    autoFocus
                    required
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pr-10 h-11 text-left"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-role">الدور المُعيَّن</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="inv-role" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
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
                  {inviting
                    ? <><Loader2 className="w-4 h-4 animate-spin" />جاري الإرسال…</>
                    : <><Mail className="w-4 h-4" />إرسال الدعوة</>
                  }
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}