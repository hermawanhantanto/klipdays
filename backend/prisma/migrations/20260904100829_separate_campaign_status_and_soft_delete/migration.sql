/*
  Warnings:

  - The `status` column on the `campaigns` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "campaign_status" "campaign_status" NOT NULL DEFAULT 'DRAFT',
DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'ACTIVE';
