class Player {
    private userInfo: Array<string>; // [socketId, name]
    private paddlePosition: Array<number>; // [posX, posY]
    private score: number;
    private paddleSpeed: number;
    private paddleColor: string;
    private paddleDimension: Array<number>; // [width, height]

    constructor(
        userInfo: Array<string>,
        position: Array<number>,
        paddleSpeed: number
    ) {
        this.userInfo = userInfo;
        this.paddlePosition = position;
        this.score = 0;
        this.paddleSpeed = paddleSpeed;
        this.paddleColor = "#FFFFFF";
        this.paddleDimension = [10, 50];
    }

    /*** GETTER ***/
    getUserInfo(): Array<string> {
        return this.userInfo;
    }

    getPaddlePosition(): Array<number> {
        return this.paddlePosition;
    }

    getScore(): number {
        return this.score;
    }

    getPaddleSpeed(): number {
        return this.paddleSpeed;
    }

    getPaddleColor(): string {
        return this.paddleColor;
    }

    getPaddleDimension(): Array<number> {
        return this.paddleDimension;
    }

    /*** SETTER ***/
    setPaddlePosition(newValue: Array<number>) {
        this.paddlePosition = [...newValue];
    }

    setScore(newValue: number) {
        this.score = newValue;
    }

    setPaddleSpeed(newValue: number) {
        this.paddleSpeed = newValue;
    }

    setPaddleColor(newValue: string) {
        this.paddleColor = newValue;
    }
}

export default Player;
