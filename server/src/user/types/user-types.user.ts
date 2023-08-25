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

export type UserDetails = {
  login: string;
  email: string;
  displayName: string;
  avatar: string;
};
