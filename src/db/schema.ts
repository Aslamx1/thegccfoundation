import { pgTable, varchar, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ---------------------------------------------------------------------------
// 1. Users Table
// ---------------------------------------------------------------------------
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash"),
    avatarUrl: text("avatar_url"),
    phone: varchar("phone", { length: 64 }),
    location: varchar("location", { length: 255 }),
    role: varchar("role", { length: 32 }).$type<"user" | "admin">().notNull().default("user"),
    isVerified: boolean("is_verified").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

// ---------------------------------------------------------------------------
// 2. Campaigns Table
// ---------------------------------------------------------------------------
export const campaigns = pgTable(
  "campaigns",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    organizerId: varchar("organizer_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    story: text("story").notNull(),
    category: varchar("category", { length: 64 }).notNull(),
    country: varchar("country", { length: 8 }).notNull().default("US"),
    district: varchar("district", { length: 255 }),
    receivingInstitution: varchar("receiving_institution", { length: 255 }),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    goalAmount: integer("goal_amount").notNull(), // Minor units (e.g., cents)
    raisedAmount: integer("raised_amount").notNull().default(0), // Minor units
    donorCount: integer("donor_count").notNull().default(0),
    coverImageUrl: text("cover_image_url").notNull(),
    status: varchar("status", { length: 32 })
      .$type<"draft" | "active" | "paused" | "completed">()
      .notNull()
      .default("active"),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("campaigns_slug_idx").on(table.slug),
    index("campaigns_organizer_id_idx").on(table.organizerId),
    index("campaigns_category_idx").on(table.category),
    index("campaigns_status_idx").on(table.status),
  ]
);

// ---------------------------------------------------------------------------
// 3. Donations Table
// ---------------------------------------------------------------------------
export const donations = pgTable(
  "donations",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    campaignId: varchar("campaign_id", { length: 128 })
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    donorId: varchar("donor_id", { length: 128 }).references(() => users.id, { onDelete: "set null" }),
    donorName: varchar("donor_name", { length: 255 }).notNull().default("Anonymous"),
    donorEmail: varchar("donor_email", { length: 255 }).notNull(),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    amount: integer("amount").notNull(), // Minor units (e.g. cents)
    tipAmount: integer("tip_amount").notNull().default(0), // Platform tip in cents
    message: text("message"),
    paymentProviderRef: varchar("payment_provider_ref", { length: 255 }).notNull().unique(), // Stripe PI / Provider ID
    entryType: varchar("entry_type", { length: 16 }).$type<"online" | "offline">().notNull().default("online"),
    paymentMethod: varchar("payment_method", { length: 64 }).notNull().default("Online"),
    referenceCode: varchar("reference_code", { length: 255 }),
    notes: text("notes"),
    paymentStatus: varchar("payment_status", { length: 32 })
      .$type<"pending" | "succeeded" | "failed">()
      .notNull()
      .default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("donations_campaign_id_idx").on(table.campaignId),
    index("donations_payment_provider_ref_idx").on(table.paymentProviderRef),
    index("donations_donor_id_idx").on(table.donorId),
    index("donations_created_at_idx").on(table.createdAt),
  ]
);

// ---------------------------------------------------------------------------
// 4. Campaign Updates Table
// ---------------------------------------------------------------------------
export const campaignUpdates = pgTable(
  "campaign_updates",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    campaignId: varchar("campaign_id", { length: 128 })
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    category: varchar("category", { length: 128 }).notNull().default("Project Update"),
    authorName: varchar("author_name", { length: 255 }).notNull().default("Foundation Staff"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("campaign_updates_campaign_id_idx").on(table.campaignId),
    index("campaign_updates_created_at_idx").on(table.createdAt),
  ]
);

// ---------------------------------------------------------------------------
// 5. Payout Requests Table
// ---------------------------------------------------------------------------
export const payoutRequests = pgTable(
  "payout_requests",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    campaignId: varchar("campaign_id", { length: 128 })
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    organizerId: varchar("organizer_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(), // In cents
    bankDetailsEncrypted: text("bank_details_encrypted").notNull(),
    status: varchar("status", { length: 32 })
      .$type<"pending" | "approved" | "paid" | "rejected">()
      .notNull()
      .default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("payout_requests_campaign_id_idx").on(table.campaignId),
    index("payout_requests_organizer_id_idx").on(table.organizerId),
    index("payout_requests_status_idx").on(table.status),
  ]
);

