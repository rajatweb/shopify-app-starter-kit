/*
  Warnings:

  - You are about to drop the column `content` on the `session` table. All the data in the column will be lost.
  - Added the required column `accessToken` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `session` table without a default value. This is not possible if the table is not empty.
  - Made the column `shop` on table `session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "session" DROP COLUMN "content",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires" TIMESTAMP(3),
ADD COLUMN     "isAccountOwner" BOOLEAN,
ADD COLUMN     "isCollaborator" BOOLEAN,
ADD COLUMN     "isEmailVerified" BOOLEAN,
ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onlineAccessInfo" JSONB,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "state" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userEmail" TEXT,
ADD COLUMN     "userFirstName" TEXT,
ADD COLUMN     "userId" BIGINT,
ADD COLUMN     "userLastName" TEXT,
ADD COLUMN     "userLocale" TEXT,
ALTER COLUMN "shop" SET NOT NULL;

-- CreateIndex
CREATE INDEX "session_isOnline_idx" ON "session"("isOnline");
