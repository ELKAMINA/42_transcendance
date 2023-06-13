import { User } from "./userList";

export interface Channel {
	name: string;
	id: number;
	type: string;
	protected_by_password: boolean
	password: string,
	userList: User[]
  }

export const channelList:Channel[] = [
	{
		name: 'channel_0',
		id: 0,
		type: 'public',
		protected_by_password: true,
		password: 'kirikou',
		userList: []
	},

	{
		name: 'channel_1',
		id: 1,
		type: 'private',
		protected_by_password: false,
		password: 'kirikou',
		userList: []
	},

]