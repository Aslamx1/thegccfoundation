import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, sql, count, and } from "drizzle-orm";
import { campaigns, users, reports, payoutRequests, donations, childProfiles, childLetters, fieldUpdates, campaignUpdates } from "@/db/schema";
import { requireAdmin } from "../middleware/auth";
import type { HonoEnv } from "../types";
import { generateSlug } from "../utils/slugify";

export const adminRoute = new Hono<HonoEnv>()
  // Require administrative authorization on all admin routes
  .use("*", requireAdmin)
  .use("*", async (c, next) => {
    if (!c.get("db")) return c.json({ error: "The admin database is not configured. Connect PostgreSQL before using these tools." }, 503);
    await next();
  })

  // Child directory and sponsorship assignments
  .get("/children", async (c) => {
    const db = c.get("db");
    const children = await db.select().from(childProfiles).orderBy(desc(childProfiles.createdAt));
    return c.json({ children });
  })
  .post(
    "/children",
    zValidator("json", z.object({
      name: z.string().trim().min(1).max(255), age: z.number().int().min(0).max(21),
      gender: z.enum(["Girl", "Boy"]), district: z.string().trim().min(1).max(255),
      schoolAndGrade: z.string().trim().min(1).max(255), monthlySponsorshipUSD: z.number().int().min(0),
      bio: z.string().trim().min(1), dream: z.string().trim().min(1), photoUrl: z.string().url(),
      status: z.enum(["available", "sponsored"]).default("available"),
      sponsorName: z.string().trim().max(255).optional(), sponsorEmail: z.string().email().optional(),
    }).superRefine((child, ctx) => {
      if (child.status === "sponsored" && (!child.sponsorName || !child.sponsorEmail)) {
        ctx.addIssue({ code: "custom", message: "A sponsored child must have a linked sponsor name and email." });
      }
    })),
    async (c) => {
      const db = c.get("db");
      const body = c.req.valid("json");
      const [child] = await db.insert(childProfiles).values({ ...body, id: `child_${crypto.randomUUID()}`, sponsoredSince: body.status === "sponsored" ? new Date() : null }).returning();
      return c.json({ child }, 201);
    }
  )
  .patch(
    "/children/:id",
    zValidator("json", z.object({
      name: z.string().trim().min(1).max(255).optional(), age: z.number().int().min(0).max(21).optional(),
      gender: z.enum(["Girl", "Boy"]).optional(), district: z.string().trim().min(1).max(255).optional(),
      schoolAndGrade: z.string().trim().min(1).max(255).optional(), monthlySponsorshipUSD: z.number().int().min(0).optional(),
      bio: z.string().trim().min(1).optional(), dream: z.string().trim().min(1).optional(), photoUrl: z.string().url().optional(),
      status: z.enum(["available", "sponsored"]).optional(), sponsorName: z.string().trim().max(255).nullable().optional(),
      sponsorEmail: z.string().email().nullable().optional(),
    })),
    async (c) => {
      const db = c.get("db");
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const current = await db.select().from(childProfiles).where(eq(childProfiles.id, id)).limit(1);
      if (!current.length) return c.json({ error: "Child profile not found." }, 404);
      const nextStatus = body.status ?? current[0].status;
      const nextName = body.sponsorName ?? current[0].sponsorName;
      const nextEmail = body.sponsorEmail ?? current[0].sponsorEmail;
      if (nextStatus === "sponsored" && (!nextName || !nextEmail)) return c.json({ error: "A sponsored child must have a linked sponsor name and email." }, 400);
      if (current[0].status === "sponsored" && nextStatus === "sponsored" && (nextName !== current[0].sponsorName || nextEmail !== current[0].sponsorEmail)) {
        return c.json({ error: "This child already has an active sponsor. Unlink the current sponsorship before assigning another." }, 409);
      }
      const [child] = await db.update(childProfiles).set({
        ...body, updatedAt: new Date(),
        sponsoredSince: nextStatus === "sponsored" ? current[0].sponsoredSince || new Date() : null,
        sponsorName: nextStatus === "sponsored" ? nextName : null,
        sponsorEmail: nextStatus === "sponsored" ? nextEmail : null,
      }).where(nextStatus === "sponsored" && current[0].status === "available"
        ? and(eq(childProfiles.id, id), eq(childProfiles.status, "available"))
        : eq(childProfiles.id, id)).returning();
      if (!child) return c.json({ error: "Sponsorship changed while you were editing. Reload the directory and try again." }, 409);
      return c.json({ child });
    }
  )
  .get("/letters", async (c) => {
    const db = c.get("db");
    const letters = await db.select({ id: childLetters.id, childId: childLetters.childId, childName: childProfiles.name, donorName: childLetters.donorName, donorEmail: childLetters.donorEmail, message: childLetters.message, status: childLetters.status, createdAt: childLetters.createdAt, reviewedAt: childLetters.reviewedAt })
      .from(childLetters).leftJoin(childProfiles, eq(childLetters.childId, childProfiles.id)).orderBy(desc(childLetters.createdAt));
    return c.json({ letters });
  })
  .patch(
    "/letters/:id",
    zValidator("json", z.object({ message: z.string().trim().min(1).optional(), status: z.enum(["pending", "approved", "rejected"]).optional() })),
    async (c) => {
      const db = c.get("db");
      const id = c.req.param("id");
      const body = c.req.valid("json");
      if (!body.message && !body.status) return c.json({ error: "Provide a message edit or a review decision." }, 400);
      const [letter] = await db.update(childLetters).set({ ...body, reviewedAt: body.status ? new Date() : undefined }).where(eq(childLetters.id, id)).returning();
      if (!letter) return c.json({ error: "Letter not found." }, 404);
      return c.json({ letter });
    }
  )
  .get("/field-updates", async (c) => {
    const db = c.get("db");
    const updates = await db.select().from(fieldUpdates).orderBy(desc(fieldUpdates.createdAt));
    return c.json({ updates });
  })
  .get("/updates", async (c) => {
    const db = c.get("db");
    const updates = await db.select({ id: campaignUpdates.id, campaignId: campaignUpdates.campaignId, campaignTitle: campaigns.title, title: campaignUpdates.title, content: campaignUpdates.content, category: campaignUpdates.category, authorName: campaignUpdates.authorName, imageUrl: campaignUpdates.imageUrl, createdAt: campaignUpdates.createdAt })
      .from(campaignUpdates).innerJoin(campaigns, eq(campaignUpdates.campaignId, campaigns.id)).orderBy(desc(campaignUpdates.createdAt));
    return c.json({ updates });
  })
  .post(
    "/campaigns/:id/updates",
    zValidator("json", z.object({ title: z.string().trim().min(3).max(255), content: z.string().trim().min(10), category: z.string().trim().min(1).max(128), imageUrl: z.string().url().optional() })),
    async (c) => {
      const db = c.get("db");
      const campaignId = c.req.param("id");
      const body = c.req.valid("json");
      const [campaign] = await db.select({ id: campaigns.id }).from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
      if (!campaign) return c.json({ error: "Campaign not found." }, 404);
      const [update] = await db.insert(campaignUpdates).values({ id: `upd_${crypto.randomUUID()}`, campaignId, title: body.title, content: body.content, category: body.category, authorName: c.get("user")?.name || "Foundation Staff", imageUrl: body.imageUrl || null }).returning();
      return c.json({ update }, 201);
    }
  )
  .post(
    "/field-updates",
    zValidator("json", z.object({ title: z.string().trim().min(1).max(255), documentType: z.string().min(1).max(64), targetType: z.enum(["child", "project"]), targetId: z.string().min(1), termOrPeriod: z.string().min(1).max(128), notes: z.string().max(5000).default(""), attachmentUrl: z.string().url(), fileName: z.string().min(1).max(255) })),
    async (c) => {
      const db = c.get("db");
      const body = c.req.valid("json");
      const [update] = await db.insert(fieldUpdates).values({ ...body, id: `field_${crypto.randomUUID()}`, uploadedBy: c.get("user")?.name || "Admin" }).returning();
      return c.json({ update }, 201);
    }
  )
  .get("/supporters", async (c) => {
    const db = c.get("db");
    const supporters = await db.select({
      id: users.id, name: users.name, email: users.email, phone: users.phone, location: users.location, role: users.role,
      joinedAt: users.createdAt,
      isActive: users.isActive,
      currency: campaigns.currency,
      totalDonatedMinor: sql<number>`coalesce(sum(case when ${donations.paymentStatus} = 'succeeded' then ${donations.amount} else 0 end), 0)`,
      donationsCount: sql<number>`count(case when ${donations.paymentStatus} = 'succeeded' then 1 end)`,
    }).from(users).leftJoin(donations, eq(donations.donorId, users.id)).leftJoin(campaigns, eq(donations.campaignId, campaigns.id)).groupBy(users.id, campaigns.currency).orderBy(desc(users.createdAt));
    return c.json({ supporters });
  })
  .patch(
    "/supporters/:id",
    zValidator("json", z.object({
      name: z.string().trim().min(1).max(255).optional(), email: z.string().email().optional(),
      phone: z.string().trim().max(64).nullable().optional(), location: z.string().trim().max(255).nullable().optional(),
      role: z.enum(["user", "admin"]).optional(), isActive: z.boolean().optional(),
    })),
    async (c) => {
      const db = c.get("db");
      const id = c.req.param("id");
      const body = c.req.valid("json");
      if (!body.role && body.isActive === undefined && !body.name && !body.email && body.phone === undefined && body.location === undefined) return c.json({ error: "Provide a supporter detail or account update." }, 400);
      if (id === c.get("user")?.id && (body.role === "user" || body.isActive === false)) return c.json({ error: "You cannot remove your own admin access or deactivate your account." }, 400);
      const [supporter] = await db.update(users).set(body).where(eq(users.id, id)).returning({ id: users.id, role: users.role, isActive: users.isActive });
      if (!supporter) return c.json({ error: "Supporter account not found." }, 404);
      return c.json({ supporter });
    }
  )

  .get("/transactions", async (c) => {
    const db = c.get("db");
    const rows = await db.select({
      id: donations.id, donorName: donations.donorName, donorEmail: donations.donorEmail,
      isAnonymous: donations.isAnonymous, amountMinor: donations.amount, currency: campaigns.currency,
      campaignId: campaigns.id, campaignTitle: campaigns.title, paymentProviderRef: donations.paymentProviderRef,
      createdAt: donations.createdAt, entryType: donations.entryType, paymentMethod: donations.paymentMethod,
      referenceCode: donations.referenceCode, notes: donations.notes,
    }).from(donations).innerJoin(campaigns, eq(donations.campaignId, campaigns.id))
      .where(eq(donations.paymentStatus, "succeeded")).orderBy(desc(donations.createdAt)).limit(500);
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const totals = await db.select({
      currency: campaigns.currency,
      allTimeMinor: sql<number>`coalesce(sum(${donations.amount}), 0)`,
      monthMinor: sql<number>`coalesce(sum(case when ${donations.createdAt} >= ${monthStart} then ${donations.amount} else 0 end), 0)`,
      yearMinor: sql<number>`coalesce(sum(case when ${donations.createdAt} >= ${yearStart} then ${donations.amount} else 0 end), 0)`,
      transactionCount: count(),
    }).from(donations).innerJoin(campaigns, eq(donations.campaignId, campaigns.id))
      .where(eq(donations.paymentStatus, "succeeded")).groupBy(campaigns.currency);
    return c.json({ transactions: rows, totalsByCurrency: totals });
  })
  .post(
    "/offline-donations",
    zValidator("json", z.object({
      campaignId: z.string().min(1), donorName: z.string().trim().min(1).max(255), donorEmail: z.string().email(),
      amountUGX: z.number().int().min(1).max(20_000_000),
      paymentMethod: z.enum(["Direct Bank Wire (EFT)", "Offline Cash Receipt", "Mobile Money Receipt (Manual)" ]),
      referenceCode: z.string().trim().max(255).optional(), notes: z.string().trim().max(2000).optional(),
    })),
    async (c) => {
      const db = c.get("db");
      const body = c.req.valid("json");
      const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, body.campaignId)).limit(1);
      if (!campaign) return c.json({ error: "Campaign not found." }, 404);
      if (campaign.currency !== "UGX") return c.json({ error: "Offline UGX entries require a campaign set to UGX." }, 400);
      const id = `don_${crypto.randomUUID()}`;
      const reference = `offline_${crypto.randomUUID()}`;
      const amountMinor = body.amountUGX * 100;
      await db.transaction(async (tx) => {
        await tx.insert(donations).values({
          id, campaignId: campaign.id, donorName: body.donorName, donorEmail: body.donorEmail,
          isAnonymous: false, amount: amountMinor, tipAmount: 0, message: body.notes || null,
          paymentProviderRef: reference, paymentStatus: "succeeded", entryType: "offline",
          paymentMethod: body.paymentMethod, referenceCode: body.referenceCode || null, notes: body.notes || null,
        });
        await tx.update(campaigns).set({
          raisedAmount: sql`${campaigns.raisedAmount} + ${amountMinor}`,
          donorCount: sql`${campaigns.donorCount} + 1`, updatedAt: new Date(),
        }).where(eq(campaigns.id, campaign.id));
      });
      return c.json({ success: true, receiptNumber: `GCC-${id}`, id }, 201);
    }
  )

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
        story: campaigns.story,
        category: campaigns.category,
        country: campaigns.country,
        district: campaigns.district,
        receivingInstitution: campaigns.receivingInstitution,
        currency: campaigns.currency,
        goalAmount: campaigns.goalAmount,
        raisedAmount: campaigns.raisedAmount,
        donorCount: campaigns.donorCount,
        status: campaigns.status,
        isVerified: campaigns.isVerified,
        coverImageUrl: campaigns.coverImageUrl,
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
  .patch(
    "/campaigns/:id/details",
    zValidator("json", z.object({
      title: z.string().trim().min(5).max(255).optional(), story: z.string().trim().min(20).optional(),
      category: z.string().min(2).max(64).optional(), country: z.string().min(2).max(8).optional(),
      district: z.string().max(255).nullable().optional(), receivingInstitution: z.string().max(255).nullable().optional(),
      currency: z.string().min(2).max(8).optional(), goalAmount: z.number().int().positive().optional(),
      coverImageUrl: z.string().url().optional(),
    })),
    async (c) => {
      const db = c.get("db");
      const id = c.req.param("id");
      const body = c.req.valid("json");
      if (!Object.keys(body).length) return c.json({ error: "Provide at least one campaign field." }, 400);
      const [campaign] = await db.update(campaigns).set({ ...body, ...(body.title ? { slug: generateSlug(body.title) } : {}), updatedAt: new Date() }).where(eq(campaigns.id, id)).returning();
      if (!campaign) return c.json({ error: "Campaign not found." }, 404);
      return c.json({ campaign });
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
