class Ball {
  private static baseId = 1;
  readonly id: number;
  position: { x: number, y: number }
  radius: number;
  rotation: number;
  velocity: { vX: number, vY: number };
  selected: boolean;
  collided: number[];
  // The img associated with an instance of Ball
  img: ImageBitmap;

  constructor(img: ImageBitmap, x: number, y: number, r: number, selected: boolean = false) {
    this.id = Ball.baseId;
    this.position = { x, y }
    this.radius = r;
    this.rotation = 0;
    this.velocity = { vX: 0, vY: 0 }
    this.img = img;
    this.selected = selected;
    this.collided = [this.id];
    Ball.baseId++;
  }

  // Update the position of the ball after every frame
  updatePosition(gravity: number, deceleration: number, ellapsedTime: number): void {

  }

  reverseDistance(distance: number): void {

  }

  getTotalVelocity(): number {
    return Math.sqrt(Math.pow(this.velocity.vX, 2) + Math.pow(this.velocity.vY, 2));
  }

  resetCollided(): void {
    this.collided = [this.id]
  }

  wallBounce() {

  }

  ballBounce(ball2: Ball): void {
    if ((this.velocity.vX === 0 && ball2.velocity.vY === 0) ||
      this.collided.includes(ball2.id)) return;
    const centerToCenterDist = Math.sqrt(
      Math.pow(this.position.x - ball2.position.x, 2) +
      Math.pow(this.position.y - ball2.position.y, 2));

    const totalRadius = this.radius + ball2.radius;
    if (centerToCenterDist < totalRadius) {
      const overlap = centerToCenterDist - totalRadius;
      this.reverseDistance(overlap);
      const [vX, vY] = util.getBallCollisionVelocity(this, ball2);
      const [vX2, vY2] = util.getBallCollisionVelocity(ball2, this);
      this.velocity = { vX, vY };
      ball2.velocity = { vX: vX2, vY: vY2 };
    }
  }

}