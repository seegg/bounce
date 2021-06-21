class Ball {
  private static baseId = 1;
  readonly id: number;
  position: { x: number, y: number }
  radius: number;
  rotation: number;
  velocity: Velocity;
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
    this.position.x += this.velocity.vX * ellapsedTime;
    this.position.y += this.velocity.vY * ellapsedTime;
  }

  /**
   * move the ball by x and y amount.
   */
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

  wallBounce(wall: Wall) {
    switch (wall) {
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
    if (this.selected || ball2.selected) return;
    if (this.collided.includes(ball2.id) || ball2.collided.includes(this.id)) return;

    ball2.collided.push(this.id);

    const distance = util.distanceBetween2Points(this.position, ball2.position);

    const twoRadii = this.radius + ball2.radius;
    if (distance <= twoRadii) {
      console.log('bounce');
      const velocity1 = util.getBallCollisionVelocity(this, ball2);
      const velocity2 = util.getBallCollisionVelocity(ball2, this);
      this.velocity = velocity1;
      ball2.velocity = velocity2;
    }
  }

}