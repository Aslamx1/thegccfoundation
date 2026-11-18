import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, ilike, and, sql } from "drizzle-orm";
import { campaigns, users, campaignUpdates, donations, reports } from "@/db/schema";
import { generateSlug } from "../utils/slugify";
import type { HonoEnv } from "../types";

export const campaignsRoute = new Hono<HonoEnv>()
  // ---------------------------------------------------------------------------
  // 1. List campaigns with search, filtering, and pagination
  // ---------------------------------------------------------------------------
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        category: z.string().optional(),
        status: z.enum(["draft", "active", "paused", "completed"]).optional().default("active"),
        search: z.string().optional(),
        limit: z.coerce.number().min(1).max(50).optional().default(12),
        offset: z.coerce.number().min(0).optional().default(0),
        sort: z.enum(["trending", "recent", "popular"]).optional().default("trending"),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const { category, status, search, limit, offset, sort } = c.req.valid("query");

      const conditions = [eq(campaigns.status, status)];

      if (category && category !== "all") {
        conditions.push(eq(campaigns.category, category));
      }

      if (search && search.trim()) {
        conditions.push(ilike(campaigns.title, `%${search.trim()}%`));
      }

      let orderByClause = desc(campaigns.createdAt);
      if (sort === "trending") {
        orderByClause = desc(campaigns.donorCount);
      } else if (sort === "popular") {
        orderByClause = desc(campaigns.raisedAmount);
      }

      const results = await db
        .select({
          id: campaigns.id,
          slug: campaigns.slug,
          title: campaigns.title,
          story: campaigns.story,
          category: campaigns.category,
          country: campaigns.country,
          district: campaigns.district,
          receivingInstitution: campaigns.receivingInstitution,
          currency: campaigns.currency,
          goalAmount: campaigns.goalAmount,
          raisedAmount: campaigns.raisedAmount,
          donorCount: campaigns.donorCount,
          coverImageUrl: campaigns.coverImageUrl,
          status: campaigns.status,
          isVerified: campaigns.isVerified,
          createdAt: campaigns.createdAt,
          organizer: {
            id: users.id,
            name: users.name,
            avatarUrl: users.avatarUrl,
            isVerified: users.isVerified,
          },
        })
        .from(campaigns)
        .leftJoin(users, eq(campaigns.organizerId, users.id))
        .where(and(...conditions))
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset);

      return c.json({
        campaigns: results,
        limit,
        offset,
      });
    }
  )

  // ---------------------------------------------------------------------------
  // 2. Get Single Campaign by Slug
  // ---------------------------------------------------------------------------
  .get("/:slug", async (c) => {
    const db = c.get("db");
    const slug = c.req.param("slug");

    const campaignList = await db
      .select({
        id: campaigns.id,
        slug: campaigns.slug,
        title: campaigns.title,
        story: campaigns.story,
        category: campaigns.category,
        country: campaigns.country,
        district: campaigns.district,
        receivingInstitution: campaigns.receivingInstitution,
        currency: campaigns.currency,
        goalAmount: campaigns.goalAmount,
        raisedAmount: campaigns.raisedAmount,
        donorCount: campaigns.donorCount,
        coverImageUrl: campaigns.coverImageUrl,
        status: campaigns.status,
        isVerified: campaigns.isVerified,
        createdAt: campaigns.createdAt,
        organizer: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
          isVerified: users.isVerified,
          createdAt: users.createdAt,
        },
      })
      .from(campaigns)
      .leftJoin(users, eq(campaigns.organizerId, users.id))
      .where(eq(campaigns.slug, slug))
      .limit(1);

    if (campaignList.length === 0) {
      return c.json({ error: "Campaign not found" }, 404);
    }

    const campaign = campaignList[0];

    // Fetch latest updates
    const updates = await db
      .select()
      .from(campaignUpdates)
      .where(eq(campaignUpdates.campaignId, campaign.id))
      .orderBy(desc(campaignUpdates.createdAt))
      .limit(10);

    // Fetch recent public donations (masking anonymous donor names)
    const recentDonations = await db
      .select({
        id: donations.id,
        donorName: sql<string>`case when ${donations.isAnonymous} then 'Anonymous' else ${donations.donorName} end`,
        amount: donations.amount,
        message: donations.message,
        createdAt: donations.createdAt,
      })
      .from(donations)
      .where(and(eq(donations.campaignId, campaign.id), eq(donations.paymentStatus, "succeeded")))
      .orderBy(desc(donations.createdAt))
      .limit(10);

    // Fetch top donations for leaderboard
    const topDonations = await db
      .select({
        id: donations.id,
        donorName: sql<string>`case when ${donations.isAnonymous} then 'Anonymous' else ${donations.donorName} end`,
        amount: donations.amount,
        message: donations.message,
        createdAt: donations.createdAt,
      })
      .from(donations)
      .where(and(eq(donations.campaignId, campaign.id), eq(donations.paymentStatus, "succeeded")))
      .orderBy(desc(donations.amount))
      .limit(5);

    return c.json({
      campaign,
      updates,
      recentDonations,
      topDonations,
    });
  })

  // ---------------------------------------------------------------------------
  // 3. Create Campaign (Multi-step wizard endpoint)
  // ---------------------------------------------------------------------------
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        title: z.string().min(5, "Title must be at least 5 characters").max(255),
        story: z.string().min(20, "Story must be at least 20 characters"),
        category: z.string().min(2),
        country: z.string().min(2).max(8).default("US"),
        district: z.string().max(255).optional(),
        receivingInstitution: z.string().max(255).optional(),
        currency: z.string().min(2).max(8).default("USD"),
        goalAmount: z.number().int().positive("Goal amount must be greater than 0"), // Minor units (e.g. $5,000 = 500000)
        coverImageUrl: z.string().url("A valid cover image URL is required"),
        organizerName: z.string().min(2).optional(),
        organizerEmail: z.string().email().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const currentUser = c.get("user");
      const body = c.req.valid("json");

      let organizerId = currentUser?.id;

      // If user is guest/demo, ensure an organizer record exists
      if (!organizerId) {
        const guestEmail = body.organizerEmail || "organizer@gccfoundation.org";
        const existingUsers = await db.select().from(users).where(eq(users.email, guestEmail)).limit(1);

        if (existingUsers.length > 0) {
          organizerId = existingUsers[0].id;
        } else {
          organizerId = `usr_${crypto.randomUUID()}`;
          await db.insert(users).values({
            id: organizerId,
            name: body.organizerName || "Community Organizer",
            email: guestEmail,
            role: "user",
            isVerified: false,
          });
        }
      }

      const campaignId = `cmp_${crypto.randomUUID()}`;
      const slug = generateSlug(body.title);

      await db.insert(campaigns).values({
        id: campaignId,
        slug,
        organizerId,
        title: body.title,
        story: body.story,
        category: body.category,
        country: body.country,
        district: body.district || null,
        receivingInstitution: body.receivingInstitution || null,
        currency: body.currency,
        goalAmount: body.goalAmount,
        raisedAmount: 0,
        donorCount: 0,
        coverImageUrl: body.coverImageUrl,
        status: "active",
        isVerified: false,
      });

      return c.json(
        {
          success: true,
          id: campaignId,
          slug,
          message: "Campaign successfully published!",
        },
        201
      );
    }
  )

  // ---------------------------------------------------------------------------
  // 4. Add Campaign Update
  // ---------------------------------------------------------------------------
  .post(
    "/:id/updates",
    zValidator(
      "json",
      z.object({
        title: z.string().min(3).max(255),
        content: z.string().min(10),
        imageUrl: z.string().url().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const campaignId = c.req.param("id");
      const body = c.req.valid("json");

      // Verify campaign exists
      const existing = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
      if (existing.length === 0) {
        return c.json({ error: "Campaign not found" }, 404);
      }

      const updateId = `upd_${crypto.randomUUID()}`;
      await db.insert(campaignUpdates).values({
        id: updateId,
        campaignId,
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl || null,
      });

      return c.json({ success: true, id: updateId, message: "Update posted successfully" }, 201);
    }
  )

  // ---------------------------------------------------------------------------
  // 5. Submit Fraud / Abuse Report
  // ---------------------------------------------------------------------------
  .post(
    "/:id/report",
    zValidator(
      "json",
      z.object({
        reporterEmail: z.string().email(),
        reason: z.string().min(3).max(128),
        details: z.string().min(10).max(3000),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const campaignId = c.req.param("id");
      const body = c.req.valid("json");

      const existing = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
      if (existing.length === 0) {
        return c.json({ error: "Campaign not found" }, 404);
      }

      const reportId = `rep_${crypto.randomUUID()}`;
      await db.insert(reports).values({
        id: reportId,
        campaignId,
        reporterEmail: body.reporterEmail,
        reason: body.reason,
        details: body.details,
        status: "open",
      });

      return c.json(
        {
          success: true,
          reportId,
          message: "Thank you. Your report has been submitted to our Trust & Safety review board.",
        },
        201
      );
    }
  );
