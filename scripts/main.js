let initialBallId = 1;
class Ball {
    constructor(x, y, r, imgSrc, selected = false) {
        this.id = initialBallId;
        initialBallId++;
        this.position = { x, y };
        this.radius = r;
        this.img = imgSrc;
        this.selected = selected;
        this.collided = [this.id];
    }
    updatePosition(gravity, deceleration) {
    }
    reverseDirection(distance) {
    }
    resetCollided() {
        this.collided = [this.id];
    }
}
let balls = new Array(10).fill(0).map(_ => new Ball(0, 0, 10, ''));
console.log("balls", balls);
balls.forEach(ball => console.log(ball.id));
