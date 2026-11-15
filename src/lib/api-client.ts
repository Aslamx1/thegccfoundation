import { hc } from "hono/client";
import type { AppType } from "@/server/app";

/**
 * Returns origin dynamically for browser environments,
 * or configured public application URL for server-side invocations.
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Type-safe Hono RPC client.
 * Provides end-to-end type safety for requests, responses, query params, and route paths.
 */
export const client = hc<AppType>(getBaseUrl());

export type { AppType };
