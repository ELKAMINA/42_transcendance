class Ball {
    private position: Array<number>;
    private speed: number;
    private radius: number;
    private isVisible: boolean;
    private color: string;

    constructor(position: Array<number>, speed: number) {
        this.position = [...position];
        this.speed = speed;
        this.radius = 0;
        this.isVisible = true;
        this.color = "#FFFFFF";
    }

    /*** GETTER ***/
    getPosition(): Array<number> {
        return this.position;
    }

    getSpeed(): number {
        return this.speed;
    }

    getRadius(): number {
        return this.radius;
    }

    getIsVisible(): boolean {
        return this.isVisible;
    }

    getColor(): string {
        return this.color;
    }

    /*** SETTER ***/
    setPosition(newValue: Array<number>) {
        this.position = [...newValue];
    }

    setSpeed(newValue: number) {
        this.speed = newValue;
    }

    setRadius(newValue: number) {
        this.radius = newValue;
    }

    setIsVisible(newValue: boolean) {
        this.isVisible = newValue;
    }

    setColor(newValue: string) {
        this.color = newValue;
    }
}
export default Ball;
