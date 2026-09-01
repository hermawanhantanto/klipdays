-- CreateEnum
CREATE TYPE "campaign_type" AS ENUM ('PRODUCT', 'SERVICE', 'CONTENT');

-- CreateEnum
CREATE TYPE "category" AS ENUM ('Beauty & Skincare', 'Fashion & Style', 'Food & Beverage', 'Health & Fitness', 'Technology & Gadgets', 'Lifestyle', 'Gaming', 'Travel', 'Entertainment', 'Other');

-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "campaign_type" "campaign_type" NOT NULL DEFAULT 'PRODUCT',
ADD COLUMN     "category" "category" NOT NULL DEFAULT 'Other',
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
