class Ball {
    private position: Array<number>;
    private speed: number;
    private radius: number;
    private velocity: Array<number>;
    private isVisible: boolean;
    private color: string;

    constructor(position: Array<number>, speed: number) {
        this.position = [...position];
        this.speed = speed;
        this.radius = 10;
        this.velocity = [10, 10];
        this.isVisible = true;
        this.color = "#FFFFFF";
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
}
export default Ball;
