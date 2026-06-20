import { createClient } from '@base44/sdk';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// ── Moeen Cloud Engine — single SDK entry point ──────────────────────
// The raw SDK is wrapped here so no component or service touches it
// directly. To swap the backend, replace the createClient call inside
// this file — the rest of the frontend stays identical.

const sdk = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl,
});

/**
 * Legacy alias — REQUIRED by platform-managed AuthContext.jsx.
 * Do NOT remove. AuthContext is locked by the platform and must
 * reference `base44` as a named export.
 */
export const base44 = sdk;

/** Generic Cloud API facade — the only SDK surface consumed by the app */
export const coreApi = {
  entities:     sdk.entities,
  auth:         sdk.auth,
  functions:    sdk.functions,
  integrations: sdk.integrations,
  users:        sdk.users,
  agents:       sdk.agents,
  analytics:    sdk.analytics,
};

/** Low-level HTTP client for platform handshake (used by AuthContext) */
export { createAxiosClient };