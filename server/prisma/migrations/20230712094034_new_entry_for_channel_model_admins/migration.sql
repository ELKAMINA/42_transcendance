-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "adminsById" TEXT;

-- CreateTable
CREATE TABLE "_ChannelAdmin" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelAdmin_AB_unique" ON "_ChannelAdmin"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelAdmin_B_index" ON "_ChannelAdmin"("B");

-- AddForeignKey
ALTER TABLE "_ChannelAdmin" ADD CONSTRAINT "_ChannelAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelAdmin" ADD CONSTRAINT "_ChannelAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
