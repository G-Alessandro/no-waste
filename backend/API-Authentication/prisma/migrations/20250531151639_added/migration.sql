-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "BlacklistedRefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "blacklistedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlacklistedRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedRefreshToken_token_key" ON "BlacklistedRefreshToken"("token");
