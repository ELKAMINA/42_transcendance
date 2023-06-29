import chihiro from "../assets/profile_pictures/chihiro.jpeg"
import totoro from "../assets/profile_pictures/totoro.jpeg"
import { Channel } from '../types/chat/channelTypes'

export const channelList:Channel[] = [
	{
		name: 'Chihiro',
		channelId: 0,
		createdBy: 'casper_le_fantome',
		avatar: chihiro,
		type: 'public',
		protected_by_password: true,
		key: 'kirikou',
		members: [],
		chatHistory: [],
	},

	{
		name: 'Totoro',
		channelId: 1,
		createdBy: 'satsuki_3003',
		avatar: totoro,
		type: 'private',
		protected_by_password: false,
		key: 'kirikou',
		members: [],
		chatHistory: [],
	},

]