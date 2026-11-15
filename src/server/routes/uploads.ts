import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const uploadsRoute = new Hono<HonoEnv>()
  // ---------------------------------------------------------------------------
  // 1. Authorize Upload / Generate Cloudflare R2 Key
  // ---------------------------------------------------------------------------
  .post(
    "/authorize",
    zValidator(
      "json",
      z.object({
        filename: z.string().min(1),
        fileType: z.string().refine((type) => ALLOWED_MIME_TYPES.includes(type), {
          message: "Unsupported file format. Please upload JPEG, PNG, WEBP, or PDF.",
        }),
        fileSize: z.number().max(MAX_FILE_SIZE, "Maximum file size is 10MB"),
      })
    ),
    async (c) => {
      const { filename, fileType, fileSize } = c.req.valid("json");
      const extension = filename.split(".").pop()?.toLowerCase() || "jpg";
      const fileKey = `campaigns/${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const publicDomain =
        process.env.NEXT_PUBLIC_MEDIA_URL || "https://media.thegccfoundation.org";
      const publicUrl = `${publicDomain}/${fileKey}`;

      return c.json({
        fileKey,
        uploadEndpoint: `/api/uploads/direct?key=${encodeURIComponent(fileKey)}`,
        publicUrl,
        maxBytes: MAX_FILE_SIZE,
      });
    }
  )

  // ---------------------------------------------------------------------------
  // 2. Direct Cloudflare R2 Upload Stream
  // ---------------------------------------------------------------------------
  .post("/direct", async (c) => {
    try {
      const key = c.req.query("key") || `campaigns/${Date.now()}-${crypto.randomUUID()}.jpg`;
      const formData = await c.req.parseBody();
      const file = formData["file"];

      if (!file || !(file instanceof File)) {
        return c.json({ error: "Missing or invalid file in form-data payload." }, 400);
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return c.json({ error: "Invalid file type. Allowed: JPEG, PNG, WEBP, PDF." }, 400);
      }

      if (file.size > MAX_FILE_SIZE) {
        return c.json({ error: "File exceeds 10MB limit." }, 400);
      }

      let bucket: R2Bucket | undefined = undefined;

      try {
        const cf = getCloudflareContext();
        if (cf?.env?.MEDIA_BUCKET) {
          bucket = cf.env.MEDIA_BUCKET;
        }
      } catch {
        // Outside worker runtime
      }

      if (!bucket && c.env?.MEDIA_BUCKET) {
        bucket = c.env.MEDIA_BUCKET;
      }

      const fileBuffer = await file.arrayBuffer();

      if (bucket) {
        await bucket.put(key, fileBuffer, {
          httpMetadata: {
            contentType: file.type,
            cacheControl: "public, max-age=31536000, immutable",
          },
        });
      }

      const publicDomain =
        process.env.NEXT_PUBLIC_MEDIA_URL || "https://media.thegccfoundation.org";
      const publicUrl = bucket
        ? `${publicDomain}/${key}`
        : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop";

      return c.json({
        success: true,
        key,
        url: publicUrl,
        size: file.size,
        contentType: file.type,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload processing failed";
      return c.json({ error: message }, 500);
    }
  });
