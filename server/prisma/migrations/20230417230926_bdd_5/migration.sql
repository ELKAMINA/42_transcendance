/*
  Warnings:

  - You are about to drop the column `player2Id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `channelName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hatersId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loversId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_player2Id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_channelName_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_hatersId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_loversId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "player2Id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "channelName",
DROP COLUMN "hatersId",
DROP COLUMN "loversId";
