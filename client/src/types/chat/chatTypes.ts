import { UserDetails } from "../users/userType"
import { ChatElement } from "../../data/chatHistory"

export type Channel = {

	login: string
	id: number
	owner: string
	avatar: string
	type: string
	protected_by_password: boolean
	password: string
	userList: UserDetails[],
	chatHistory: ChatElement[],

}

export type OneToOne = {

	login: string
	id: number
	owner: string
	avatar: string
	chatHistory: ChatElement[],

}

// a chat is eather a one to one conversation (UserDetails) or a group conversation (Channel)
export type DisplayedChat = Channel /* | OneToOne */