import { UserDetails } from "../users/userType"
import { Channel } from "./channelTypes"

export type ChatMessage = {
	id?: number,
	sentBy: string
	sentTo: Channel
	message: string
	sentAt: Date
	img?: string;
	preview?: string
	incoming: boolean
	outgoing: boolean
	subtype?: string
	reply?: string
	channel: Channel
}
