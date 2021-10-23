class Ball {
  private static baseId = 1;
  readonly id: number;
  position: Point;
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
    if (this.getTotalVelocity() === 0) {
    } else {
      const velocityRatio = Math.sqrt(Math.pow(distance, 2) / (Math.pow(this.velocity.vX, 2) + Math.pow(this.velocity.vY, 2))) * -1;
      this.position.x += this.velocity.vX * velocityRatio;
      this.position.y += this.velocity.vY * velocityRatio;
    }
  }

  getTotalVelocity(): number {
    return Math.sqrt(Math.pow(this.velocity.vX, 2) + Math.pow(this.velocity.vY, 2));
  }

  containsPoint(x: number, y: number): boolean {
    return Math.pow(x - this.position.x, 2) + Math.pow(y - this.position.y, 2) <= Math.pow(this.radius, 2);
  }

  /**
   * The overlap between this instance of ball and another ball
   */
  getOverlap(otherBall: Ball): number {
    const centerDistance = util.distanceBetween2Points(this.position, otherBall.position);
    const sumOfRadii = this.radius + otherBall.radius;
    const overlap = sumOfRadii - centerDistance;
    return overlap >= 0 ? overlap : -1;
  }
  /**
   * bounce off of a wall.
   * @param wall the side of the wall bouncing off of.
   */
  wallBounce(wall: Wall, mod: number) {
    switch (wall) {
      case 'left':
        this.velocity.vX *= (-1 / mod);
        if (Math.abs(this.velocity.vX) < 0.02) this.velocity.vX = 0;
        break;
      case 'right':
        this.velocity.vX *= (-1 / mod);
        if (Math.abs(this.velocity.vX) < 0.02) this.velocity.vX = 0;
        break;
      case 'top':
        this.velocity.vY *= -1 / mod;
        break;
      case 'bottom':
        this.velocity.vY *= -1 / mod;
        if (Math.abs(this.velocity.vY) < 0.01) this.velocity.vY = 0;
        break;
    }

  }

  /**
   * Check if this and ball2 are touching and then check the 
   * angle between the velocity and the line between the two centers.
   * if it's less than 90degrees then consider the balls to be colliding.
   */
  ballBounce(ball2: Ball): void {
    if (this.selected || ball2.selected) return;
    //check if the balls are touching.
    const overlap = this.getOverlap(ball2);
    if (overlap >= 0) {
      //check if the angle is less than or equal 90 degrees
      const centerToCenter = util.xyDiffBetweenPoints(this.position, ball2.position);
      const angle = util.angleBetween2DVector(this.velocity.vX, this.velocity.vY, centerToCenter[0], centerToCenter[1]) || 0;
      if (angle <= 90) {
        const modifier = 0.85;
        const velocity1 = util.getBallCollisionVelocity(this, ball2);
        const velocity2 = util.getBallCollisionVelocity(ball2, this);
        // velocity1.vX *= modifier;
        velocity1.vY *= modifier;
        // velocity2.vX *= modifier;
        velocity2.vY *= modifier;
        this.velocity = velocity1;
        ball2.velocity = velocity2;
      }
    }
  }

}