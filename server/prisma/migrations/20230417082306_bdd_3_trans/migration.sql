/*
  Warnings:

  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userId",
ADD COLUMN     "loversId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_loversId_fkey" FOREIGN KEY ("loversId") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
