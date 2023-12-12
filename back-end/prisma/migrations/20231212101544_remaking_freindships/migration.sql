/*
  Warnings:

  - You are about to drop the `_friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_B_fkey";

-- DropTable
DROP TABLE "_friends";

-- CreateTable
CREATE TABLE "FriendShips" (
    "id" SERIAL NOT NULL,
    "user1Id" INTEGER,
    "user2Id" INTEGER,

    CONSTRAINT "FriendShips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FriendShips" ADD CONSTRAINT "FriendShips_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendShips" ADD CONSTRAINT "FriendShips_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
