import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, sql, count } from "drizzle-orm";
import { campaigns, users, reports, payoutRequests, donations } from "@/db/schema";
import { requireAdmin } from "../middleware/auth";
import type { HonoEnv } from "../types";

export const adminRoute = new Hono<HonoEnv>()
  // Require administrative authorization on all admin routes
  .use("*", requireAdmin)

  // ---------------------------------------------------------------------------
  // 1. Platform Moderation Overview Stats
  // ---------------------------------------------------------------------------
  .get("/stats", async (c) => {
    const db = c.get("db");

    const totalCampaignsCount = await db.select({ value: count() }).from(campaigns);
    const openReportsCount = await db
      .select({ value: count() })
      .from(reports)
      .where(eq(reports.status, "open"));
    const pendingPayoutsCount = await db
      .select({ value: count() })
      .from(payoutRequests)
      .where(eq(payoutRequests.status, "pending"));

    const donationTotals = await db
      .select({
        totalRaised: sql<number>`coalesce(sum(${donations.amount}), 0)`,
        totalTips: sql<number>`coalesce(sum(${donations.tipAmount}), 0)`,
        donationCount: count(),
      })
      .from(donations)
      .where(eq(donations.paymentStatus, "succeeded"));

    return c.json({
      campaignsCount: totalCampaignsCount[0]?.value ?? 0,
      openReportsCount: openReportsCount[0]?.value ?? 0,
      pendingPayoutsCount: pendingPayoutsCount[0]?.value ?? 0,
      totalRaisedMinorUnits: Number(donationTotals[0]?.totalRaised ?? 0),
      totalTipsMinorUnits: Number(donationTotals[0]?.totalTips ?? 0),
      successfulDonationsCount: donationTotals[0]?.donationCount ?? 0,
    });
  })

  // ---------------------------------------------------------------------------
  // 2. Moderation Campaign List
  // ---------------------------------------------------------------------------
  .get("/campaigns", async (c) => {
    const db = c.get("db");

    const allCampaigns = await db
      .select({
        id: campaigns.id,
        slug: campaigns.slug,
        title: campaigns.title,
        category: campaigns.category,
        currency: campaigns.currency,
        goalAmount: campaigns.goalAmount,
        raisedAmount: campaigns.raisedAmount,
        donorCount: campaigns.donorCount,
        status: campaigns.status,
        isVerified: campaigns.isVerified,
        createdAt: campaigns.createdAt,
        organizer: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(campaigns)
      .leftJoin(users, eq(campaigns.organizerId, users.id))
      .orderBy(desc(campaigns.createdAt))
      .limit(100);

    return c.json({ campaigns: allCampaigns });
  })

  // ---------------------------------------------------------------------------
  // 3. Update Campaign Status & Verification
  // ---------------------------------------------------------------------------
  .patch(
    "/campaigns/:id/status",
    zValidator(
      "json",
      z.object({
        status: z.enum(["draft", "active", "paused", "completed"]).optional(),
        isVerified: z.boolean().optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const campaignId = c.req.param("id");
      const body = c.req.valid("json");

      const updatePayload: Partial<typeof campaigns.$inferInsert> = {};
      if (body.status !== undefined) updatePayload.status = body.status;
      if (body.isVerified !== undefined) updatePayload.isVerified = body.isVerified;

      await db
        .update(campaigns)
        .set(updatePayload)
        .where(eq(campaigns.id, campaignId));

      return c.json({ success: true, message: "Campaign moderation state updated." });
    }
  )

  // ---------------------------------------------------------------------------
  // 4. List Fraud & Abuse Reports
  // ---------------------------------------------------------------------------
  .get("/reports", async (c) => {
    const db = c.get("db");

    const reportList = await db
      .select({
        id: reports.id,
        reporterEmail: reports.reporterEmail,
        reason: reports.reason,
        details: reports.details,
        status: reports.status,
        createdAt: reports.createdAt,
        campaign: {
          id: campaigns.id,
          slug: campaigns.slug,
          title: campaigns.title,
          status: campaigns.status,
        },
      })
      .from(reports)
      .leftJoin(campaigns, eq(reports.campaignId, campaigns.id))
      .orderBy(desc(reports.createdAt))
      .limit(100);

    return c.json({ reports: reportList });
  })

  // ---------------------------------------------------------------------------
  // 5. Resolve Fraud Report
  // ---------------------------------------------------------------------------
  .patch(
    "/reports/:id/resolve",
    zValidator(
      "json",
      z.object({
        status: z.enum(["open", "resolved"]).default("resolved"),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const reportId = c.req.param("id");
      const { status } = c.req.valid("json");

      await db
        .update(reports)
        .set({ status })
        .where(eq(reports.id, reportId));

      return c.json({ success: true, message: "Report resolution updated." });
    }
  )

  // ---------------------------------------------------------------------------
  // 6. List Payout Requests
  // ---------------------------------------------------------------------------
  .get("/payouts", async (c) => {
    const db = c.get("db");

    const payouts = await db
      .select({
        id: payoutRequests.id,
        amount: payoutRequests.amount,
        bankDetailsEncrypted: payoutRequests.bankDetailsEncrypted,
        status: payoutRequests.status,
        createdAt: payoutRequests.createdAt,
        campaign: {
          id: campaigns.id,
          title: campaigns.title,
          currency: campaigns.currency,
          raisedAmount: campaigns.raisedAmount,
        },
        organizer: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(payoutRequests)
      .leftJoin(campaigns, eq(payoutRequests.campaignId, campaigns.id))
      .leftJoin(users, eq(payoutRequests.organizerId, users.id))
      .orderBy(desc(payoutRequests.createdAt))
      .limit(100);

    return c.json({ payouts });
  })

  // ---------------------------------------------------------------------------
  // 7. Process / Update Payout Request
  // ---------------------------------------------------------------------------
  .patch(
    "/payouts/:id/status",
    zValidator(
      "json",
      z.object({
        status: z.enum(["pending", "approved", "paid", "rejected"]),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const payoutId = c.req.param("id");
      const { status } = c.req.valid("json");

      await db
        .update(payoutRequests)
        .set({ status })
        .where(eq(payoutRequests.id, payoutId));

      return c.json({ success: true, message: `Payout request marked as ${status}.` });
    }
  );
