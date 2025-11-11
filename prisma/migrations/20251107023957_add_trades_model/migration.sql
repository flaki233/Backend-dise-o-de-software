-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Trade" (
    "id" SERIAL NOT NULL,
    "proposerId" INTEGER NOT NULL,
    "responderId" INTEGER NOT NULL,
    "proposerOfferJson" JSONB NOT NULL,
    "responderOfferJson" JSONB NOT NULL,
    "proposerConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "responderConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "status" "TradeStatus" NOT NULL DEFAULT 'PENDING',
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trade_proposerId_idx" ON "Trade"("proposerId");

-- CreateIndex
CREATE INDEX "Trade_responderId_idx" ON "Trade"("responderId");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
