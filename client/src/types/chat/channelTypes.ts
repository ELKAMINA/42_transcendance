import { UserByLogin, UserModel } from "../users/userType"
import { ChatMessage } from "./messageType"

export type Channel = {

	name: string,
	channelId?: number,
	members: UserByLogin[],
	createdBy: UserByLogin,
	ownedBy: UserByLogin,
	admins: UserByLogin[],
	banned?: UserByLogin[],
	muted?: UserByLogin[],
	pbp?: boolean,
	type?: string,
	key?: string,
	chatHistory?: ChatMessage[],
	avatar?: string,

}

export type ChannelModel = {
	name: string;
	avatar: string | undefined;
	channelId: number;
	members: UserModel[];
	createdBy: UserModel;
	createdById: string;
	ownedBy: UserModel;
	ownedById: string;
	admins: UserModel[];
	banned: UserModel[];
	muted: UserModel[];
	createdAt: Date;
	updatedAt: Date;
	type: string;
	pbp: boolean;
	key: string | null;
	chatHistory: ChatMessage[];
}

// a chat is eather a one to one conversation (UserByLogin) or a group conversation (Channel)
export type DisplayedChat = Channel