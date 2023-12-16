/*
  Warnings:

  - You are about to drop the column `isAdmired` on the `Friendship` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "isAdmired";

-- AlterTable
ALTER TABLE "UserChat" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
