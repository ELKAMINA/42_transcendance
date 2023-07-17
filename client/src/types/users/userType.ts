export type UserDetails = {
	login: string;
	email: string;
	displayName: string;
	avatar: string;
};
// 
export type UserModel = {
	createdAt: Date,
	updatedAt: Date,
	user_id: string,
	login: string,
	email?: string,
	// hash: ,
	// rtHash: ,
	// fA: ,
	faEnabled: boolean,
	avatar: string,
	status: string,
	friends: UserModel[],
	friendOf: UserModel[],
	totalFriends: number,
	// FriendRequestSent: ,
	// FriendRequestReceived: ,
	blocked: UserModel[],
	blockedBy: UserModel[],
	totalBlockedFriends: number,
	totalMatches: number,
	totalWins: number,
	totalloss:  number,
	level: number,
	rank: number, 
	// p1: ,
	// p2: ,
}