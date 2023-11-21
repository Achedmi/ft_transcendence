/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "Bio" TEXT DEFAULT 'This user has no bio yet',
ADD COLUMN     "isTFAenabled" BOOLEAN NOT NULL DEFAULT false;
