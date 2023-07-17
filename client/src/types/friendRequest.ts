import { UserModel } from "./users/userType";

export type FriendRequest = {
	id: string;
	sender: UserModel;
	senderId: string;
	receiver: UserModel;
	receiverId: string;
	SenderAv: string;
	status: RequestStatus;
	createdAt: Date;
}

export enum RequestStatus {
	PENDING = "PENDING",
	APPROVED = "APPROVED",
	DECLINED = "DECLINED"
}