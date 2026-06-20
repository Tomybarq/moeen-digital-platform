/**
 * TenantContext — Multi-Tenant Context Provider
 *
 * Manages the "active tenant" (NGO) for users who can view multiple tenants:
 * platform_admin and pdo roles. NGO-scoped users (ngo_manager, marketer,
 * researcher) are locked to their own NGO automatically.
 *
 * Usage:
 *   const { activeTenantId, tenants, setActiveTenant } = useTenant();
 */

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { coreApi } from "@/api/coreClient";

const TenantContext = createContext();

export const MULTI_TENANT_ROLES = ["platform_admin", "pdo"];

export function TenantProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [activeTenantId, setActiveTenantId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if the user can switch tenants
  const canSwitchTenant = user && MULTI_TENANT_ROLES.includes(user.role);

  // Load all tenants (active NGOs)
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setTenants([]);
      setActiveTenantId(null);
      setIsLoading(false);
      return;
    }

    const loadTenants = async () => {
      try {
        const allNgos = await coreApi.entities.NGO.list("name");
        setTenants(allNgos || []);
      } catch {
        setTenants([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTenants();
  }, [isAuthenticated, user?.id]);

  // Auto-set active tenant based on user role
  useEffect(() => {
    if (!user || tenants.length === 0) return;

    if (canSwitchTenant) {
      // For admin/PDO: default to "all tenants" (null = no filter)
      // If they previously selected one, keep it (from localStorage)
      const saved = localStorage.getItem("moeen_active_tenant");
      if (saved && saved !== "all") {
        const exists = tenants.find((t) => t.id === saved);
        if (exists) {
          setActiveTenantId(saved);
          return;
        }
      }
      setActiveTenantId(null); // null = all tenants
    } else {
      // NGO-scoped users are locked to their own NGO
      const ngoId = user.ngo_id || (user.data && user.data.ngo_id);
      setActiveTenantId(ngoId || null);
    }
  }, [user, tenants, canSwitchTenant]);

  const setActiveTenant = useCallback(
    (tenantId) => {
      setActiveTenantId(tenantId);
      if (tenantId) {
        localStorage.setItem("moeen_active_tenant", tenantId);
      } else {
        localStorage.setItem("moeen_active_tenant", "all");
      }
    },
    []
  );

  const activeTenant = activeTenantId
    ? tenants.find((t) => t.id === activeTenantId)
    : null;

  return (
    <TenantContext.Provider
      value={{
        tenants,
        activeTenantId,
        activeTenant,
        setActiveTenant,
        canSwitchTenant,
        isLoading,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}