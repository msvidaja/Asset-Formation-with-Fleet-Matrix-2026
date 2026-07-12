// Server-side API client for the AssetFlow Spring Boot backend.
//
// This runs only in Server Components / server runtime, so the login
// credentials used to reach the auth-gated `/api/fleet` endpoint never
// reach the browser. All calls degrade gracefully: if the backend is
// unreachable (e.g. Postgres not installed yet), callers fall back to the
// static demo data in `data.ts` and the UI shows a "demo data" banner.

import { cache } from "react";
import {
  categories as mockCategories,
  fleet as mockFleet,
  kpis as mockKpis,
} from "./data";
import type { CategoryDatum, FleetStatus, FleetUnit, Kpi } from "./data";

// --- Config (server-only env, with dev-friendly defaults) ---
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8080";
// GET /api/fleet requires an authenticated user. We log in server-side with
// the seeded admin account by default; override via env in real deploys.
const API_USER = process.env.ASSETFLOW_API_USER ?? "admin";
const API_PASSWORD = process.env.ASSETFLOW_API_PASSWORD ?? "admin123";

// --- Shapes returned by the backend (see com.example.asset.dto/model) ---
type BackendStatus = "OPERATIONAL" | "MAINTENANCE" | "OFFLINE";

interface BackendFleetUnit {
  id: number;
  code: string;
  name: string;
  depot: string;
  category: string;
  status: BackendStatus;
  utilization: number;
  updatedAt: string; // ISO-8601 Instant
}

interface BackendSummary {
  kpis: { label: string; value: string; sub: string }[];
  categories: { label: string; value: number }[];
}

interface AuthResponse {
  token: string;
  username: string;
  name: string;
  role: string;
}

export interface DashboardData {
  kpis: Kpi[];
  categories: CategoryDatum[];
  fleet: FleetUnit[];
  /** false when we fell back to static demo data. */
  live: boolean;
}

// --- Helpers ---

/** Map a backend Instant into a compact "2m ago" style label. */
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diffMs = Date.now() - then;
  const sec = Math.max(0, Math.round(diffMs / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.round(hr / 24);
  return `${days}d ago`;
}

function toFleetUnit(u: BackendFleetUnit): FleetUnit {
  return {
    code: u.code,
    name: u.name,
    depot: u.depot,
    category: u.category,
    status: u.status.toLowerCase() as FleetStatus,
    utilization: u.utilization,
    updated: relativeTime(u.updatedAt),
  };
}

/**
 * Log in and return a bearer token. Memoized per-request via React.cache so a
 * single render reuses one token across the dashboard + fleet calls.
 */
const getToken = cache(async (): Promise<string> => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: API_USER, password: API_PASSWORD }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Auth failed: ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as AuthResponse;
  return body.token;
});

async function fetchSummary(): Promise<BackendSummary> {
  // permitAll — no token needed.
  const res = await fetch(`${API_BASE}/api/dashboard/summary`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Summary failed: ${res.status}`);
  return (await res.json()) as BackendSummary;
}

async function fetchFleet(): Promise<BackendFleetUnit[]> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/fleet`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Fleet failed: ${res.status}`);
  return (await res.json()) as BackendFleetUnit[];
}

/**
 * Fetch everything the dashboard needs from the backend. On any failure we
 * fall back to the static demo data so the page still renders while the
 * backend / database is being set up.
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [summary, fleet] = await Promise.all([fetchSummary(), fetchFleet()]);
    return {
      kpis: summary.kpis, // delta/trend are optional; backend omits them
      categories: summary.categories,
      fleet: fleet.map(toFleetUnit),
      live: true,
    };
  } catch (err) {
    console.warn(
      `[assetflow] backend unavailable, using demo data: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return {
      kpis: mockKpis,
      categories: mockCategories,
      fleet: mockFleet,
      live: false,
    };
  }
}
