import { UserDetails } from "../users/userType"

export type Channel = {

	login: string
	id: number
	owner: string
	avatar: string
	type: string
	protected_by_password: boolean
	password: string
	userList: UserDetails[]

}

// a chat is eather a one to one conversation (UserDetails) or a group conversation (Channel)
export type DisplayedChat = UserDetails | Channel