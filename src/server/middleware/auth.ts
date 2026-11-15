import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { verifySessionToken } from "../utils/crypto";
import type { HonoEnv, UserSession } from "../types";

/**
 * Extracts and verifies authentication from the secure session cookie.
 */
export const authMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  // 1. Try session cookie
  let token = getCookie(c, "__Host-gcc_session");

  // Verify the HTTP-only session cookie. Never accept bearer demo tokens or caller-supplied identities.
  if (token) {
    const session = await verifySessionToken(token);
    if (session) {
      c.set("user", session);
    }
  }

  await next();
};

/**
 * Strict authentication guard.
 */
export const requireAuth: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized. Authentication is required to perform this action." }, 401);
  }
  await next();
};

/**
 * Strict admin role guard.
 */
export const requireAdmin: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return c.json({ error: "Forbidden. Administrative privileges are required." }, 403);
  }
  await next();
};
