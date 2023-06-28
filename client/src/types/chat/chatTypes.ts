import { UserDetails } from "../users/userType"
import { ChatElement } from "../../data/chatHistory"

export type Channel = {

	name: string
	channelId: number
	members: UserDetails[],
	createdBy: string
	protected_by_password: boolean
	type: string
	key: string
	chatHistory: ChatElement[],
	avatar: string

}

export type OneToOne = {

	login: string
	id: number
	owner: string
	avatar: string
	type: string
	chatHistory: ChatElement[],

}

// a chat is eather a one to one conversation (UserDetails) or a group conversation (Channel)
export type DisplayedChat = Channel /* | OneToOne */