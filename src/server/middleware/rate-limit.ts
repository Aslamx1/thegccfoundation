import { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types";

interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitBucket>();

// Periodically clean expired buckets in memory to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of memoryStore.entries()) {
      if (now > bucket.resetTime) {
        memoryStore.delete(key);
      }
    }
  }, 60000);
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  name: string;
}

/**
 * High-performance edge rate limiter middleware.
 * Uses client IP tracking with sliding window expiration.
 */
export function createRateLimiter(options: RateLimitOptions): MiddlewareHandler<HonoEnv> {
  const { windowMs, max, name } = options;

  return async (c, next) => {
    const ip =
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "127.0.0.1";

    const key = `ratelimit:${name}:${ip}`;
    const now = Date.now();

    let bucket = memoryStore.get(key);
    if (!bucket || now > bucket.resetTime) {
      bucket = {
        count: 1,
        resetTime: now + windowMs,
      };
      memoryStore.set(key, bucket);
    } else {
      bucket.count += 1;
    }

    const remaining = Math.max(0, max - bucket.count);
    const retryAfter = Math.ceil((bucket.resetTime - now) / 1000);

    c.header("X-RateLimit-Limit", String(max));
    c.header("X-RateLimit-Remaining", String(remaining));
    c.header("X-RateLimit-Reset", String(Math.ceil(bucket.resetTime / 1000)));

    if (bucket.count > max) {
      c.header("Retry-After", String(retryAfter));
      return c.json(
        {
          success: false,
          error: "Too Many Requests",
          message: `Too many requests to ${name}. Please slow down and try again in ${retryAfter} seconds.`,
          retryAfter,
        },
        429
      );
    }

    await next();
  };
}

// -----------------------------------------------------------------------------
// Preconfigured Limiters Matching Exact Security Specification
// -----------------------------------------------------------------------------

// 1. Auth endpoints: 10 requests / minute
export const authRateLimiter = createRateLimiter({
  name: "auth",
  windowMs: 60 * 1000,
  max: 10,
});

// 2. Chat / Assistant endpoint: 10 requests / minute
export const chatRateLimiter = createRateLimiter({
  name: "chat",
  windowMs: 60 * 1000,
  max: 10,
});

// 3. Messages / Letters endpoint: 30 requests / 30 seconds
export const messagesRateLimiter = createRateLimiter({
  name: "messages",
  windowMs: 30 * 1000,
  max: 30,
});

// 4. Upload endpoints: 5 requests / minute
export const uploadRateLimiter = createRateLimiter({
  name: "uploads",
  windowMs: 60 * 1000,
  max: 5,
});

// 5. General fallback: 100 requests / minute
export const generalApiLimiter = createRateLimiter({
  name: "api",
  windowMs: 60 * 1000,
  max: 100,
});
