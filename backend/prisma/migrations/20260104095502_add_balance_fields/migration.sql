/*
  Warnings:

  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "assets_previous_close_idx";

-- DropIndex
DROP INDEX "user_assets_avg_buy_price_idx";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "balance",
ADD COLUMN     "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "initialBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- DropEnum
DROP TYPE "OrderStatus";
