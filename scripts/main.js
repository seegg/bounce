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
  updatePosition (gravity, deceleration) {
  }
  reverseDirection (distance) {
  }
  resetCollided () {
    this.collided = [this.id];
  }
  ballBounce (ball) {
    if (ball.collided.includes(this.id))
      return;
  }
}
