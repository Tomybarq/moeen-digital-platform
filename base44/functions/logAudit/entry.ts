/**
 * logAudit — Immutable Audit Log Writer
 *
 * Creates an audit log entry in the AuditLog entity.
 * This function is the single writer for all audit events across the platform.
 *
 * Called by:
 *   - Entity automations (on NGO/Beneficiary/Marketer CRUD)
 *     → receives { event: {type, entity_name, entity_id}, data, old_data, changed_fields }
 *   - Frontend (for LOGIN_SUCCESS, LOGIN_FAILURE, ROLE_CHANGE, BULK_EXPORT, etc.)
 *     → receives flat payload with event_type, resource_type, etc.
 *
 * Security:
 *   - All callers must be authenticated.
 *   - The AuditLog RLS prevents update/delete — entries are immutable.
 */

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

const SENSITIVE_FIELDS = [
  "national_id", "phone", "phone_alt", "email",
  "password", "token", "secret", "api_key",
];

/** Map entity automation event type to audit event type */
function mapEventType(type) {
  const map = {
    create: "CREATE",
    update: "UPDATE",
    delete: "DELETE",
  };
  return map[type] || type?.toUpperCase() || "UNKNOWN";
}

/** Extract a human-readable label from entity data */
function extractLabel(resourceType, data) {
  if (!data) return null;
  switch (resourceType) {
    case "NGO":
      return data.name || null;
    case "Beneficiary":
      return data.full_name || null;
    case "Marketer":
      return data.full_name || null;
    case "User":
      return data.full_name || data.email || null;
    default:
      return null;
  }
}

/** Build details JSON for entity automation events (change diff) */
function buildEntityDetails(oldData, data, changedFields) {
  if (!changedFields || changedFields.length === 0) return null;

  const diff = { changed_fields: changedFields };

  for (const field of changedFields) {
    if (SENSITIVE_FIELDS.includes(field)) {
      diff[field] = {
        action: `updated_${field}`,
        before: "[REDACTED]",
        after: "[REDACTED]",
      };
    } else {
      diff[field] = {
        before: oldData?.[field] ?? null,
        after: data?.[field] ?? null,
      };
    }
  }

  return JSON.stringify(diff);
}

function sanitiseDetails(detailsStr) {
  if (!detailsStr) return null;
  try {
    const obj = typeof detailsStr === "string" ? JSON.parse(detailsStr) : detailsStr;
    const sanitised = {};

    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_FIELDS.includes(key)) {
        sanitised[key] = `[REDACTED — ${key}]`;
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        const nested = {};
        for (const [nk, nv] of Object.entries(value)) {
          if (SENSITIVE_FIELDS.includes(nk)) {
            nested[nk] = `[REDACTED — ${nk}]`;
          } else {
            nested[nk] = nv;
          }
        }
        sanitised[key] = nested;
      } else {
        sanitised[key] = value;
      }
    }

    return JSON.stringify(sanitised);
  } catch {
    return detailsStr;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      payload = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // ── Detect call source ──────────────────────────────────────────
    const isEntityAutomation = !!(payload.event && payload.event.entity_name);

    let event_type, resource_type, resource_id, resource_label, associationId, details;

    if (isEntityAutomation) {
      // Entity automation format
      const { event, data, old_data, changed_fields } = payload;

      event_type = mapEventType(event.type);
      resource_type = event.entity_name;
      resource_id = event.entity_id || null;
      resource_label = extractLabel(resource_type, data);
      associationId = data?.ngo_id || null;
      details = buildEntityDetails(old_data, data, changed_fields);
    } else {
      // Direct call format
      event_type = payload.event_type;
      resource_type = payload.resource_type;
      resource_id = payload.resource_id || null;
      resource_label = payload.resource_label || null;
      associationId = payload.associationId || user.ngo_id || null;
      details = sanitiseDetails(payload.details || null);
    }

    if (!event_type || !resource_type) {
      return Response.json(
        { error: "event_type and resource_type are required" },
        { status: 400 }
      );
    }

    const entry = {
      event_type,
      user_id: payload.user_id || user.id,
      user_role: payload.user_role || user.role,
      resource_type,
      resource_id,
      resource_label,
      associationId,
      details,
      ip_address: payload.ip_address || null,
      user_agent: payload.user_agent || null,
    };

    const created = await base44.asServiceRole.entities.AuditLog.create(entry);

    return Response.json({ success: true, id: created.id });
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});