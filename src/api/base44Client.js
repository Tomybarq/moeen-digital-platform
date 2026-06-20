/**
 * Backward-compatibility re-export — Moeen Cloud Engine.
 *
 * Required by the platform-managed AuthContext.jsx which must
 * import { base44 } from '@/api/base44Client'.
 *
 * This file now delegates to coreClient. All new code should
 * import from '@/api/coreClient' directly.
 */
export { base44 } from '@/api/coreClient';