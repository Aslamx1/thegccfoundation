import type { DrizzleDb } from "@/db";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string | null;
}

export type HonoEnv = {
  Variables: {
    db: DrizzleDb;
    user?: UserSession;
  };
  Bindings: CloudflareEnv & {
    DATABASE_URL?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
  };
};
