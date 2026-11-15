import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../utils/crypto";
import type { HonoEnv, UserSession } from "../types";

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
      const db = c.get("db");
      const { name, email, password } = c.req.valid("json");
      const normalizedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (existing.length > 0) {
        return c.json({ error: "An account with this email already exists." }, 409);
      }

      // Hash password securely with PBKDF2
      const passwordHash = await hashPassword(password);
      const userId = `usr_${crypto.randomUUID()}`;

      // Public signup must never grant privileged roles.
      const role: "user" = "user";

      const newUserValues = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80`,
        role,
        isVerified: false,
      };

      await db.insert(users).values(newUserValues);

      const userSession: UserSession = {
        id: userId,
        name: newUserValues.name,
        email: newUserValues.email,
        role,
        avatarUrl: newUserValues.avatarUrl,
      };

      const token = await createSessionToken(userSession);

      // Set secure HTTP-only cookie
      setCookie(c, "__Host-gcc_session", token, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "Lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return c.json({
        success: true,
        user: userSession,
        message: "Account created successfully.",
      }, 201);
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
      const db = c.get("db");
      const { email, password } = c.req.valid("json");
      const normalizedEmail = email.trim().toLowerCase();

      // Look up user in database
      const records = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      const userRecord = records[0];

      if (!userRecord) {
        return c.json({ error: "Invalid email or password." }, 401);
      }

      // Verify password
      const isValid = userRecord.passwordHash
        ? await verifyPassword(password, userRecord.passwordHash)
        : false;

      if (!isValid) {
        return c.json({ error: "Invalid email or password." }, 401);
      }

      const userSession: UserSession = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role as "user" | "admin",
        avatarUrl: userRecord.avatarUrl,
      };

      const token = await createSessionToken(userSession);

      // Set secure HTTP-only cookie
      setCookie(c, "__Host-gcc_session", token, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "Lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json({
        success: true,
        user: userSession,
        message: "Signed in successfully.",
      });
    }
  )

  // ---------------------------------------------------------------------------
  // 3. Current User Session Check
  // ---------------------------------------------------------------------------
  .get("/me", async (c) => {
    // 1. Check HTTP-only cookie
    let token = getCookie(c, "__Host-gcc_session");

    if (!token) {
      return c.json({ authenticated: false, user: null });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      deleteCookie(c, "__Host-gcc_session", { path: "/", secure: true });
      return c.json({ authenticated: false, user: null });
    }

    return c.json({
      authenticated: true,
      user: session,
    });
  })

  // ---------------------------------------------------------------------------
  // 4. Sign Out
  // ---------------------------------------------------------------------------
  .post("/signout", async (c) => {
    deleteCookie(c, "__Host-gcc_session", {
      path: "/",
      secure: true,
    });

    return c.json({
      success: true,
      message: "Signed out successfully.",
    });
  });
