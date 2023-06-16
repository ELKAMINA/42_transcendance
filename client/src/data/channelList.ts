import { User } from "./userList";
import chihiro from "../assets/profile_pictures/chihiro.jpeg"
import totoro from "../assets/profile_pictures/totoro.jpeg"

export type Channel = {

	login: string
	id: number
	owner: string
	avatar: string
	type: string
	protected_by_password: boolean
	password: string
	userList: User[]

}


export const channelList:Channel[] = [
	{
		login: 'Chihiro',
		id: 0,
		owner: 'casper_le_fantome',
		avatar: chihiro,
		type: 'public',
		protected_by_password: true,
		password: 'kirikou',
		userList: []
	},

	{
		login: 'Totoro',
		id: 1,
		owner: 'satsuki_3003',
		avatar: totoro,
		type: 'private',
		protected_by_password: false,
		password: 'kirikou',
		userList: []
	},

]