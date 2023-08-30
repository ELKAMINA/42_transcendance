-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'REFUSED', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Online', 'Offline', 'Playing');

-- CreateTable
CREATE TABLE "User" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT,
    "hash" TEXT,
    "rtHash" TEXT,
    "fA" TEXT,
    "faEnabled" BOOLEAN,
    "avatar" TEXT,
    "provider" TEXT DEFAULT 'not42',
    "status" "Status",
    "totalFriends" INTEGER DEFAULT 0,
    "totalBlockedFriends" INTEGER DEFAULT 0,
    "totalMatches" INTEGER DEFAULT 0,
    "totalWins" INTEGER DEFAULT 0,
    "totalloss" INTEGER DEFAULT 0,
    "level" INTEGER DEFAULT 0,
    "rank" INTEGER DEFAULT 0,
    "FriendSuggestions" TEXT[],
    "BannedExpiry" TIMESTAMP(3),
    "MutedExpiry" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "name" TEXT NOT NULL,
    "channelId" SERIAL NOT NULL,
    "createdById" TEXT,
    "ownedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "pbp" BOOLEAN NOT NULL DEFAULT false,
    "key" TEXT,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "sentById" TEXT,
    "message" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "img" TEXT,
    "preview" TEXT,
    "incoming" BOOLEAN NOT NULL,
    "outgoing" BOOLEAN NOT NULL,
    "subtype" TEXT,
    "reply" TEXT,
    "channelById" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "match_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "p1_score" INTEGER NOT NULL DEFAULT 0,
    "p2_score" INTEGER NOT NULL DEFAULT 0,
    "winnerName" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT,
    "receiverId" TEXT,
    "SenderAv" TEXT NOT NULL DEFAULT 'None',
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalInformation" (
    "id" TEXT NOT NULL,
    "pid" TEXT NOT NULL DEFAULT '1',
    "totalPlayers" INTEGER DEFAULT 0,

    CONSTRAINT "GlobalInformation_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "_Membership" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelAdmin" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

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
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_id_key" ON "FriendRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalInformation_id_key" ON "GlobalInformation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalInformation_pid_key" ON "GlobalInformation"("pid");

-- CreateIndex
CREATE UNIQUE INDEX "_Friendship_AB_unique" ON "_Friendship"("A", "B");

-- CreateIndex
CREATE INDEX "_Friendship_B_index" ON "_Friendship"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_haters_AB_unique" ON "_haters"("A", "B");

-- CreateIndex
CREATE INDEX "_haters_B_index" ON "_haters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Membership_AB_unique" ON "_Membership"("A", "B");

-- CreateIndex
CREATE INDEX "_Membership_B_index" ON "_Membership"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelAdmin_AB_unique" ON "_ChannelAdmin"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelAdmin_B_index" ON "_ChannelAdmin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelBanned_AB_unique" ON "_ChannelBanned"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelBanned_B_index" ON "_ChannelBanned"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelMuted_AB_unique" ON "_ChannelMuted"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelMuted_B_index" ON "_ChannelMuted"("B");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("login") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_ownedById_fkey" FOREIGN KEY ("ownedById") REFERENCES "User"("login") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User"("login") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelById_fkey" FOREIGN KEY ("channelById") REFERENCES "Channel"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("login") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("login") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendship" ADD CONSTRAINT "_Friendship_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendship" ADD CONSTRAINT "_Friendship_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_haters" ADD CONSTRAINT "_haters_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_haters" ADD CONSTRAINT "_haters_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Membership" ADD CONSTRAINT "_Membership_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Membership" ADD CONSTRAINT "_Membership_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelAdmin" ADD CONSTRAINT "_ChannelAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelAdmin" ADD CONSTRAINT "_ChannelAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelBanned" ADD CONSTRAINT "_ChannelBanned_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelBanned" ADD CONSTRAINT "_ChannelBanned_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelMuted" ADD CONSTRAINT "_ChannelMuted_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelMuted" ADD CONSTRAINT "_ChannelMuted_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
