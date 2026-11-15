CREATE TABLE "campaign_updates" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"campaign_id" varchar(128) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"organizer_id" varchar(128) NOT NULL,
	"title" varchar(255) NOT NULL,
	"story" text NOT NULL,
	"category" varchar(64) NOT NULL,
	"country" varchar(8) DEFAULT 'US' NOT NULL,
	"currency" varchar(8) DEFAULT 'USD' NOT NULL,
	"goal_amount" integer NOT NULL,
	"raised_amount" integer DEFAULT 0 NOT NULL,
	"donor_count" integer DEFAULT 0 NOT NULL,
	"cover_image_url" text NOT NULL,
	"status" varchar(32) DEFAULT 'active' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "campaigns_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"campaign_id" varchar(128) NOT NULL,
	"donor_id" varchar(128),
	"donor_name" varchar(255) DEFAULT 'Anonymous' NOT NULL,
	"donor_email" varchar(255) NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"amount" integer NOT NULL,
	"tip_amount" integer DEFAULT 0 NOT NULL,
	"message" text,
	"payment_provider_ref" varchar(255) NOT NULL,
	"payment_status" varchar(32) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "donations_payment_provider_ref_unique" UNIQUE("payment_provider_ref")
);
--> statement-breakpoint
CREATE TABLE "payout_requests" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"campaign_id" varchar(128) NOT NULL,
	"organizer_id" varchar(128) NOT NULL,
	"amount" integer NOT NULL,
	"bank_details_encrypted" text NOT NULL,
	"status" varchar(32) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"campaign_id" varchar(128) NOT NULL,
	"reporter_email" varchar(255) NOT NULL,
	"reason" varchar(128) NOT NULL,
	"details" text NOT NULL,
	"status" varchar(32) DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text,
	"avatar_url" text,
	"role" varchar(32) DEFAULT 'user' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "campaign_updates" ADD CONSTRAINT "campaign_updates_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_users_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "campaign_updates_campaign_id_idx" ON "campaign_updates" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "campaign_updates_created_at_idx" ON "campaign_updates" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "campaigns_slug_idx" ON "campaigns" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "campaigns_organizer_id_idx" ON "campaigns" USING btree ("organizer_id");--> statement-breakpoint
CREATE INDEX "campaigns_category_idx" ON "campaigns" USING btree ("category");--> statement-breakpoint
CREATE INDEX "campaigns_status_idx" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "donations_campaign_id_idx" ON "donations" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "donations_payment_provider_ref_idx" ON "donations" USING btree ("payment_provider_ref");--> statement-breakpoint
CREATE INDEX "donations_donor_id_idx" ON "donations" USING btree ("donor_id");--> statement-breakpoint
CREATE INDEX "donations_created_at_idx" ON "donations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payout_requests_campaign_id_idx" ON "payout_requests" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "payout_requests_organizer_id_idx" ON "payout_requests" USING btree ("organizer_id");--> statement-breakpoint
CREATE INDEX "payout_requests_status_idx" ON "payout_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reports_campaign_id_idx" ON "reports" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "reports_status_idx" ON "reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");