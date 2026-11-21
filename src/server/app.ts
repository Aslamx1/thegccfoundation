import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { dbMiddleware } from "./middleware/db";
import { authMiddleware } from "./middleware/auth";
import { campaignsRoute } from "./routes/campaigns";
import { donationsRoute } from "./routes/donations";
import { uploadsRoute } from "./routes/uploads";
import { adminRoute } from "./routes/admin";
import { authRoute } from "./routes/auth";
import { propertiesRoute } from "./routes/properties";
import type { HonoEnv } from "./types";

const app = new Hono<HonoEnv>().basePath("/api");

// ---------------------------------------------------------------------------
// 1. Global Middleware Chain (CORS & Logger)
// ---------------------------------------------------------------------------
app.use("*", logger());

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
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
      if (allowedOrigins.some((allowed) => allowed === origin || allowed.includes(origin))) {
        return origin;
      }
      return origin; // Fallback to incoming origin with credentials
    },
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// Inject per-request Drizzle DB and Auth context
app.use("*", dbMiddleware);
app.use("*", authMiddleware);

// ---------------------------------------------------------------------------
// 2. Health check Route
// ---------------------------------------------------------------------------
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "GCC Real Estate & Crowdfunding API",
  });
});

// ---------------------------------------------------------------------------
// 3. Sub-Routers Mounting (Chained for RPC type inference)
// ---------------------------------------------------------------------------
const routes = app
  .route("/auth", authRoute)
  .route("/campaigns", campaignsRoute)
  .route("/donations", donationsRoute)
  .route("/uploads", uploadsRoute)
  .route("/admin", adminRoute)
  .route("/properties", propertiesRoute);

// ---------------------------------------------------------------------------
// 4. Centralized Global Error Handling
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
