import { useAuth } from "@/lib/AuthContext";
import { hasPermission, hasRole } from "@/lib/rbac";

/**
 * Conditionally renders children based on user role/permission.
 * Usage:
 *   <RoleGuard permission="beneficiaries:create"> ... </RoleGuard>
 *   <RoleGuard roles={["platform_admin", "ngo_admin"]}> ... </RoleGuard>
 *   <RoleGuard permission="settings:edit" fallback={<p>لا تملك صلاحية</p>}> ... </RoleGuard>
 */
export default function RoleGuard({ children, permission, roles, fallback = null }) {
  const { user } = useAuth();

  const permitted =
    (permission ? hasPermission(user, permission) : true) &&
    (roles ? hasRole(user, roles) : true);

  return permitted ? children : fallback;
}