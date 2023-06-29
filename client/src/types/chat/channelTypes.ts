import { UserDetails } from "../users/userType"
import { ChatMessage } from "./messageType"

export type Channel = {

	name: string
	channelId?: number
	members?: UserDetails[],
	createdBy?: string
	protected_by_password?: boolean
	type?: string
	key?: string
	chatHistory?: ChatMessage[],
	avatar?: string

}

// a chat is eather a one to one conversation (UserDetails) or a group conversation (Channel)
export type DisplayedChat = Channel