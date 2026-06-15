/**
 * Platform Data Configuration — Mo'een Digital Platform
 *
 * Controls which data provider is used across the entire frontend.
 * All data access goes through the adapter layer, so swapping providers
 * requires changing ONLY this file + registering the adapter.
 *
 * Supported values:
 *   "base44"  — Base44 Backend (current, production)
 *   "mock"    — Local in-memory JSON (MVP/demo)
 *   "supabase" — Supabase PostgreSQL (future)
 *   "firebase" — Firebase Firestore (future)
 *   "api"     — Generic REST API (future)
 */
export const DATA_PROVIDER = "base44";

/** Simulated API latency range (ms) — applied by every service method */
export const LATENCY_MIN = 300;
export const LATENCY_MAX = 700;

/** Helper: returns a promise that resolves after a random delay in [LATENCY_MIN, LATENCY_MAX] */
export const simulateLatency = () => {
  const ms = LATENCY_MIN + Math.random() * (LATENCY_MAX - LATENCY_MIN);
  return new Promise((r) => setTimeout(r, ms));
};