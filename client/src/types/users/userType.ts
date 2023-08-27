import { Channel } from "../chat/channelTypes";
import { ChatMessage } from "../chat/messageType";
import { FriendRequest } from "../friendRequest";
import { Match } from "../match";

export enum Status {
    Online,
    Offline,
    Playing,
}

// this is type specially made for sending a
// request to the server without sending an
// unecessary amount of data
export type UserByLogin = {
    login: string;
};

// this type should be used for any user retrieved
// from the database, through the AppSelector()
export type UserModel = {
    createdAt: Date;
    updatedAt: Date;
    user_id: string;
    login: string;
    // email: string | null;
    // hash: string | null;
    // rtHash: string | null;
    // fA: string | null;
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

export type UserModelProtected = {
    createdAt: Date;
    updatedAt: Date;
    user_id: string;
    login: string;
    faEnabled: boolean | null;
    // avatar: string | null;
    avatar: string | undefined;
    status: string | undefined;
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

export type UserLeaderBoard = {
    login: string;
    avatar: string | undefined;
    totalMatches: number | null;
    totalWins: number | null;
    totalloss: number | null;
    level: number | null;
    rank: number | null;
};
