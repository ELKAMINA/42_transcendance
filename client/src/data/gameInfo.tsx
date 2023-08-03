export interface gameInfo {
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
    ballColor: string;
    paddleColor: string;
    netColor: string;
}

export enum client_gameType {
    RANDOM,
    ONETOONE,
}

export interface roomInfo {
    type: client_gameType;
    sender: string;
    receiver: string;
}

export interface PongProps {
    room: gameInfo;
}
