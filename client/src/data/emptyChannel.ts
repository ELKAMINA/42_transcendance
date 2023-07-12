import { Channel } from "../types/chat/channelTypes";

export const emptyChannel : Channel = {
	name : 'empty channel',
	createdBy : {login : 'casper_le_fantome', displayName : 'casper_le_fantome', email: 'casper@fantome.soul', avatar : 'white_sheet'},
	members : [],
	admins: [{login : 'casper_le_fantome', displayName : 'casper_le_fantome', email: 'casper@fantome.soul', avatar : 'white_sheet'},],
}
