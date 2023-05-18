-- CreateTable
CREATE TABLE "User" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "fA" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "totalMatches" INTEGER NOT NULL,
    "totalWins" INTEGER NOT NULL,
    "totalloss" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "name" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Match" (
    "match_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "duration" TIMESTAMP(3),
    "p1_rankbfmatch" INTEGER NOT NULL,
    "p1_rankafmatch" INTEGER NOT NULL,
    "p2_rankbfmatch" INTEGER NOT NULL,
    "p2_rankafmatch" INTEGER NOT NULL,
    "p1_score" INTEGER,
    "p2_score" INTEGER,
    "winner_score" INTEGER,
    "ago" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "_Friendship" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_haters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_WhereMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_WhereAdmin" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_WhereBanned" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_WhereMuted" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_Friendship_AB_unique" ON "_Friendship"("A", "B");

-- CreateIndex
CREATE INDEX "_Friendship_B_index" ON "_Friendship"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_haters_AB_unique" ON "_haters"("A", "B");

-- CreateIndex
CREATE INDEX "_haters_B_index" ON "_haters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WhereMember_AB_unique" ON "_WhereMember"("A", "B");

-- CreateIndex
CREATE INDEX "_WhereMember_B_index" ON "_WhereMember"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WhereAdmin_AB_unique" ON "_WhereAdmin"("A", "B");

-- CreateIndex
CREATE INDEX "_WhereAdmin_B_index" ON "_WhereAdmin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WhereBanned_AB_unique" ON "_WhereBanned"("A", "B");

-- CreateIndex
CREATE INDEX "_WhereBanned_B_index" ON "_WhereBanned"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WhereMuted_AB_unique" ON "_WhereMuted"("A", "B");

-- CreateIndex
CREATE INDEX "_WhereMuted_B_index" ON "_WhereMuted"("B");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendship" ADD CONSTRAINT "_Friendship_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendship" ADD CONSTRAINT "_Friendship_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_haters" ADD CONSTRAINT "_haters_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_haters" ADD CONSTRAINT "_haters_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhereMember" ADD CONSTRAINT "_WhereMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhereMember" ADD CONSTRAINT "_WhereMember_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhereAdmin" ADD CONSTRAINT "_WhereAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhereAdmin" ADD CONSTRAINT "_WhereAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhereBanned" ADD CONSTRAINT "_WhereBanned_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhereBanned" ADD CONSTRAINT "_WhereBanned_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhereMuted" ADD CONSTRAINT "_WhereMuted_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhereMuted" ADD CONSTRAINT "_WhereMuted_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
