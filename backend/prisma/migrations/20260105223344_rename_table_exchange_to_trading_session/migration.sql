/*
  Warnings:

  - You are about to drop the `exchange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "exchange";

-- CreateTable
CREATE TABLE "trading_session" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),
    "isTrading" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "trading_session_pkey" PRIMARY KEY ("id")
);
