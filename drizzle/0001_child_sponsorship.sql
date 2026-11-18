ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(64);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location" varchar(255);
--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "entry_type" varchar(16) DEFAULT 'online' NOT NULL;
--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "payment_method" varchar(64) DEFAULT 'Online' NOT NULL;
--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "reference_code" varchar(255);
--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "notes" text;
--> statement-breakpoint
ALTER TABLE "campaign_updates" ADD COLUMN "category" varchar(128) DEFAULT 'Project Update' NOT NULL;
--> statement-breakpoint
ALTER TABLE "campaign_updates" ADD COLUMN "author_name" varchar(255) DEFAULT 'Foundation Staff' NOT NULL;
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "district" varchar(255);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "receiving_institution" varchar(255);
--> statement-breakpoint
CREATE TABLE "child_profiles" (
  "id" varchar(128) PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "age" integer NOT NULL,
  "gender" varchar(16) NOT NULL,
  "district" varchar(255) NOT NULL,
  "school_and_grade" varchar(255) NOT NULL,
  "monthly_sponsorship_usd" integer NOT NULL,
  "bio" text NOT NULL,
  "dream" text NOT NULL,
  "photo_url" text NOT NULL,
  "status" varchar(16) DEFAULT 'available' NOT NULL,
  "sponsor_name" varchar(255),
  "sponsor_email" varchar(255),
  "sponsored_since" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "child_profiles_status_idx" ON "child_profiles" USING btree ("status");
--> statement-breakpoint
CREATE TABLE "child_letters" (
  "id" varchar(128) PRIMARY KEY NOT NULL,
  "child_id" varchar(128) NOT NULL REFERENCES "child_profiles"("id") ON DELETE CASCADE,
  "donor_name" varchar(255) NOT NULL,
  "donor_email" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "status" varchar(16) DEFAULT 'pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "child_letters_child_id_idx" ON "child_letters" USING btree ("child_id");
--> statement-breakpoint
CREATE INDEX "child_letters_status_idx" ON "child_letters" USING btree ("status");
--> statement-breakpoint
CREATE TABLE "field_updates" (
  "id" varchar(128) PRIMARY KEY NOT NULL,
  "title" varchar(255) NOT NULL,
  "document_type" varchar(64) NOT NULL,
  "target_type" varchar(16) NOT NULL,
  "target_id" varchar(128) NOT NULL,
  "term_or_period" varchar(128) NOT NULL,
  "notes" text DEFAULT '' NOT NULL,
  "attachment_url" text NOT NULL,
  "file_name" varchar(255) NOT NULL,
  "uploaded_by" varchar(255) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "field_updates_target_idx" ON "field_updates" USING btree ("target_type", "target_id");
