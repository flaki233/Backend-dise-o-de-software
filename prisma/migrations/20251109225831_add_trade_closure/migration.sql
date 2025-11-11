-- CreateEnum
CREATE TYPE "FinalStatus" AS ENUM ('COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "TradeClosure" (
    "id" SERIAL NOT NULL,
    "tradeId" INTEGER NOT NULL,
    "proposerId" INTEGER NOT NULL,
    "responderId" INTEGER NOT NULL,
    "offerA" JSONB NOT NULL,
    "offerB" JSONB NOT NULL,
    "closedAt" TIMESTAMP(3) NOT NULL,
    "finalStatus" "FinalStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeClosure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TradeClosure_tradeId_key" ON "TradeClosure"("tradeId");

-- AddForeignKey
ALTER TABLE "TradeClosure" ADD CONSTRAINT "TradeClosure_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
