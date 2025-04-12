/*
  Warnings:

  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RefreshToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `expiresAt` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id");
