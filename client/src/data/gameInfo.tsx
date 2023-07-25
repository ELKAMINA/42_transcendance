export interface gameInfo {
    opponent: string;
    allRoomInfo: {
        id: string;
        createdDate: number;
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
