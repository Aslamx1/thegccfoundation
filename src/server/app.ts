import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { dbMiddleware } from "./middleware/db";
import { authMiddleware } from "./middleware/auth";
import {
  authRateLimiter,
  messagesRateLimiter,
  uploadRateLimiter,
  generalApiLimiter,
} from "./middleware/rate-limit";
import { campaignsRoute } from "./routes/campaigns";
import { donationsRoute } from "./routes/donations";
import { uploadsRoute } from "./routes/uploads";
import { adminRoute } from "./routes/admin";
import { authRoute } from "./routes/auth";
import type { HonoEnv } from "./types";

const app = new Hono<HonoEnv>().basePath("/api");

// ---------------------------------------------------------------------------
// 1. HTTP Security Headers Middleware
// ---------------------------------------------------------------------------
app.use("*", async (c, next) => {
  await next();
  c.header("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
});

// ---------------------------------------------------------------------------
// 2. Global Logger
// ---------------------------------------------------------------------------
app.use("*", logger());

// ---------------------------------------------------------------------------
// 3. CORS Hardening (Strict Origin Validation)
// ---------------------------------------------------------------------------
const configuredOrigin = process.env.ALLOWED_ORIGIN || process.env.FRONTEND_URL;
const allowedOrigins = [
  ...(configuredOrigin ? [configuredOrigin] : []),
  process.env.NEXT_PUBLIC_APP_URL || "https://thegccfoundation.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://thegccfoundation.com",
];

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return allowedOrigins[0];
      if (allowedOrigins.some((allowed) => allowed === origin)) {
        return origin;
      }
      return null as any; // Deny unauthorized origins
    },
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// 4. Rate Limiting (Brute Force & Abuse Prevention)
// ---------------------------------------------------------------------------
app.use("/auth/*", authRateLimiter);           // 10 requests / minute
app.use("/uploads/*", uploadRateLimiter);       // 5 requests / minute
app.use("/admin/letters/*", messagesRateLimiter); // 30 requests / 30 seconds
app.use("*", generalApiLimiter);                // 100 requests / minute

// ---------------------------------------------------------------------------
// 5. Database & Authentication Middleware
// ---------------------------------------------------------------------------
app.use("*", dbMiddleware);
app.use("*", authMiddleware);

// ---------------------------------------------------------------------------
// 6. Health check Route
// ---------------------------------------------------------------------------
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "GCC Foundation Crowdfunding API",
    security: {
      rateLimiting: "active",
      sslVerification: "enforced",
      headers: "hardened",
    },
  });
});

// ---------------------------------------------------------------------------
// 7. Sub-Routers Mounting (Chained for RPC type inference)
// ---------------------------------------------------------------------------
const routes = app
  .route("/auth", authRoute)
  .route("/campaigns", campaignsRoute)
  .route("/donations", donationsRoute)
  .route("/uploads", uploadsRoute)
  .route("/admin", adminRoute);

// ---------------------------------------------------------------------------
// 8. Centralized Global Error Handling
// ---------------------------------------------------------------------------
app.onError((err, c) => {
  console.error("API Unhandled Exception:", err);
  const status = (err as any).status || 500;
  return c.json(
    {
      success: false,
      message: err.message || "An unexpected internal server error occurred.",
      code: "INTERNAL_SERVER_ERROR",
    },
    status
  );
});

app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: `API Route Not Found: ${c.req.method} ${c.req.url}`,
    },
    404
  );
});

export default app;
export type AppType = typeof routes;
