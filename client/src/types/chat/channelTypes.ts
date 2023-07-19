import { UserByLogin, UserModel } from "../users/userType"
import { ChatMessage } from "./messageType"

export type Channel = {

	name: string
	channelId?: number
	members: UserByLogin[],
	createdBy: UserByLogin,
	admins: UserByLogin[],
	protected_by_password?: boolean
	type?: string
	key?: string
	chatHistory?: ChatMessage[],
	avatar?: string

}


export type ChannelModel = {
	name: string;
	channelId: number;
	members: UserModel[];
	createdBy: UserModel | null;
	createdById: string | null;
	admins: UserModel[];
	createdAt: Date;
	updatedAt: Date;
	type: string;
	key: string | null;
	chatHistory: ChatMessage[];
}

// a chat is eather a one to one conversation (UserByLogin) or a group conversation (Channel)
export type DisplayedChat = Channel