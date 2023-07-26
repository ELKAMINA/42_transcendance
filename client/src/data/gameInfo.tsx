export interface gameInfo {
    opponent: string;
    allRoomInfo: {
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
    };
}
