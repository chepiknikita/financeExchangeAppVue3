-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "closingPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user_assets" ADD COLUMN     "averageBuyPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;


CREATE INDEX "assets_previous_close_idx" ON "assets"("closingPrice");
CREATE INDEX "user_assets_avg_buy_price_idx" ON "user_assets"("averageBuyPrice");