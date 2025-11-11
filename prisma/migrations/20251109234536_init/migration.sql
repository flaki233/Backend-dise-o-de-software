/*
  Warnings:

  - Changed the type of `finalStatus` on the `TradeClosure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TradeClosure" DROP COLUMN "finalStatus",
ADD COLUMN     "finalStatus" "TradeStatus" NOT NULL;

-- DropEnum
DROP TYPE "public"."FinalStatus";
