-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "ownedById" TEXT;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_ownedById_fkey" FOREIGN KEY ("ownedById") REFERENCES "User"("login") ON DELETE SET NULL ON UPDATE CASCADE;
