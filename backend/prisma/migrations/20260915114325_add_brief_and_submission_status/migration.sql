/*
  Warnings:

  - The `status` column on the `submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "campaign_briefs" ADD COLUMN     "status" "status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "submission_status" "submission_status" NOT NULL DEFAULT 'PENDING_REVIEW',
DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'ACTIVE';
