export interface gameInfo {
	opponent: string,
	allRoomInfo : {
		id: string;
		createdDate: number;
		totalSet: Number;
		totalPoint: Number;
		mapName: string;
		power: boolean;
		isFull: boolean;
		players: string[];
		scorePlayers: number[];
		playerOneId: string;
		playerTwoId: string;
	}
  }