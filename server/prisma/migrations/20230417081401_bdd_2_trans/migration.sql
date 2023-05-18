/*
  Warnings:

  - You are about to drop the `_Friendship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_haters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Friendship" DROP CONSTRAINT "_Friendship_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friendship" DROP CONSTRAINT "_Friendship_B_fkey";

-- DropForeignKey
ALTER TABLE "_haters" DROP CONSTRAINT "_haters_A_fkey";

-- DropForeignKey
ALTER TABLE "_haters" DROP CONSTRAINT "_haters_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hatersId" TEXT,
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "_Friendship";

-- DropTable
DROP TABLE "_haters";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hatersId_fkey" FOREIGN KEY ("hatersId") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
