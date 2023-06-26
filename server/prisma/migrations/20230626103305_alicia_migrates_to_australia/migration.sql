/*
  Warnings:

  - The primary key for the `Channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `Channel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_pkey",
DROP COLUMN "status",
ALTER COLUMN "key" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");
