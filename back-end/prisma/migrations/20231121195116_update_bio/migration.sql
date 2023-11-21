/*
  Warnings:

  - You are about to drop the column `Bio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Bio",
ADD COLUMN     "bio" TEXT DEFAULT 'Nothing to see here...';
