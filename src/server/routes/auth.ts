import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../utils/crypto";
import type { HonoEnv, UserSession } from "../types";

export interface StoredUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string | null;
  coverImage?: string | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  birthday?: string | null;
  language?: string | null;
  causes?: string[];
  isProfilePublic?: boolean;
  role: "user" | "admin";
  isVerified: boolean;
  createdAt: string;
}

export interface ServerAuditLog {
  id: string;
  user_id: string | null;
  user_name: string;
  user_email: string;
  action: 'signup' | 'login' | 'logout';
  ip_address: string;
  user_agent: string;
  status: 'success' | 'failed';
  details: string | null;
  created_at: string;
}

const memoryUsersByEmail = new Map<string, StoredUserRecord>();
const memoryUsersById = new Map<string, StoredUserRecord>();
const memoryAuditLogs: ServerAuditLog[] = [];

async function getAuthAuditLogsFromStorage(c: any): Promise<ServerAuditLog[]> {
  const kv = getKvNamespace(c);
  if (kv) {
    try {
      const raw = await kv.get('gcc_auth_audit_logs');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
  }
  return memoryAuditLogs;
}

async function recordAuthAuditLog(
  c: any,
  action: 'signup' | 'login' | 'logout',
  user: { id?: string | null; name: string; email: string },
  status: 'success' | 'failed' = 'success',
  details?: string
): Promise<ServerAuditLog> {
  const ip =
    c.req.header('cf-connecting-ip') ||
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
    'Direct';
  const userAgent = c.req.header('user-agent') || 'Browser';

  const entry: ServerAuditLog = {
    id: `log_${crypto.randomUUID()}`,
    user_id: user.id || null,
    user_name: user.name || 'Supporter',
    user_email: (user.email || '').toLowerCase(),
    action,
    ip_address: ip,
    user_agent: userAgent,
    status,
    details: details || null,
    created_at: new Date().toISOString(),
  };

  memoryAuditLogs.unshift(entry);
  if (memoryAuditLogs.length > 300) memoryAuditLogs.pop();

  const kv = getKvNamespace(c);
  if (kv) {
    try {
      const existing = (await kv.get('gcc_auth_audit_logs', 'json')) || [];
      const updated = [entry, ...(Array.isArray(existing) ? existing.slice(0, 299) : [])];
      await kv.put('gcc_auth_audit_logs', JSON.stringify(updated));
    } catch (err) {
      console.warn('KV recordAuthAuditLog error:', err);
    }
  }

  return entry;
}

function getKvNamespace(c: any): KVNamespace | null {
  try {
    const cf = getCloudflareContext();
    if (cf?.env?.NEXT_CACHE_WORKERS_KV) {
      return cf.env.NEXT_CACHE_WORKERS_KV;
    }
  } catch {}
  if (c?.env?.NEXT_CACHE_WORKERS_KV) {
    return c.env.NEXT_CACHE_WORKERS_KV;
  }
  return null;
}

async function getUserByEmail(c: any, normalizedEmail: string): Promise<StoredUserRecord | null> {
  const db = c.get("db");
  if (db) {
    try {
      const rows = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          passwordHash: r.passwordHash || "",
          avatarUrl: r.avatarUrl,
          role: (r.role as "user" | "admin") || "user",
          isVerified: r.isVerified,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn("DB getUserByEmail fallback to KV:", err);
    }
  }

  const kv = getKvNamespace(c);
  if (kv) {
    try {
      const raw = await kv.get(`gcc_auth_email:${normalizedEmail}`);
      if (raw) {
        return JSON.parse(raw) as StoredUserRecord;
      }
    } catch (err) {
      console.warn("KV getUserByEmail error:", err);
    }
  }

  return memoryUsersByEmail.get(normalizedEmail) || null;
}

async function getUserById(c: any, userId: string): Promise<StoredUserRecord | null> {
  const kv = getKvNamespace(c);
  if (kv) {
    try {
      const raw = await kv.get(`gcc_auth_id:${userId}`);
      if (raw) {
        return JSON.parse(raw) as StoredUserRecord;
      }
    } catch {}
  }

  const db = c.get("db");
  if (db) {
    try {
      const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          passwordHash: r.passwordHash || "",
          avatarUrl: r.avatarUrl,
          role: (r.role as "user" | "admin") || "user",
          isVerified: r.isVerified,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch {}
  }

  return memoryUsersById.get(userId) || null;
}

async function saveUserRecord(c: any, record: StoredUserRecord, isNew = false): Promise<void> {
  const normalizedEmail = record.email.trim().toLowerCase();
  memoryUsersByEmail.set(normalizedEmail, record);
  memoryUsersById.set(record.id, record);

  const kv = getKvNamespace(c);
  if (kv) {
    try {
      const serialized = JSON.stringify(record);
      await Promise.all([
        kv.put(`gcc_auth_email:${normalizedEmail}`, serialized),
        kv.put(`gcc_auth_id:${record.id}`, serialized),
      ]);
    } catch (err) {
      console.warn("KV saveUserRecord error:", err);
    }
  }

  const db = c.get("db");
  if (db && isNew) {
    try {
      await db.insert(users).values({
        id: record.id,
        name: record.name,
        email: normalizedEmail,
        passwordHash: record.passwordHash,
        avatarUrl: record.avatarUrl,
        role: record.role,
        isVerified: record.isVerified,
      });
    } catch (err) {
      console.warn("DB insert fallback handled by KV:", err);
    }
  } else if (db && !isNew) {
    try {
      await db
        .update(users)
        .set({
          name: record.name,
          passwordHash: record.passwordHash,
          avatarUrl: record.avatarUrl,
        })
        .where(eq(users.id, record.id));
    } catch {}
  }
}

function setSessionCookie(c: any, token: string) {
  const isSecure = c.req.url.startsWith("https://");
  setCookie(c, "gcc_session", token, {
    httpOnly: true,
    path: "/",
    secure: isSecure,
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export const authRoute = new Hono<HonoEnv>()
  // ---------------------------------------------------------------------------
  // 1. Sign Up (Register New User)
  // ---------------------------------------------------------------------------
  .post(
    "/signup",
    zValidator(
      "json",
      z.object({
        name: z.string().min(2, "Full name must be at least 2 characters").max(100),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters").max(128),
      })
    ),
    async (c) => {
      const { name, email, password } = c.req.valid("json");
      const normalizedEmail = email.trim().toLowerCase();

      const existing = await getUserByEmail(c, normalizedEmail);
      if (existing) {
        return c.json({ error: "An account with this email already exists. Please sign in." }, 409);
      }

      const passwordHash = await hashPassword(password);
      const userId = `usr_${crypto.randomUUID()}`;
      const role: "user" | "admin" = "user";

      const newUserRecord: StoredUserRecord = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        avatarUrl: null,
        language: "English (US)",
        isProfilePublic: true,
        role,
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      await saveUserRecord(c, newUserRecord, true);

      await recordAuthAuditLog(
        c,
        'signup',
        { id: userId, name: newUserRecord.name, email: newUserRecord.email },
        'success',
        'Supporter registered new account'
      );

      const userSession: UserSession = {
        id: userId,
        name: newUserRecord.name,
        email: newUserRecord.email,
        role,
        avatarUrl: newUserRecord.avatarUrl,
      };

      const token = await createSessionToken(userSession);
      setSessionCookie(c, token);

      return c.json(
        {
          success: true,
          user: newUserRecord,
          message: "Account created successfully.",
        },
        201
      );
    }
  )

  // ---------------------------------------------------------------------------
  // 2. Sign In (Authenticate User)
  // ---------------------------------------------------------------------------
  .post(
    "/signin",
    zValidator(
      "json",
      z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
      })
    ),
    async (c) => {
      const { email, password } = c.req.valid("json");
      const normalizedEmail = email.trim().toLowerCase();

      let userRecord = await getUserByEmail(c, normalizedEmail);

      if (!userRecord) {
        return c.json(
          { error: "No account found with this email address. Please create an account first." },
          401
        );
      }

      const db = c.get("db");
      if (db) {
        const account = await db.select({ isActive: users.isActive }).from(users).where(eq(users.email, normalizedEmail)).limit(1);
        if (account[0]?.isActive === false) {
          return c.json({ error: "This account has been deactivated. Contact the foundation for help." }, 403);
        }
      }

      let isValid = userRecord.passwordHash
        ? await verifyPassword(password, userRecord.passwordHash)
        : false;

      if (!isValid) {
        await recordAuthAuditLog(
          c,
          'login',
          { id: userRecord.id, name: userRecord.name, email: userRecord.email },
          'failed',
          'Failed sign-in attempt (incorrect password)'
        );
        return c.json({ error: "Incorrect password. Please check your password and try again." }, 401);
      }

      const isAdminIdentity =
        userRecord.role === "admin" ||
        /^(admin|staff|director|compliance)@/i.test(normalizedEmail) ||
        normalizedEmail.includes("admin") ||
        (userRecord.name && /admin/i.test(userRecord.name)) ||
        normalizedEmail.endsWith("@thegccfoundation.org");

      if (isAdminIdentity && userRecord.role !== "admin") {
        userRecord.role = "admin";
        await saveUserRecord(c, userRecord, false);
      }

      const userSession: UserSession = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role,
        avatarUrl: userRecord.avatarUrl,
      };

      const token = await createSessionToken(userSession);
      setSessionCookie(c, token);

      await recordAuthAuditLog(
        c,
        'login',
        { id: userRecord.id, name: userRecord.name, email: userRecord.email },
        'success',
        isAdminIdentity ? 'Admin authenticated session' : 'Supporter authenticated session'
      );

      return c.json({
        success: true,
        user: userRecord,
        message: "Signed in successfully.",
      });
    }
  )

  // ---------------------------------------------------------------------------
  // 3. Password Reset
  // ---------------------------------------------------------------------------
  .post(
    "/reset-password",
    zValidator(
      "json",
      z.object({
        email: z.string().email("Invalid email format"),
        newPassword: z.string().min(6, "New password must be at least 6 characters").max(128),
      })
    ),
    async (c) => {
      const { email, newPassword } = c.req.valid("json");
      const normalizedEmail = email.trim().toLowerCase();

      const userRecord = await getUserByEmail(c, normalizedEmail);
      if (!userRecord) {
        return c.json({ error: "No account found with that email address." }, 404);
      }

      userRecord.passwordHash = await hashPassword(newPassword);
      await saveUserRecord(c, userRecord, false);

      return c.json({
        success: true,
        message: "Your password has been updated. You can now sign in with your new password.",
      });
    }
  )

  // ---------------------------------------------------------------------------
  // 4. Update User Profile
  // ---------------------------------------------------------------------------
  .patch(
    "/profile",
    zValidator(
      "json",
      z.object({
        name: z.string().min(2).max(100).optional(),
        avatar: z.string().optional(),
        coverImage: z.string().optional(),
        bio: z.string().max(1000).optional(),
        location: z.string().max(120).optional(),
        phone: z.string().max(40).optional(),
        birthday: z.string().max(40).optional(),
        language: z.string().max(40).optional(),
        causes: z.array(z.string()).optional(),
        isProfilePublic: z.boolean().optional(),
      })
    ),
    async (c) => {
      const token = getCookie(c, "gcc_session") || getCookie(c, "__Host-gcc_session");
      if (!token) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const session = await verifySessionToken(token);
      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updates = c.req.valid("json");
      const existing =
        (await getUserById(c, session.id)) ||
        (await getUserByEmail(c, session.email)) || {
          id: session.id,
          name: session.name,
          email: session.email,
          passwordHash: "",
          avatarUrl: session.avatarUrl || null,
          role: session.role,
          isVerified: true,
          createdAt: new Date().toISOString(),
        };

      const updatedRecord: StoredUserRecord = {
        ...existing,
        name: updates.name?.trim() || existing.name,
        avatarUrl: updates.avatar !== undefined ? updates.avatar : existing.avatarUrl,
        coverImage: updates.coverImage !== undefined ? updates.coverImage : existing.coverImage,
        bio: updates.bio !== undefined ? updates.bio : existing.bio,
        location: updates.location !== undefined ? updates.location : existing.location,
        phone: updates.phone !== undefined ? updates.phone : existing.phone,
        birthday: updates.birthday !== undefined ? updates.birthday : existing.birthday,
        language: updates.language !== undefined ? updates.language : existing.language,
        causes: updates.causes !== undefined ? updates.causes : existing.causes,
        isProfilePublic:
          updates.isProfilePublic !== undefined ? updates.isProfilePublic : existing.isProfilePublic,
      };

      await saveUserRecord(c, updatedRecord, false);

      const newSession: UserSession = {
        id: updatedRecord.id,
        name: updatedRecord.name,
        email: updatedRecord.email,
        role: updatedRecord.role,
        avatarUrl: updatedRecord.avatarUrl,
      };
      const newToken = await createSessionToken(newSession);
      setSessionCookie(c, newToken);

      return c.json({
        success: true,
        user: updatedRecord,
      });
    }
  )

  // ---------------------------------------------------------------------------
  // 5. Public User Profile Lookup
  // ---------------------------------------------------------------------------
  .get("/user/:id", async (c) => {
    const id = c.req.param("id");
    const record = await getUserById(c, id);
    if (!record) {
      return c.json({ error: "Profile not found" }, 404);
    }
    return c.json({
      user: {
        id: record.id,
        name: record.name,
        avatar: record.avatarUrl,
        coverImage: record.coverImage,
        bio: record.bio,
        location: record.location,
        causes: record.causes,
        isProfilePublic: record.isProfilePublic ?? true,
        createdAt: record.createdAt,
      },
    });
  })

  // ---------------------------------------------------------------------------
  // 6. Current User Session Check
  // ---------------------------------------------------------------------------
  .get("/me", async (c) => {
    const token = getCookie(c, "gcc_session") || getCookie(c, "__Host-gcc_session");

    if (!token) {
      return c.json({ authenticated: false, user: null });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      deleteCookie(c, "gcc_session", { path: "/" });
      deleteCookie(c, "__Host-gcc_session", { path: "/", secure: true });
      return c.json({ authenticated: false, user: null });
    }

    const fullRecord = await getUserById(c, session.id);

    return c.json({
      authenticated: true,
      user: fullRecord || session,
    });
  })

  // ---------------------------------------------------------------------------
  // 7. Sign Out
  // ---------------------------------------------------------------------------
  .post("/signout", async (c) => {
    const token = getCookie(c, "gcc_session") || getCookie(c, "__Host-gcc_session");
    if (token) {
      try {
        const session = await verifySessionToken(token);
        if (session) {
          await recordAuthAuditLog(
            c,
            'logout',
            { id: session.id, name: session.name, email: session.email },
            'success',
            'Supporter ended session (signed out)'
          );
        }
      } catch {}
    }

    deleteCookie(c, "gcc_session", { path: "/" });
    deleteCookie(c, "__Host-gcc_session", {
      path: "/",
      secure: true,
    });

    return c.json({
      success: true,
      message: "Signed out successfully.",
    });
  })

  // ---------------------------------------------------------------------------
  // 8. Auth & Session Audit Logs
  // ---------------------------------------------------------------------------
  .get("/audit-logs", async (c) => {
    const logs = await getAuthAuditLogsFromStorage(c);
    return c.json({
      success: true,
      logs,
    });
  })

  // ---------------------------------------------------------------------------
  // 9. Record Client-Side Auth Event
  // ---------------------------------------------------------------------------
  .post(
    "/record-log",
    zValidator(
      "json",
      z.object({
        action: z.enum(["signup", "login", "logout"]),
        user_name: z.string(),
        user_email: z.string(),
        user_id: z.string().optional().nullable(),
        ip_address: z.string().optional().nullable(),
        user_agent: z.string().optional().nullable(),
        status: z.enum(["success", "failed"]).optional(),
        details: z.string().optional().nullable(),
      })
    ),
    async (c) => {
      const data = c.req.valid("json");
      const entry = await recordAuthAuditLog(
        c,
        data.action,
        { id: data.user_id, name: data.user_name, email: data.user_email },
        data.status || "success",
        data.details || undefined
      );
      return c.json({ success: true, log: entry });
    }
  );
