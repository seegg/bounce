class Ball {
  private static baseId = 1;
  readonly id: number;
  position: { x: number, y: number }
  radius: number;
  rotation: number;
  velocity: Velocity;
  selected: boolean;
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
    Ball.baseId++;
  }

  /**
   * update the position of the ball base on various variables.
   */
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
   * Reverse the position of the ball
   * by a given distance in the opposite direction
   * of its velocity.
   */
  reversePosition(distance: number): void {
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

  /**
   * Check if this and ball2 are touching and then check the 
   * angle between the velocity and the line between the two centers.
   * if it's less than 90degrees then consider the balls to be colliding.
   */
  ballBounce(ball2: Ball): void {

    const distance = util.distanceBetween2Points(this.position, ball2.position);
    const twoRadii = this.radius + ball2.radius;

    //check if balls is touching
    if (distance < twoRadii) {
      const centerToCenter = util.xyDiffBetweenPoints(this.position, ball2.position);
      const angle = util.angleBetween2DVector(this.velocity.vX, this.velocity.vY, centerToCenter[0], centerToCenter[1]) || 0;
      if (angle < 90) {
        const velocity1 = util.getBallCollisionVelocity(this, ball2);
        const velocity2 = util.getBallCollisionVelocity(ball2, this);
        this.velocity = velocity1;
        ball2.velocity = velocity2;
      }
    }
  }

}