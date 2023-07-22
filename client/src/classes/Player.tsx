class Player {
	private userInfo: Array<string>; // [socketId, name]
	private paddlePosition: Array<number>; // [posX, posY]
	private score: number;
	private paddleSpeed: number;
	private paddleColor: string
	private paddleDimension: Array<number>; // [width, height]

	constructor(userInfo: Array<string>, position: Array<number>) {
		this.userInfo = [...userInfo];
		this.paddlePosition = [...position];
		this.score = 0;
		this.paddleSpeed = 100;
		this.paddleColor = "#FFFFFFF";
		this.paddleDimension = [10, 50];
	}

	/*** GETTER ***/
	getUserInfo(): Array<string> {
		return this.userInfo;
	}

	getPaddlePosition(): Array<number>{
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
	setPaddlePosition(paddlePosition: Array<number>){
		this.paddlePosition = [...paddlePosition];
	}

	setScore(score: number) {
		this.score = score;
	}

	setPaddleSpeed(paddleSpeed: number) {
		this.paddleSpeed = paddleSpeed;
	}

	setPaddleColor(paddleColor: string) {
		this.paddleColor = paddleColor;
	}
}

export default Player;