/*
  Warnings:

  - You are about to drop the column `isBanned` on the `UserChat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserChat" DROP COLUMN "isBanned";

-- CreateTable
CREATE TABLE "_bannedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_bannedUsers_AB_unique" ON "_bannedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_bannedUsers_B_index" ON "_bannedUsers"("B");

-- AddForeignKey
ALTER TABLE "_bannedUsers" ADD CONSTRAINT "_bannedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bannedUsers" ADD CONSTRAINT "_bannedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
