import { MiddlewareHandler } from "hono";
import { createDbClient } from "@/db";
import type { HonoEnv } from "../types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Injects a per-request Drizzle ORM instance into Hono context when a PostgreSQL
 * connection string is configured, and guarantees connection closure upon completion.
 */
export const dbMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  let connectionString: string | undefined = undefined;

  try {
    const cf = getCloudflareContext();
    const env = cf?.env as Record<string, any> | undefined;
    if (env?.HYPERDRIVE?.connectionString) {
      connectionString = env.HYPERDRIVE.connectionString;
    } else if (typeof env?.DATABASE_URL === "string" && env.DATABASE_URL) {
      connectionString = env.DATABASE_URL;
    }
  } catch {
    // Outside of Cloudflare Worker runtime (e.g. local build/test)
  }

  const cEnv = c.env as Record<string, any> | undefined;
  if (!connectionString && cEnv?.HYPERDRIVE?.connectionString) {
    connectionString = cEnv.HYPERDRIVE.connectionString;
  }

  if (!connectionString) {
    connectionString = process.env.DATABASE_URL;
  }

  if (!connectionString) {
    await next();
    return;
  }

  try {
    const session = await createDbClient(connectionString);
    c.set("db", session.db);
    try {
      await next();
    } finally {
      await session.close();
    }
  } catch (err) {
    console.warn("Database connection unavailable, proceeding with edge KV fallback:", err);
    await next();
  }
};
