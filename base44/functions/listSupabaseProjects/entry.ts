/**
 * listSupabaseProjects — DISABLED
 *
 * This endpoint has been locked down for security.
 * Infrastructure details must not be exposed to frontend clients.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  return Response.json(
    { error: "Moeen Cloud Engine: Unauthorized Access" },
    { status: 403 }
  );
});