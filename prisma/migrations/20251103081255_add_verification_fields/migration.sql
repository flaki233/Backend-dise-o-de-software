/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reputationScore` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tradesCompleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."User_resetToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "emailVerified",
DROP COLUMN "isActive",
DROP COLUMN "location",
DROP COLUMN "name",
DROP COLUMN "reputationScore",
DROP COLUMN "resetToken",
DROP COLUMN "tradesCompleted",
DROP COLUMN "updatedAt",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
