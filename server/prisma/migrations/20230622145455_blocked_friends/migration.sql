-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userUser_id" TEXT;

-- CreateTable
CREATE TABLE "_BlockedFriends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlockedFriends_AB_unique" ON "_BlockedFriends"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockedFriends_B_index" ON "_BlockedFriends"("B");

-- AddForeignKey
ALTER TABLE "_BlockedFriends" ADD CONSTRAINT "_BlockedFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedFriends" ADD CONSTRAINT "_BlockedFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
