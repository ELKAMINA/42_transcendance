import { User as PrismaUser } from "@prisma/client";

// export type SearchUserModel = PrismaUser && {
//   createdAt: Date;
//   updatedAt: Date;
//   user_id: string;
//   login: string;
//   email: string;
//   hash: string;
//   rt
//   faEnabled: boolean | null;
//   avatar: string | undefined;
//   provider: string;
//   status: string | null;
//   blocked: SearchUserModel[];
//   friends: SearchUserModel[];
//   friendOf: SearchUserModel[];
//   totalFriends: number | 0;
//   FriendRequestSent: FriendRequest[];
//   FriendRequestReceived: FriendRequest[];
//   blockedBy: SearchUserModel[];
//   totalBlockedFriends: number | 0;
//   totalMatches: number | 0;
//   totalWins: number | 0;
//   totalloss: number | 0;
//   level: number | 0;
//   rank: number | 0;
//   p1: Match[];
//   p2: Match[];
//   FriendSuggestions: string[];
//   channels: Channel[];
//   createdChannels: Channel[];
//   adminChannels: Channel[];
//   ownedChannels: Channel[];
//   bannedFromChannels: Channel[];
//   MutedInChannels: Channel[];
// };

// export type Match = {
//   match_id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   player1Id: string;
//   player1: SearchUserModel;
//   player2Id: string;
//   player2: SearchUserModel;
//   duration: Date | null;
//   p1_rankbfmatch: number;
//   p1_rankafmatch: number;
//   p2_rankbfmatch: number;
//   p2_rankafmatch: number;
//   p1_score: number | null;
//   p2_score: number | null;
//   winner_score: number | null;
//   ago: Date | null;
// };

// export type Channel = {
//   name: string;
//   channelId?: number;
//   members: UserByLogin[];
//   createdBy: UserByLogin;
//   ownedBy: UserByLogin;
//   admins: UserByLogin[];
//   banned?: UserByLogin[];
//   muted?: UserByLogin[];
//   protected_by_password?: boolean;
//   type?: string;
//   key?: string;
//   chatHistory?: ChatMessage[];
//   avatar?: string;
// };

// export type ChannelModel = {
//   name: string;
//   avatar: string | undefined;
//   channelId: number;
//   members: SearchUserModel[];
//   createdBy: SearchUserModel;
//   createdById: string;
//   ownedBy: SearchUserModel;
//   ownedById: string;
//   admins: SearchUserModel[];
//   banned: SearchUserModel[];
//   muted: SearchUserModel[];
//   createdAt: Date;
//   updatedAt: Date;
//   type: string;
//   key: string | null;
//   chatHistory: ChatMessage[];
// };

// a chat is eather a one to one conversation (UserByLogin) or a group conversation (Channel)
// export type DisplayedChat = Channel;

export type ChatMessage = {
  id?: number;
  sentBy: string;
  sentById: string;
  senderSocketId: string;
  message: string;
  sentAt: Date;
  img?: string;
  preview?: string;
  incoming: boolean;
  outgoing: boolean;
  subtype?: string;
  reply?: string;
  channel: string;
  channelById: string;
};

// export type MessageModel = {
//   id: number;
//   sentBy: SearchUserModel;
//   sentById: string;
//   message: string;
//   sentAt: Date;
//   img: string | null;
//   preview: string | null;
//   incoming: boolean;
//   outgoing: boolean;
//   subtype: string | null;
//   reply: string | null;
//   channel: Channel | null;
//   channelById: string | null;
// };

export type UserByLogin = {
  login: string;
  avatar: string;
};

// export type FriendRequest = {
//   id: string;
//   sender: SearchUserModel;
//   senderId: string;
//   receiver: SearchUserModel;
//   receiverId: string;
//   SenderAv: string;
//   status: RequestStatus;
//   createdAt: Date;
// };

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

export enum FriendshipError {
  ALLUSERS = 1,
  REQUEST = 2,
  ACTUALUSER = 3,
  SUGGESTIONS = 4,
  FRIENDS = 5,
  BLOCKEDFRIENDS = 6,
}

export type UserDetails = {
  login: string;
  email: string;
  displayName: string;
  avatar: string;
};

export enum Status {
  Online,
  Offline,
  Playing,
}
