class Ball {
    private position: Array<number>; // [posX, posY]
    private speed: number;
    private radius: number;
    private velocity: Array<number>;
    private isVisible: boolean;
    private color: string;
    private ballTop: number;
    private ballBottom: number;
    private ballLeft: number;
    private ballRight: number;
    private canBeCollided: boolean;

    constructor(position: Array<number>, speed: number, color: string) {
        this.position = [...position];
        this.speed = speed;
        this.radius = 10;
        this.velocity = [4, 4];
        this.isVisible = true;
        this.color = color;
        this.ballTop = this.position[1] - this.radius;
        this.ballBottom = this.position[1] + this.radius;
        this.ballLeft = this.position[0] - this.radius;
        this.ballRight = this.position[0] + this.radius;
        this.canBeCollided = true;
    }

    /*** GETTER ***/
    getPosition(): Array<number> {
        return this.position;
    }

    getPositionX(): number {
        return this.position[0];
    }

    getPositionY(): number {
        return this.position[1];
    }

    getSpeed(): number {
        return this.speed;
    }

    getRadius(): number {
        return this.radius;
    }

    getVelocity(): Array<number> {
        return this.velocity;
    }

    getVelocityX(): number {
        return this.velocity[0];
    }

    getVelocityY(): number {
        return this.velocity[1];
    }

    getIsVisible(): boolean {
        return this.isVisible;
    }

    getColor(): string {
        return this.color;
    }

    getBallTop(): number {
        return this.ballTop;
    }

    getBallBottom(): number {
        return this.ballBottom;
    }

    getBallLeft(): number {
        return this.ballLeft;
    }

    getBallRight(): number {
        return this.ballRight;
    }

    getCanBeCollided(): boolean {
        return this.canBeCollided;
    }

    /*** SETTER ***/
    setPosition(newValue: Array<number>) {
        this.position = newValue;
    }

    setPositionX(newValue: number) {
        this.position[0] = newValue;
    }

    setPositionY(newValue: number) {
        this.position[1] = newValue;
    }

    setSpeed(newValue: number) {
        this.speed = newValue;
    }

    setRadius(newValue: number) {
        this.radius = newValue;
    }

    setVelocity(newValue: Array<number>) {
        this.velocity = newValue;
    }

    setVelocityX(newValue: number) {
        this.velocity[0] = newValue;
    }

    setVelocityY(newValue: number) {
        this.velocity[1] = newValue;
    }

    setIsVisible(newValue: boolean) {
        this.isVisible = newValue;
    }

    setColor(newValue: string) {
        this.color = newValue;
    }

    setBallTop(newValue: number) {
        this.ballTop = newValue;
    }

    setBallBottom(newValue: number) {
        this.ballBottom = newValue;
    }

    setBallLeft(newValue: number) {
        this.ballLeft = newValue;
    }

    setBallRight(newValue: number) {
        this.ballRight = newValue;
    }

    setCanBeCollided(newValue: boolean) {
        this.canBeCollided = newValue;
    }
}
export default Ball;
