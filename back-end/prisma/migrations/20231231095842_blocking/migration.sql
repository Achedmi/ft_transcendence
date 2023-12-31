/*
  Warnings:

  - You are about to drop the column `BlockedById` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `Friendship` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_BlockedById_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user2Id_fkey";

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "BlockedById",
DROP COLUMN "isBlocked";

-- CreateTable
CREATE TABLE "Blocking" (
    "id" SERIAL NOT NULL,
    "user1Id" INTEGER,
    "user2Id" INTEGER,
    "BlockedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blocking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blocking" ADD CONSTRAINT "Blocking_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocking" ADD CONSTRAINT "Blocking_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocking" ADD CONSTRAINT "Blocking_BlockedById_fkey" FOREIGN KEY ("BlockedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
