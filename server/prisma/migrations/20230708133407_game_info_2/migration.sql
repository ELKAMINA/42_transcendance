/*
  Warnings:

  - A unique constraint covering the columns `[pid]` on the table `GlobalInformation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GlobalInformation" ADD COLUMN     "pid" TEXT NOT NULL DEFAULT '1';

-- CreateIndex
CREATE UNIQUE INDEX "GlobalInformation_pid_key" ON "GlobalInformation"("pid");
