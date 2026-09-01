/*
  Warnings:

  - You are about to drop the column `current_step` on the `campaigns` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "campaign_materials" ADD COLUMN     "status" "status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "current_step",
ADD COLUMN     "main_media_url" TEXT;
