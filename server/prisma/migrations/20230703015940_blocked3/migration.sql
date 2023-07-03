-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_login_fkey";

-- CreateTable
CREATE TABLE "_haters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_haters_AB_unique" ON "_haters"("A", "B");

-- CreateIndex
CREATE INDEX "_haters_B_index" ON "_haters"("B");

-- AddForeignKey
ALTER TABLE "_haters" ADD CONSTRAINT "_haters_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_haters" ADD CONSTRAINT "_haters_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
