import { Channel } from "../types/chat/channelTypes";

export const emptyChannel : Channel = {
	name : 'empty channel',
	createdBy : {login : 'casper_le_fantome', },
	members : [],
	admins: [{login : 'casper_le_fantome', },],
}
