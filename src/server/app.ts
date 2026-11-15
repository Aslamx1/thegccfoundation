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
import type { HonoEnv } from "./types";

const app = new Hono<HonoEnv>().basePath("/api");

// ---------------------------------------------------------------------------
// Global Middleware Chain
// ---------------------------------------------------------------------------
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "https://thegccfoundation.org",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    credentials: true,
  })
);

// Inject per-request Drizzle DB and Auth context
app.use("*", dbMiddleware);
app.use("*", authMiddleware);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "GCC Foundation Edge Crowdfunding API",
  });
});

// ---------------------------------------------------------------------------
// Sub-Routers Mounting (Chained for RPC type inference)
// ---------------------------------------------------------------------------
const routes = app
  .route("/auth", authRoute)
  .route("/campaigns", campaignsRoute)
  .route("/donations", donationsRoute)
  .route("/uploads", uploadsRoute)
  .route("/admin", adminRoute);

// ---------------------------------------------------------------------------
// Centralized Error Handling
// ---------------------------------------------------------------------------
app.onError((err, c) => {
  console.error("API Unhandled Exception:", err);
  return c.json(
    {
      error: err.message || "An unexpected internal server error occurred.",
      code: "INTERNAL_SERVER_ERROR",
    },
    500
  );
});

app.notFound((c) => {
  return c.json({ error: "API Route Not Found" }, 404);
});

export default app;
export type AppType = typeof routes;
