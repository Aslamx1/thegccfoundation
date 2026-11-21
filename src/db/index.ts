import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

export * from "./schema";

export type DrizzleDb = NodePgDatabase<typeof schema>;

export interface DatabaseSession {
  db: DrizzleDb;
  client: Client;
  close: () => Promise<void>;
}

/**
 * Creates a per-request PostgreSQL client for Cloudflare Workers / Hyperdrive.
 * Hyperdrive bindings provide pooled, edge-accelerated connection strings.
 * We avoid persistent global pools to satisfy Worker lifecycle guarantees.
 */
export async function createDbClient(customConnectionString?: string): Promise<DatabaseSession> {
  const connectionString = customConnectionString || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Database is not configured. Set DATABASE_URL or bind Cloudflare Hyperdrive.");
  }

  const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

  const client = new Client({
    connectionString,
    ssl: isLocalhost
      ? false
      : {
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "false" ? false : true,
        },
    connectionTimeoutMillis: 5000,
  });

  await client.connect();

  const db = drizzle({ client, schema });

  let closed = false;
  const close = async () => {
    if (!closed) {
      closed = true;
      try {
        await client.end();
      } catch (err) {
        console.error("Failed to cleanly disconnect database client:", err);
      }
    }
  };

  return { db, client, close };
}

/**
 * Executes a callback with an isolated database session and guarantees
 * connection cleanup upon completion or error.
 */
export async function withDb<T>(
  callback: (db: DrizzleDb) => Promise<T>,
  connectionString?: string
): Promise<T> {
  const session = await createDbClient(connectionString);
  try {
    return await callback(session.db);
  } finally {
    await session.close();
  }
}
