class GameSettings {
    private totalSet: number;
    private totalPoint: number;
    private mapName: string;
    private hasPower: boolean;
    private playerSpeed: number;
    private ballSpeed: number;

    constructor(
        totalSet: number,
        totalPoint: number,
        mapName: string,
        hasPower: boolean,
        playerSpeed: number,
        ballSpeed: number
    ) {
        this.totalSet = totalSet;
        this.totalPoint = totalPoint;
        this.mapName = mapName;
        this.hasPower = hasPower;
        this.playerSpeed = playerSpeed;
        this.ballSpeed = ballSpeed;
    }

    /*** GETTER ***/
    getTotalSet(): number {
        return this.totalSet;
    }

    getTotalPoint(): number {
        return this.totalPoint;
    }

    getMapName(): string {
        return this.mapName;
    }

    getHasPower(): boolean {
        return this.hasPower;
    }

    getPlayerSpeed(): number {
        return this.playerSpeed;
    }

    getBallSpeed(): number {
        return this.ballSpeed;
    }

    /** SETTER ***/
    setTotalSet(newValue: number) {
        this.totalSet = newValue;
    }

    setTotalPoint(newValue: number) {
        this.totalPoint = newValue;
    }

    setMapName(newValue: string) {
        this.mapName = newValue;
    }

    setHasPower(newValue: boolean) {
        this.hasPower = newValue;
    }

    setPlayerSpeed(newValue: number) {
        this.playerSpeed = newValue;
    }

    setBallSpeed(newValue: number) {
        this.ballSpeed = newValue;
    }
}

export default GameSettings;
