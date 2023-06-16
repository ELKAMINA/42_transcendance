import { User } from "./userList";
import chihiro from "../assets/profile_pictures/chihiro.jpeg"
import totoro from "../assets/profile_pictures/totoro.jpeg"

export type Channel = {

	name: string
	id: number
	owner: string
	profile_picture: string
	type: string
	protected_by_password: boolean
	password: string
	userList: User[]

}


export const channelList:Channel[] = [
	{
		name: 'Chihiro',
		id: 0,
		owner: 'casper_le_fantome',
		profile_picture: chihiro,
		type: 'public',
		protected_by_password: true,
		password: 'kirikou',
		userList: []
	},

	{
		name: 'Totoro',
		id: 1,
		owner: 'satsuki_3003',
		profile_picture: totoro,
		type: 'private',
		protected_by_password: false,
		password: 'kirikou',
		userList: []
	},

]