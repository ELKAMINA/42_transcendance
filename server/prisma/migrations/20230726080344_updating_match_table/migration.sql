/*
  Warnings:

  - You are about to drop the column `ago` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `p1_rankafmatch` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `p1_rankbfmatch` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `p2_rankafmatch` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `p2_rankbfmatch` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `winner_score` on the `Match` table. All the data in the column will be lost.
  - Added the required column `winnerName` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Made the column `p1_score` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `p2_score` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "ago",
DROP COLUMN "duration",
DROP COLUMN "p1_rankafmatch",
DROP COLUMN "p1_rankbfmatch",
DROP COLUMN "p2_rankafmatch",
DROP COLUMN "p2_rankbfmatch",
DROP COLUMN "updatedAt",
DROP COLUMN "winner_score",
ADD COLUMN     "winnerName" TEXT NOT NULL,
ALTER COLUMN "p1_score" SET NOT NULL,
ALTER COLUMN "p1_score" SET DEFAULT 0,
ALTER COLUMN "p2_score" SET NOT NULL,
ALTER COLUMN "p2_score" SET DEFAULT 0;
