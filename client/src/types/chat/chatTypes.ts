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

// a chat is eather a one to one conversation (UserDetails) or a group conversation (Channel)
export type DisplayedChat = Channel