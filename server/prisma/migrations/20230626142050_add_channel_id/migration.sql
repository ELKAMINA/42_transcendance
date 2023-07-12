/*
  Warnings:

  - The primary key for the `Channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `channelName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_createdById_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_channelName_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_pkey",
DROP COLUMN "status",
ADD COLUMN     "channelId" SERIAL NOT NULL,
ALTER COLUMN "key" DROP NOT NULL,
ADD CONSTRAINT "Channel_pkey" PRIMARY KEY ("channelId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "channelName";

-- CreateTable
CREATE TABLE "_Membership" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Membership_AB_unique" ON "_Membership"("A", "B");

-- CreateIndex
CREATE INDEX "_Membership_B_index" ON "_Membership"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("login") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Membership" ADD CONSTRAINT "_Membership_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Membership" ADD CONSTRAINT "_Membership_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
