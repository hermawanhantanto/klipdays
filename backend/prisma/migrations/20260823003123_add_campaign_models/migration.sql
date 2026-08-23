-- CreateEnum
CREATE TYPE "platform" AS ENUM ('TIKTOK');

-- CreateEnum
CREATE TYPE "campaign_status" AS ENUM ('DRAFT', 'IN_REVIEW', 'REVISION', 'REJECTED', 'ACTIVE', 'FINISHED');

-- CreateEnum
CREATE TYPE "submission_status" AS ENUM ('PENDING_REVIEW', 'REVISION_REQUESTED', 'REJECTED', 'APPROVED', 'POSTED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "material_type" AS ENUM ('VIDEO', 'IMAGE', 'DOCUMENT', 'LINK');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "platform" "platform" NOT NULL DEFAULT 'TIKTOK',
    "cpm" DECIMAL(12,2) NOT NULL,
    "min_views" INTEGER NOT NULL,
    "max_views" INTEGER NOT NULL,
    "budget" DECIMAL(15,2) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "thumbnail_url" TEXT,
    "status" "campaign_status" NOT NULL DEFAULT 'DRAFT',
    "admin_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "brand_id" TEXT NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_briefs" (
    "id" TEXT NOT NULL,
    "purpose" TEXT,
    "key_message" TEXT,
    "narration" TEXT,
    "impression" TEXT,
    "call_to_action" TEXT,
    "required_caption" TEXT,
    "hashtags" TEXT[],
    "mention_tags" TEXT[],
    "dos" TEXT[],
    "donts" TEXT[],
    "guidelines" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "campaign_briefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_materials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "material_type" NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "campaign_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "draft_video_url" TEXT NOT NULL,
    "live_video_url" TEXT,
    "status" "submission_status" NOT NULL DEFAULT 'PENDING_REVIEW',
    "review_note" TEXT,
    "verified_views" INTEGER NOT NULL DEFAULT 0,
    "earnings" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaign_briefs_campaign_id_key" ON "campaign_briefs"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_campaign_id_creator_id_key" ON "submissions"("campaign_id", "creator_id");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_briefs" ADD CONSTRAINT "campaign_briefs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_materials" ADD CONSTRAINT "campaign_materials_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
