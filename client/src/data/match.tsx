import { UserModel } from "../types/users/userType";

export type match = {
    match_id: string;
    createdAt: string;
    player1Id: String;
    player2Id: string;
    p1_score: string;
    p2_score: string;
    winnerName: string;
};
