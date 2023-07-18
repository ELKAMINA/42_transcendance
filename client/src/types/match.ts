import { UserModel } from "./users/userType";

export type Match = {
	match_id: string;
	createdAt: Date;
	updatedAt: Date;
	player1Id: string;
	player1: UserModel;
	player2Id: string;
	player2: UserModel;
	duration: Date | null;
	p1_rankbfmatch: number;
	p1_rankafmatch: number;
	p2_rankbfmatch: number;
	p2_rankafmatch: number;
	p1_score: number | null;
	p2_score: number | null;
	winner_score: number | null;
	ago: Date | null;
}