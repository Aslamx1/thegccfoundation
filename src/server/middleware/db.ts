import { MiddlewareHandler } from "hono";
import { createDbClient } from "@/db";
import type { HonoEnv } from "../types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Injects a per-request Drizzle ORM instance into Hono context
 * and guarantees connection closure upon completion of the request.
 */
export const dbMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  let connectionString: string | undefined = undefined;

  try {
    const cf = getCloudflareContext();
    if (cf?.env?.HYPERDRIVE?.connectionString) {
      connectionString = cf.env.HYPERDRIVE.connectionString;
    }
  } catch {
    // Outside of Cloudflare Worker runtime (e.g. local build/test)
  }

  if (!connectionString && c.env?.HYPERDRIVE?.connectionString) {
    connectionString = c.env.HYPERDRIVE.connectionString;
  }

  if (!connectionString) {
    connectionString = process.env.DATABASE_URL;
  }

  const session = await createDbClient(connectionString);
  c.set("db", session.db);

  try {
    await next();
  } finally {
    await session.close();
  }
};
