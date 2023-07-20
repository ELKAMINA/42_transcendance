import { UserModel } from "../users/userType"
import { Channel } from "./channelTypes"

export type ChatMessage = {
	id?: number
	sentBy: string
	sentById: string
	senderSocketId: string 
	message: string
	sentAt: Date
	img?: string;
	preview?: string
	incoming: boolean
	outgoing: boolean
	subtype?: string
	reply?: string
	channel: string
	channelById: string
}

export type MessageModel = {
	id: number;
	sentBy: UserModel;
	sentById: string;
	message: string;
	sentAt: Date;
	img: string | null;
	preview: string | null;
	incoming: boolean;
	outgoing: boolean;
	subtype: string | null;
	reply: string | null;
	channel: Channel | null;
	channelById: string | null;
  }