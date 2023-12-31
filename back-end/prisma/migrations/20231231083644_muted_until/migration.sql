/*
  Warnings:

  - You are about to drop the column `isMutted` on the `UserChat` table. All the data in the column will be lost.
  - You are about to drop the column `mutedById` on the `UserChat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserChat" DROP CONSTRAINT "UserChat_mutedById_fkey";

-- AlterTable
ALTER TABLE "UserChat" DROP COLUMN "isMutted",
DROP COLUMN "mutedById",
ADD COLUMN     "isMuted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mutedUntil" TIMESTAMP(3);
