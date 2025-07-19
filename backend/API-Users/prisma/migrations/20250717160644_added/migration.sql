/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserLocations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserLocations_userId_key" ON "UserLocations"("userId");