// ---------------------------------------------------------------------------
// 6. Reports Table
// ---------------------------------------------------------------------------
export const reports = pgTable(
  "reports",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    campaignId: varchar("campaign_id", { length: 128 })
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    reporterEmail: varchar("reporter_email", { length: 255 }).notNull(),
    reason: varchar("reason", { length: 128 }).notNull(),
    details: text("details").notNull(),
    status: varchar("status", { length: 32 })
      .$type<"open" | "resolved">()
      .notNull()
      .default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("reports_campaign_id_idx").on(table.campaignId),
    index("reports_status_idx").on(table.status),
  ]
);

// ---------------------------------------------------------------------------
// 7. Child sponsorship and field communications
// ---------------------------------------------------------------------------
export const childProfiles = pgTable(
  "child_profiles",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    gender: varchar("gender", { length: 16 }).$type<"Girl" | "Boy">().notNull(),
    district: varchar("district", { length: 255 }).notNull(),
    schoolAndGrade: varchar("school_and_grade", { length: 255 }).notNull(),
    monthlySponsorshipUSD: integer("monthly_sponsorship_usd").notNull(),
    bio: text("bio").notNull(),
    dream: text("dream").notNull(),
    photoUrl: text("photo_url").notNull(),
    status: varchar("status", { length: 16 }).$type<"available" | "sponsored">().notNull().default("available"),
    sponsorName: varchar("sponsor_name", { length: 255 }),
    sponsorEmail: varchar("sponsor_email", { length: 255 }),
    sponsoredSince: timestamp("sponsored_since", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("child_profiles_status_idx").on(table.status)]
);

export const childLetters = pgTable(
  "child_letters",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    childId: varchar("child_id", { length: 128 }).notNull().references(() => childProfiles.id, { onDelete: "cascade" }),
    donorName: varchar("donor_name", { length: 255 }).notNull(),
    donorEmail: varchar("donor_email", { length: 255 }).notNull(),
    message: text("message").notNull(),
    status: varchar("status", { length: 16 }).$type<"pending" | "approved" | "rejected">().notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (table) => [index("child_letters_child_id_idx").on(table.childId), index("child_letters_status_idx").on(table.status)]
);

export const fieldUpdates = pgTable(
  "field_updates",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    documentType: varchar("document_type", { length: 64 }).notNull(),
    targetType: varchar("target_type", { length: 16 }).$type<"child" | "project">().notNull(),
    targetId: varchar("target_id", { length: 128 }).notNull(),
    termOrPeriod: varchar("term_or_period", { length: 128 }).notNull(),
    notes: text("notes").notNull().default(""),
    attachmentUrl: text("attachment_url").notNull(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    uploadedBy: varchar("uploaded_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("field_updates_target_idx").on(table.targetType, table.targetId)]
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------
export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaigns),
  donations: many(donations),
  payoutRequests: many(payoutRequests),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  organizer: one(users, {
    fields: [campaigns.organizerId],
    references: [users.id],
  }),
  donations: many(donations),
  updates: many(campaignUpdates),
  payoutRequests: many(payoutRequests),
  reports: many(reports),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [donations.campaignId],
    references: [campaigns.id],
  }),
  donor: one(users, {
    fields: [donations.donorId],
    references: [users.id],
  }),
}));

export const campaignUpdatesRelations = relations(campaignUpdates, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignUpdates.campaignId],
    references: [campaigns.id],
  }),
}));

export const payoutRequestsRelations = relations(payoutRequests, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [payoutRequests.campaignId],
    references: [campaigns.id],
  }),
  organizer: one(users, {
    fields: [payoutRequests.organizerId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [reports.campaignId],
    references: [campaigns.id],
  }),
}));

// ---------------------------------------------------------------------------
// Inferred TypeScript Types
// ---------------------------------------------------------------------------
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;

export type CampaignUpdate = typeof campaignUpdates.$inferSelect;
export type NewCampaignUpdate = typeof campaignUpdates.$inferInsert;

export type PayoutRequest = typeof payoutRequests.$inferSelect;
export type NewPayoutRequest = typeof payoutRequests.$inferInsert;

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
