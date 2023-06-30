-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sentToId_fkey";

-- DropIndex
DROP INDEX "Message_sentToId_key";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "sentToId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sentToId_fkey" FOREIGN KEY ("sentToId") REFERENCES "User"("login") ON DELETE SET NULL ON UPDATE CASCADE;
