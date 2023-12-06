/*
  Warnings:

  - You are about to drop the column `intraId` on the `User` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_intraId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "intraId",
ADD COLUMN     "displayName" TEXT NOT NULL,
ALTER COLUMN "username" SET NOT NULL;
