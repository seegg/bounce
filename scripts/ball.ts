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

  // Update the position and state of the ball after every frame
  updatePosition(gravity: number, deceleration: number, ellapsedTime: number): void {
    if (this.selected) return;
  }

  move(x: number, y: number): void {
    this.position.x += x;
    this.position.y += y;
  }

  /**
   * Reverse the position of the ball base on 
   * the distance of the intersection.
   */
  reverseDistance(distance: number): void {
    const velocityRatio = Math.sqrt(Math.pow(distance, 2) / (Math.pow(this.velocity.vX, 2) + Math.pow(this.velocity.vY, 2))) * -1;
    this.position.x += this.velocity.vX * velocityRatio;
    this.position.y += this.velocity.vY * velocityRatio;
  }

  getTotalVelocity(): number {
    return Math.sqrt(Math.pow(this.velocity.vX, 2) + Math.pow(this.velocity.vY, 2));
  }

  containsPoint(x: number, y: number): boolean {
    return Math.pow(x - this.position.x, 2) + Math.pow(y - this.position.y, 2) <= Math.pow(this.radius, 2);
  }

  resetCollided(): void {
    this.collided = [this.id]
  }

  wallBounce(side: 'left' | 'right' | 'top' | 'bottom') {
    switch (side) {
      case 'left':
        this.velocity.vX *= -1;
        break;
      case 'right':
        this.velocity.vX *= -1;
        break;
      case 'top':
        this.velocity.vY *= -1;
        break;
      case 'bottom':
        this.velocity.vY *= -1;
        break;
    }
  }

  ballBounce(ball2: Ball): void {
    if ((this.velocity.vX === 0 && ball2.velocity.vY === 0) ||
      this.collided.includes(ball2.id)) return;

    const centerToCenterDist = Math.sqrt(
      Math.pow(this.position.x - ball2.position.x, 2) +
      Math.pow(this.position.y - ball2.position.y, 2));

    const radiusTotal = this.radius + ball2.radius;
    if (centerToCenterDist < radiusTotal) {
      const overlap = centerToCenterDist - radiusTotal;
      this.reverseDistance(overlap);
      const [vX, vY] = util.getBallCollisionVelocity(this, ball2);
      const [vX2, vY2] = util.getBallCollisionVelocity(ball2, this);
      this.velocity = { vX, vY };
      ball2.velocity = { vX: vX2, vY: vY2 };
      this.collided.push(ball2.id);
    }
  }

}