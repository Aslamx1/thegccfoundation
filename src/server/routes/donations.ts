import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { donations, campaigns, users } from "@/db/schema";
import type { HonoEnv } from "../types";

export const donationsRoute = new Hono<HonoEnv>()
  // ---------------------------------------------------------------------------
  // 1. Create Donation Checkout Intent
  // ---------------------------------------------------------------------------
  .post(
    "/checkout",
    zValidator(
      "json",
      z.object({
        campaignId: z.string().min(1, "Campaign ID is required"),
        amount: z.number().int().min(100, "Minimum donation is 1.00 (100 minor units)"), // In cents
        tipAmount: z.number().int().min(0).default(0),
        donorName: z.string().min(1).default("Anonymous"),
        donorEmail: z.string().email("Valid donor email required"),
        isAnonymous: z.boolean().default(false),
        message: z.string().max(500).optional(),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const currentUser = c.get("user");
      const body = c.req.valid("json");

      // Verify campaign exists and is active
      const campaign = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.id, body.campaignId))
        .limit(1);

      if (campaign.length === 0) {
        return c.json({ error: "Campaign not found" }, 404);
      }

      if (campaign[0].status !== "active") {
        return c.json({ error: "Campaign is currently not accepting donations" }, 400);
      }

      const donationId = `don_${crypto.randomUUID()}`;
      // In production, this matches the Stripe PaymentIntent ID (pi_xxx) or provider ref
      const paymentProviderRef = `pi_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;

      await db.insert(donations).values({
        id: donationId,
        campaignId: body.campaignId,
        donorId: currentUser?.id || null,
        donorName: body.donorName,
        donorEmail: body.donorEmail,
        isAnonymous: body.isAnonymous,
        amount: body.amount,
        tipAmount: body.tipAmount,
        message: body.message || null,
        paymentProviderRef,
        paymentStatus: "pending",
      });

      return c.json(
        {
          success: true,
          donationId,
          paymentProviderRef,
          amount: body.amount,
          tipAmount: body.tipAmount,
          currency: campaign[0].currency,
          // Client secret format expected by Stripe or custom gateway
          clientSecret: `${paymentProviderRef}_secret_${crypto.randomUUID().slice(0, 16)}`,
        },
        201
      );
    }
  )

  // ---------------------------------------------------------------------------
  // 2. Idempotent Payment Webhook (Stripe / Flutterwave compatible)
  // ---------------------------------------------------------------------------
  .post(
    "/webhook",
    zValidator(
      "json",
      z.object({
        type: z.string(), // e.g. 'payment_intent.succeeded'
        paymentProviderRef: z.string(),
        status: z.enum(["succeeded", "failed"]).default("succeeded"),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const body = c.req.valid("json");

      // 1. Fetch donation by unique paymentProviderRef
      const records = await db
        .select()
        .from(donations)
        .where(eq(donations.paymentProviderRef, body.paymentProviderRef))
        .limit(1);

      if (records.length === 0) {
        return c.json({ error: "Donation record not found for provider reference" }, 404);
      }

      const donation = records[0];

      // 2. Strict idempotency check: prevent duplicate credit
      if (donation.paymentStatus === "succeeded") {
        return c.json({
          received: true,
          message: "Idempotent response: Donation already processed as succeeded.",
        });
      }

      // 3. If failed from provider
      if (body.status === "failed") {
        await db
          .update(donations)
          .set({ paymentStatus: "failed" })
          .where(eq(donations.id, donation.id));
        return c.json({ received: true, status: "marked_failed" });
      }

      // 4. Mark succeeded and atomically increment campaign raisedAmount and donorCount
      await db.transaction(async (tx) => {
        await tx
          .update(donations)
          .set({ paymentStatus: "succeeded" })
          .where(eq(donations.id, donation.id));

        await tx
          .update(campaigns)
          .set({
            raisedAmount: sql`${campaigns.raisedAmount} + ${donation.amount}`,
            donorCount: sql`${campaigns.donorCount} + 1`,
            updatedAt: sql`now()`,
          })
          .where(eq(campaigns.id, donation.campaignId));
      });

      return c.json({
        received: true,
        status: "succeeded",
        amountAdded: donation.amount,
        campaignId: donation.campaignId,
      });
    }
  )

  // ---------------------------------------------------------------------------
  // 3. List Campaign Donations
  // ---------------------------------------------------------------------------
  .get(
    "/campaign/:campaignId",
    zValidator(
      "query",
      z.object({
        limit: z.coerce.number().min(1).max(50).default(20),
        offset: z.coerce.number().min(0).default(0),
      })
    ),
    async (c) => {
      const db = c.get("db");
      const campaignId = c.req.param("campaignId");
      const { limit, offset } = c.req.valid("query");

      const items = await db
        .select({
          id: donations.id,
          donorName: sql<string>`case when ${donations.isAnonymous} then 'Anonymous' else ${donations.donorName} end`,
          amount: donations.amount,
          message: donations.message,
          createdAt: donations.createdAt,
        })
        .from(donations)
        .where(and(eq(donations.campaignId, campaignId), eq(donations.paymentStatus, "succeeded")))
        .orderBy(desc(donations.createdAt))
        .limit(limit)
        .offset(offset);

      return c.json({ donations: items });
    }
  );
