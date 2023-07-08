/*
  Warnings:

  - Added the required column `player2Id` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "player2Id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GlobalInformation" (
    "id" TEXT NOT NULL,
    "totalPlayers" INTEGER,

    CONSTRAINT "GlobalInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalInformation_id_key" ON "GlobalInformation"("id");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
