/*
  Warnings:

  - Made the column `createdById` on table `Channel` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_createdById_fkey";

-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "createdById" SET NOT NULL;

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "sentById" TEXT NOT NULL,
    "sentToId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "img" TEXT,
    "preview" TEXT,
    "incoming" BOOLEAN NOT NULL,
    "outgoing" BOOLEAN NOT NULL,
    "subtype" TEXT,
    "reply" TEXT,
    "channelById" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_sentById_key" ON "Message"("sentById");

-- CreateIndex
CREATE UNIQUE INDEX "Message_sentToId_key" ON "Message"("sentToId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_channelById_key" ON "Message"("channelById");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sentToId_fkey" FOREIGN KEY ("sentToId") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelById_fkey" FOREIGN KEY ("channelById") REFERENCES "Channel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
