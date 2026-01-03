/*
  Warnings:

  - A unique constraint covering the columns `[userId,assetId]` on the table `user_assets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_assets_userId_assetId_key" ON "user_assets"("userId", "assetId");
