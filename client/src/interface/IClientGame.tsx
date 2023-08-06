import { EClientPlayType } from "../enum/EClientGame";

// OLD NAME roomInfo
export interface IPlayInfo {
    type: EClientPlayType;
    sender: string;
    receiver: string;
}

export interface IPongProps {
    room: IRoomInfo;
}

// OLD NAME gameInfo
export interface IRoomInfo {
    id: string;
    createdDate: Date;
    totalSet: number;
    totalPoint: number;
    mapName: string;
    power: boolean;
    isFull: boolean;
    players: string[];
    scorePlayers: number[];
    playerOneId: string;
    playerTwoId: string;
    gameStatus: number;
    boardColor: string;
    netColor: string;
    scoreColor: string;
    ballColor: string;
    paddleColor: string;
}
