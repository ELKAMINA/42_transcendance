/*
  Warnings:

  - You are about to drop the column `userUser_id` on the `Channel` table. All the data in the column will be lost.
  - Added the required column `type` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "userUser_id",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "channelName" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_channelName_fkey" FOREIGN KEY ("channelName") REFERENCES "Channel"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
