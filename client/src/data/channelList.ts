import chihiro from "../assets/profile_pictures/chihiro.jpeg"
import totoro from "../assets/profile_pictures/totoro.jpeg"
import { Channel } from '../types/chat/chatTypes'

export const channelList:Channel[] = [
	{
		login: 'Chihiro',
		id: 0,
		owner: 'casper_le_fantome',
		avatar: chihiro,
		type: 'public',
		protected_by_password: true,
		password: 'kirikou',
		userList: [],
		chatHistory: [],
	},

	{
		login: 'Totoro',
		id: 1,
		owner: 'satsuki_3003',
		avatar: totoro,
		type: 'private',
		protected_by_password: false,
		password: 'kirikou',
		userList: [],
		chatHistory: [],
	},

]