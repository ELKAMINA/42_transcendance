-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sentById_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "sentById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User"("login") ON DELETE SET NULL ON UPDATE CASCADE;
