-- CreateTable
CREATE TABLE "_ChannelBanned" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelMuted" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelBanned_AB_unique" ON "_ChannelBanned"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelBanned_B_index" ON "_ChannelBanned"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelMuted_AB_unique" ON "_ChannelMuted"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelMuted_B_index" ON "_ChannelMuted"("B");

-- AddForeignKey
ALTER TABLE "_ChannelBanned" ADD CONSTRAINT "_ChannelBanned_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelBanned" ADD CONSTRAINT "_ChannelBanned_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelMuted" ADD CONSTRAINT "_ChannelMuted_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelMuted" ADD CONSTRAINT "_ChannelMuted_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
