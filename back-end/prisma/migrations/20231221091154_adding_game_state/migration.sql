-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('ENDED', 'ONGOING');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'ONGOING';
