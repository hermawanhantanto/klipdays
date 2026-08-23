/*
  Warnings:

  - The `industry` column on the `brands` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updated_at` to the `campaign_materials` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "industry" AS ENUM ('E-Commerce', 'Food & Beverage', 'Fashion & Beauty', 'Technology', 'Finance', 'Health & Wellness', 'Entertainment', 'Education', 'Travel & Hospitality', 'Other');

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "industry",
ADD COLUMN     "industry" "industry";

-- AlterTable
ALTER TABLE "campaign_materials" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
