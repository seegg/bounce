let initialBallId = 1;
class Ball {
  readonly id: number;
  position: { x: number, y: number }
  radius: number;
  rotation: number;
  velocity: { vX: number, vY: number };
  selected: boolean;
  // The img associated with an instance of Ball
  img: string;

  constructor(x: number, y: number, r: number, imgSrc: string, selected: boolean = false) {
    this.id = initialBallId;
    initialBallId++;
    this.position = { x, y }
    this.radius = r;
    this.img = imgSrc;
    this.selected = selected;
  }

  // Update the position of the ball after every frame
  updatePosition(gravity: number, deceleration: number,): void {

  }

  reverseDirection(distance: number) {

  }

}