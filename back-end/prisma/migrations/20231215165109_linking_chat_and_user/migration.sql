-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "isAdmired" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserChat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "chatId" INTEGER,
    "isMutted" BOOLEAN NOT NULL DEFAULT false,
    "mutedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserChat" ADD CONSTRAINT "UserChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChat" ADD CONSTRAINT "UserChat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChat" ADD CONSTRAINT "UserChat_mutedById_fkey" FOREIGN KEY ("mutedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
