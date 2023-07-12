/*
  Warnings:

  - A unique constraint covering the columns `[createdById]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Channel_createdById_key" ON "Channel"("createdById");
