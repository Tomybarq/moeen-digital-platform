/**
 * sendNotification — Create a notification for one or more users.
 *
 * Called by:
 *   - Entity automations (on key events like beneficiary status change)
 *   - Frontend (for system alerts, task assignments, etc.)
 *
 * Payload shape:
 * {
 *   user_ids: string[],        // recipients
 *   type: string,              // case_update, task_assigned, etc.
 *   title: string,
 *   message?: string,
 *   link?: string,
 *   entity_type?: string,
 *   entity_id?: string
 * }
 */

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

const VALID_TYPES = [
  "case_update", "task_assigned", "message",
  "system_alert", "import_complete", "status_change", "role_change",
];

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

    // Support both entity automation and direct call formats
    let userIds, type, title, message, link, entityType, entityId;

    if (payload.event && payload.event.entity_name) {
      // Entity automation format — construct notification from entity event
      const { event, data, old_data, changed_fields } = payload;

      // Only notify on update events with actual changes
      if (event.type !== "update" || !changed_fields || changed_fields.length === 0) {
        return Response.json({ success: true, id: null, skipped: true });
      }

      const resourceType = event.entity_name;
      type = "status_change";
      entityType = resourceType;
      entityId = event.entity_id;

      const resourceLabel = data?.full_name || data?.name || resourceType;
      const statusBefore = old_data?.status || "—";
      const statusAfter = data?.status || "—";

      title = `تحديث ${resourceType === "Beneficiary" ? "مستفيد" : resourceType === "NGO" ? "منظمة" : "سجل"} — ${resourceLabel}`;
      message = `تغيرت الحالة من "${statusBefore}" إلى "${statusAfter}"`;

      // Determine recipients based on resource type
      if (resourceType === "Beneficiary") {
        link = `/beneficiaries/detail?id=${event.entity_id}`;
        userIds = [];

        // Notify NGO manager if ngo_id exists
        if (data?.ngo_id) {
          const ngoUsers = await base44.asServiceRole.entities.User.filter(
            { role: "ngo_manager", ngo_id: data.ngo_id },
            "",
            10,
            0
          );
          userIds = ngoUsers.map(u => u.id);
        }

        // Notify creator/researcher
        if (data?.created_by_id && !userIds.includes(data.created_by_id)) {
          userIds.push(data.created_by_id);
        } else if (!data?.created_by_id) {
          userIds.push(user.id);
        }

        // Notify platform admins
        const admins = await base44.asServiceRole.entities.User.filter(
          { role: "platform_admin" }, "", 5, 0
        );
        for (const admin of admins) {
          if (!userIds.includes(admin.id)) userIds.push(admin.id);
        }
      } else {
        // Generic — notify current user + platform admins
        userIds = [user.id];
        if (resourceType === "NGO") {
          link = `/ngos`;
        }
      }
    } else {
      // Direct call format — RBAC enforcement
      // Only platform_admin can target arbitrary user_ids
      if (user.role !== "platform_admin") {
        return Response.json(
          { error: "Moeen Cloud Engine: Unauthorized Access" },
          { status: 403 }
        );
      }
      userIds = (payload.user_ids && payload.user_ids.length > 0) ? payload.user_ids : [user.id];
      type = payload.type;
      title = payload.title;
      message = payload.message || null;
      link = payload.link || null;
      entityType = payload.entity_type || null;
      entityId = payload.entity_id || null;
    }

    if (!type || !VALID_TYPES.includes(type)) {
      return Response.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!title) {
      return Response.json({ error: "title is required" }, { status: 400 });
    }

    if (!userIds || userIds.length === 0) {
      return Response.json({ success: true, id: null, skipped: true, reason: "No recipients" });
    }

    // Create notification for each recipient
    const created = [];
    for (const uid of userIds) {
      const entry = {
        user_id: uid,
        associationId: user.ngo_id || user.data?.ngo_id || null,
        type,
        title,
        message,
        link,
        entity_type: entityType,
        entity_id: entityId,
        is_read: false,
      };
      const result = await base44.asServiceRole.entities.Notification.create(entry);
      created.push(result.id);
    }

    return Response.json({ success: true, ids: created, count: created.length });
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});