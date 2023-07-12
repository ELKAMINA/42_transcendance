-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channelById_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "channelById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelById_fkey" FOREIGN KEY ("channelById") REFERENCES "Channel"("name") ON DELETE SET NULL ON UPDATE CASCADE;
