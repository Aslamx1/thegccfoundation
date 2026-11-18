import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { verifySessionToken } from "../utils/crypto";
import type { HonoEnv } from "../types";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Extracts and verifies authentication from the secure session cookie.
 */
export const authMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const token = getCookie(c, "gcc_session") || getCookie(c, "__Host-gcc_session");

  if (token) {
    const session = await verifySessionToken(token);
    if (session) {
      const db = c.get("db");
      if (db) {
        const [account] = await db.select({ role: users.role, isActive: users.isActive }).from(users).where(eq(users.id, session.id)).limit(1);
        if (account?.isActive === false) {
          await next();
          return;
        }
        if (account) session.role = account.role;
      }
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
