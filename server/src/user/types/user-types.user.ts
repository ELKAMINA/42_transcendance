import { User as PrismaUser } from '@prisma/client';
import { Channel } from '@prisma/client';

export type SearchUserModel = PrismaUser & {
  ownedChannels: Channel[];
  adminChannels: Channel[];
  channels: Channel[];
};

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

export type UserByLogin = {
  login: string;
  avatar: string;
};

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

export type FriendRequest = {
  id: string;
  sender: UserModel;
  senderId: string;
  receiver: UserModel;
  receiverId: string;
  SenderAv: string;
  status: RequestStatus;
  createdAt: Date;
};

export type Match = {
  match_id: string;
  createdAt: Date;
  updatedAt: Date;
  player1Id: string;
  player1: UserModel;
  player2Id: string;
  player2: UserModel;
  duration: Date | null;
  p1_rankbfmatch: number;
  p1_rankafmatch: number;
  p2_rankbfmatch: number;
  p2_rankafmatch: number;
  p1_score: number | null;
  p2_score: number | null;
  winner_score: number | null;
  ago: Date | null;
};

export enum Status {
  Online,
  Offline,
  Playing,
}

export type UserModel = {
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
  login: string;
  email: string | null;
  hash: string | null;
  rtHash: string | null;
  fA: string | null;
  faEnabled: boolean | null;
  // avatar: string | null;
  avatar: string | undefined;
  status: Status | null;
  friends: UserModel[];
  friendOf: UserModel[];
  totalFriends: number | null;
  FriendRequestSent: FriendRequest[];
  FriendRequestReceived: FriendRequest[];
  blocked: UserModel[];
  blockedBy: UserModel[];
  totalBlockedFriends: number | null;
  totalMatches: number | null;
  totalWins: number | null;
  totalloss: number | null;
  level: number | null;
  rank: number | null;
  p1: Match[];
  p2: Match[];
  FriendSuggestions: string[];
  channels: Channel[];
  createdChannels: Channel[];
  adminChannels: Channel[];
  messagesSent: ChatMessage[];
};

export type UserDetails = {
  login: string;
  email: string;
  displayName: string;
  avatar: string;
};
