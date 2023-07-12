/*
  Warnings:

  - You are about to drop the column `userUser_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_BlockedFriends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlockedFriends" DROP CONSTRAINT "_BlockedFriends_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlockedFriends" DROP CONSTRAINT "_BlockedFriends_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userUser_id";

-- DropTable
DROP TABLE "_BlockedFriends";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
