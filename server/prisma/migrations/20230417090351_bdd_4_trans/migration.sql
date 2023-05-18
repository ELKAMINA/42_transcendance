/*
  Warnings:

  - You are about to drop the column `creator_id` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the `_WhereAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WhereBanned` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WhereMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WhereMuted` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[createdById]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userUser_id` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Made the column `hatersId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_hatersId_fkey";

-- DropForeignKey
ALTER TABLE "_WhereAdmin" DROP CONSTRAINT "_WhereAdmin_A_fkey";

-- DropForeignKey
ALTER TABLE "_WhereAdmin" DROP CONSTRAINT "_WhereAdmin_B_fkey";

-- DropForeignKey
ALTER TABLE "_WhereBanned" DROP CONSTRAINT "_WhereBanned_A_fkey";

-- DropForeignKey
ALTER TABLE "_WhereBanned" DROP CONSTRAINT "_WhereBanned_B_fkey";

-- DropForeignKey
ALTER TABLE "_WhereMember" DROP CONSTRAINT "_WhereMember_A_fkey";

-- DropForeignKey
ALTER TABLE "_WhereMember" DROP CONSTRAINT "_WhereMember_B_fkey";

-- DropForeignKey
ALTER TABLE "_WhereMuted" DROP CONSTRAINT "_WhereMuted_A_fkey";

-- DropForeignKey
ALTER TABLE "_WhereMuted" DROP CONSTRAINT "_WhereMuted_B_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "creator_id",
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "userUser_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "channelName" TEXT,
ALTER COLUMN "hatersId" SET NOT NULL;

-- DropTable
DROP TABLE "_WhereAdmin";

-- DropTable
DROP TABLE "_WhereBanned";

-- DropTable
DROP TABLE "_WhereMember";

-- DropTable
DROP TABLE "_WhereMuted";

-- CreateIndex
CREATE UNIQUE INDEX "Channel_createdById_key" ON "Channel"("createdById");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hatersId_fkey" FOREIGN KEY ("hatersId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_channelName_fkey" FOREIGN KEY ("channelName") REFERENCES "Channel"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
