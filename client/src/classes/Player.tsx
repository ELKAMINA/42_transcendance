class Player {
    private userInfo: Array<string>; // [socketId, name]
    private paddlePosition: Array<number>; // [posX, posY]
    private score: number;
    private paddleSpeed: number;
    private paddleColor: string;
    private paddleDimension: Array<number>; // [width, height]
    private paddleTop: number;
    private paddleBottom: number;
    private paddleLeft: number;
    private paddleRight: number;

    constructor(
        userInfo: Array<string>,
        position: Array<number>,
        paddleSpeed: number,
        paddleColor: string
    ) {
        this.userInfo = userInfo;
        this.paddlePosition = position;
        this.score = 0;
        this.paddleSpeed = paddleSpeed;
        this.paddleColor = paddleColor;
        this.paddleDimension = [10, 100];
        this.paddleTop = position[1]; // Y CORRDINATE
        this.paddleBottom = 50; // HEIGHT OF THE PADDLE
        this.paddleLeft = position[0]; // X CORRDINATE
        this.paddleRight = 10; // WIDTH OF THE PADDLE
    }

    /*** GETTER ***/
    getUserInfo(): Array<string> {
        return this.userInfo;
    }

    getPaddlePosition(): Array<number> {
        return this.paddlePosition;
    }

    getPaddlePositionX(): number {
        return this.paddlePosition[0];
    }

    getPaddlePositionY(): number {
        return this.paddlePosition[1];
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

    getPaddleDimensionX(): number {
        return this.paddleDimension[0];
    }

    getPaddleDimensionY(): number {
        return this.paddleDimension[1];
    }

    getPaddleTop(): number {
        return this.paddleTop;
    }

    getPaddleBottom(): number {
        return this.paddleBottom;
    }

    getPaddleLeft(): number {
        return this.paddleLeft;
    }

    getPaddleRight(): number {
        return this.paddleRight;
    }

    /*** SETTER ***/
    setPaddlePosition(newValue: Array<number>) {
        this.paddlePosition = [...newValue];
    }

    // setScore() {
    //     this.score += 1;
    // }

    setScore(newValue: number) {
        this.score = newValue;
    }

    setPaddleSpeed(newValue: number) {
        this.paddleSpeed = newValue;
    }

    setPaddleColor(newValue: string) {
        this.paddleColor = newValue;
    }

    setPaddleTop(newValue: number) {
        this.paddleTop = newValue;
    }

    setPaddleBottom(newValue: number) {
        this.paddleBottom = newValue;
    }

    setPaddleLeft(newValue: number) {
        this.paddleLeft = newValue;
    }

    setPaddleRight(newValue: number) {
        this.paddleRight = newValue;
    }
}

export default Player;
